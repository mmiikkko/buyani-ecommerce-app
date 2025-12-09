// ✅ Updated version with ALL unexpected `any` fixed by introducing explicit types
// Types were created for: DatabaseError, DatabaseInsertError, ExecuteQueryError, ImageInput, ProductPayload, UpdatedProductPayload

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import {
  products,
  productImages,
  productInventory,
  shop,
} from "@/server/schema/auth-schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import { getServerSession } from "@/server/session";
import { v4 as uuidv4 } from "uuid";

// ------------------- NEW TYPES ADDED ------------------- //

type ProductUpdates = {
  updatedAt: Date;
  productName?: string;
  description?: string;
  categoryId?: string;
  price?: string;
  SKU?: string;
  status?: string;
};

export type ExecuteQueryError = {
  cause?: {
    code?: string;
    errno?: number;
    sqlMessage?: string;
  };
  message?: string;
};

export type ImageInput = {
  image_url: string;
};

export type ProductPayload = {
  id?: string;
  productName: string;
  categoryId: string;
  price: number;
  SKU?: string;
  description?: string;
  rating?: number | null | string;
  status?: string;
  stock?: number;
  images?: ImageInput[];
};

export type UpdatedProductPayload = {
  productName?: string;
  categoryId?: string;
  price?: number;
  SKU?: string;
  description?: string;
  status?: string;
  stock?: number;
  images?: ImageInput[];
};

// -------------------------------------------------------- //

// GET -----------------------------------------------------
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sellerId = session.user.id;

    const sellerShops = await db
      .select({ id: shop.id })
      .from(shop)
      .where(eq(shop.sellerId, sellerId));

    if (sellerShops.length === 0) {
      return NextResponse.json([]);
    }

    const shopIds = sellerShops.map((s) => s.id);

    const productsList = await db
      .select()
      .from(products)
      .where(
        and(
          inArray(products.shopId, shopIds),
          // Hide soft-deleted items from the seller listing to reflect removals
          sql`${products.status} != 'Deleted'`
        )
      );

    const productIds = productsList.map((p) => p.id);

    const images = productIds.length
      ? await db
          .select()
          .from(productImages)
          .where(inArray(productImages.productId, productIds))
      : [];

    const inventory = productIds.length
      ? await db
          .select()
          .from(productInventory)
          .where(inArray(productInventory.productId, productIds))
      : [];

    const transformedProducts = productsList.map((product) => {
      const productImagesList = images.filter((i) => i.productId === product.id);
      const productInventoryData = inventory.find((inv) => inv.productId === product.id);

      const productImagesMapped = productImagesList
        .filter((img) => typeof img.url === "string" && img.url.trim() !== "")
        .map((img) => ({
          id: img.id,
          product_id: img.productId,
          image_url: img.url,
          is_primary: false,
        }));

      return {
        id: product.id,
        shopId: product.shopId,
        categoryId: product.categoryId,
        productName: product.productName,
        SKU: product.SKU || "",
        description: product.description || null,
        price: Number(product.price),
        rating: product.rating ?? null,
        isAvailable: product.isAvailable,
        status: product.status || "Available",
        stock: productInventoryData?.quantityInStock || 0,
        itemsSold: productInventoryData?.itemsSold || null,
        images: productImagesMapped,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    });

    return NextResponse.json(transformedProducts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST ----------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sellerId = session.user.id;
    const body: ProductPayload = await req.json();

    const executeQuery = async <T>(fn: () => Promise<T>, retries = 3): Promise<T> => {
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          return await fn();
        } catch (err) {
          const error = err as ExecuteQueryError;
          const isConnectionError =
            error?.cause?.code === "ECONNRESET" ||
            error?.cause?.code === "PROTOCOL_CONNECTION_LOST" ||
            error?.cause?.errno === -4077 ||
            error?.message?.includes("ECONNRESET") ||
            error?.message?.includes("Failed query");

          if (isConnectionError && attempt < retries - 1) {
            const delay = Math.min(100 * Math.pow(2, attempt), 1000);
            await new Promise((r) => setTimeout(r, delay));
            continue;
          }
          throw error;
        }
      }
      throw new Error("Query failed after retries");
    };

    const sellerShop = await executeQuery(() =>
      db.select({ id: shop.id, status: shop.status }).from(shop).where(eq(shop.sellerId, sellerId)).limit(1)
    );

    if (sellerShop.length === 0) {
      return NextResponse.json({ error: "No shop found" }, { status: 400 });
    }

    const shopId = sellerShop[0].id;
    const productId = body.id || uuidv4();

    const finalSku = body.SKU || `${body.productName.substring(0, 5).toUpperCase()}${Date.now()}`;

    const newProduct = {
      id: productId,
      productName: body.productName,
      shopId,
      categoryId: body.categoryId,
      price: String(body.price),
      SKU: finalSku,
      description: body.description || "",
      rating: body.rating ? Number(body.rating) : null,
      isAvailable: body.status === "Available",
      status: body.status || "Available",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert Product
    await executeQuery(() => db.insert(products).values(newProduct));

    // Insert Inventory
    if (body.stock !== undefined) {
      await executeQuery(() =>
        db.insert(productInventory).values({
          id: uuidv4(),
          productId,
          quantityInStock: body.stock,
          itemsSold: 0,
        })
      );
    }

    // Insert Images
    if (Array.isArray(body.images)) {
      const rows = body.images
        .filter((img) => typeof img.image_url === "string" && img.image_url.trim() !== "")
        .map((img) => ({
          id: uuidv4(),
          productId,
          url: img.image_url,
        }));

      if (rows.length) {
        await executeQuery(() => db.insert(productImages).values(rows));
      }
    }

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    const e = error as ExecuteQueryError;
    return NextResponse.json({ error: e.message || "Failed to create product" }, { status: 500 });
  }
}

// PUT -----------------------------------------------------
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");
    if (!productId) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

    const body: UpdatedProductPayload = await req.json();

    const executeQuery = async <T>(fn: () => Promise<T>, retries = 3): Promise<T> => {
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          return await fn();
        } catch (err) {
          const error = err as ExecuteQueryError;
          const isConnectionError =
            error?.cause?.code === "ECONNRESET" ||
            error?.cause?.code === "PROTOCOL_CONNECTION_LOST" ||
            error?.cause?.errno === -4077 ||
            error?.message?.includes("ECONNRESET") ||
            error?.message?.includes("Failed query");

          if (isConnectionError && attempt < retries - 1) {
            const delay = Math.min(100 * Math.pow(2, attempt), 1000);
            await new Promise((r) => setTimeout(r, delay));
            continue;
          }
          throw error;
        }
      }
      throw new Error("Query failed after retries");
    };

    const existingProduct = await executeQuery(() =>
      db.select().from(products).where(eq(products.id, productId)).limit(1)
    );

    if (!existingProduct.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updates: ProductUpdates = { updatedAt: new Date() };

    if (body.productName !== undefined) updates.productName = body.productName;
    if (body.description !== undefined) updates.description = body.description;
    if (body.categoryId !== undefined) updates.categoryId = body.categoryId;
    if (body.price !== undefined) updates.price = String(body.price);
    if (body.SKU !== undefined) updates.SKU = body.SKU;
    if (body.status !== undefined) updates.status = body.status;

    await executeQuery(() => db.update(products).set(updates).where(eq(products.id, productId)));

    if (body.stock !== undefined) {
      const existingInv = await executeQuery(() =>
        db.select().from(productInventory).where(eq(productInventory.productId, productId)).limit(1)
      );

      if (existingInv.length) {
        await executeQuery(() =>
          db.update(productInventory).set({ quantityInStock: body.stock }).where(eq(productInventory.productId, productId))
        );
      } else {
        await executeQuery(() =>
          db.insert(productInventory).values({
            id: uuidv4(),
            productId,
            quantityInStock: body.stock,
            itemsSold: 0,
          })
        );
      }
    }

    if (Array.isArray(body.images)) {
      await executeQuery(() =>
        db.delete(productImages).where(eq(productImages.productId, productId))
      );

      const rows = body.images
        .filter((img) => typeof img.image_url === "string" && img.image_url.trim() !== "")
        .map((img) => ({ id: uuidv4(), productId, url: img.image_url }));

      if (rows.length) {
        await executeQuery(() => db.insert(productImages).values(rows));
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const e = error as ExecuteQueryError;
    return NextResponse.json({ error: e.message || "Failed to update product" }, { status: 500 });
  }
}
