import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import {
  products,
  productImages,
  productInventory,
  shop,
} from "@/server/schema/auth-schema";
import { eq, inArray } from "drizzle-orm";
import { getServerSession } from "@/server/session";
import { v4 as uuidv4 } from "uuid";

// GET /api/sellers/products - Get products for the current seller
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sellerId = session.user.id;

    // Get seller's shop(s)
    const sellerShops = await db
      .select({ id: shop.id })
      .from(shop)
      .where(eq(shop.sellerId, sellerId));

    if (sellerShops.length === 0) {
      return NextResponse.json([]);
    }

    const shopIds = sellerShops.map((s) => s.id);

    // Get products from seller's shops
    const productsList = await db
      .select()
      .from(products)
      .where(inArray(products.shopId, shopIds));

    // Get product images
    const productIds = productsList.map((p) => p.id);
    const images = productIds.length > 0
      ? await db
          .select()
          .from(productImages)
          .where(inArray(productImages.productId, productIds))
      : [];

    // Get product inventory
    const inventory = productIds.length > 0
      ? await db
          .select()
          .from(productInventory)
          .where(inArray(productInventory.productId, productIds))
      : [];

    // Transform data to match frontend Product type
    const transformedProducts = productsList.map((product) => {
      const productImagesList = images.filter((img) => img.productId === product.id);
      const productInventoryData = inventory.find((inv) => inv.productId === product.id);

      return {
        id: product.id,
        shopId: product.shopId,
        categoryId: product.categoryId,
        productName: product.productName,
        SKU: product.SKU || "",
        description: product.description || null,
        price: product.price ? Number(product.price) : undefined,
        rating: product.rating ?? null,
        isAvailable: product.isAvailable,
        status: product.status || "Available",
        stock: productInventoryData?.quantityInStock || 0,
        itemsSold: productInventoryData?.itemsSold || null,
        images: productImagesList.map((img) => ({
          id: img.id,
          product_id: img.productId,
          // FIX: single string
          image_url: img.url,
          is_primary: false,
        })),
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    });

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error("Error fetching seller products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/sellers/products - Create a new product
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sellerId = session.user.id;
    const body = await req.json();

    // Get seller's shop
    const sellerShop = await db
      .select({ id: shop.id })
      .from(shop)
      .where(eq(shop.sellerId, sellerId))
      .limit(1);

    if (sellerShop.length === 0) {
      return NextResponse.json(
        { error: "No shop found for seller" },
        { status: 400 }
      );
    }

    const shopId = sellerShop[0].id;

    // Validate required fields
    if (!body.productName) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }
    if (!body.categoryId) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }
    // Price is required in schema, use 0 as default if not provided (for variant-based products)
    if (body.price === undefined || body.price === null) {
      return NextResponse.json({ error: "Price is required" }, { status: 400 });
    }

    // Create product
    const productId = body.id || uuidv4();
    const newProduct = {
      id: productId,
      productName: body.productName,
      shopId: shopId,
      categoryId: body.categoryId,
      price: String(body.price),
      SKU: body.SKU || undefined,
      description: body.description || "",
      rating:
        body.rating === "" ||
        body.rating === undefined ||
        body.rating === null
          ? null
          : Number(body.rating),
      isAvailable: body.isAvailable ?? true,
      status: body.status || "Available",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(products).values(newProduct);

    // Create inventory if stock is provided
    if (body.stock !== undefined) {
      await db.insert(productInventory).values({
        id: uuidv4(),
        productId: productId,
        quantityInStock: body.stock,
        itemsSold: 0,
      });
    }

    // Create images if provided
    // Expecting body.images to be an array of { image_url: string }
    if (body.images && Array.isArray(body.images)) {
      // log to help debug invalid values if needed
      // console.log("IMAGE PAYLOAD", body.images);

      const imageRows = body.images.map((img: { image_url: string }) => {
        // Ensure we only insert safe image strings (absolute http|https or relative starting with '/')
        const candidate = typeof img.image_url === "string" ? img.image_url : "";
        const safeUrl =
          candidate && (candidate.startsWith("http") || candidate.startsWith("/"))
            ? candidate
            : ""; // don't insert blob: or first char

        return {
          id: uuidv4(),
          productId: productId,
          url: safeUrl,
        };
      });

      if (imageRows.length > 0) {
        await db.insert(productImages).values(imageRows);
      }
    }

    return NextResponse.json({ success: true, product: { ...newProduct, stock: body.stock || 0 } });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
