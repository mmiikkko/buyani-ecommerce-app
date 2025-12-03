import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/drizzle';
import { products, productImages, productInventory, shop } from '@/server/schema/auth-schema';
import { eq, and, inArray } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

// GET /api/products
// Note: This returns ALL products. For seller-specific products, use /api/sellers/products
export async function GET(req: NextRequest) {
  try {
    // Get all available products
    const productList = await db
      .select({
        id: products.id,
        shopId: products.shopId,
        categoryId: products.categoryId,
        productName: products.productName,
        SKU: products.SKU,
        description: products.description,
        price: products.price,
        rating: products.rating,
        isAvailable: products.isAvailable,
        status: products.status,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        stock: productInventory.quantityInStock,
        itemsSold: productInventory.itemsSold,
        shopName: shop.shopName,
        shopStatus: shop.status,
      })
      .from(products)
      .leftJoin(productInventory, eq(productInventory.productId, products.id))
      .leftJoin(shop, eq(products.shopId, shop.id))
      .where(and(
        eq(products.isAvailable, true),
        eq(shop.status, "approved")
      ));

    // Get all images for products
    const productIds = productList.map(p => p.id);
    const allImages = productIds.length > 0
      ? await db
          .select()
          .from(productImages)
          .where(inArray(productImages.productId, productIds))
      : [];

    // Group images by productId
    const imagesByProduct = new Map<string, typeof allImages>();
    for (const img of allImages) {
      if (!imagesByProduct.has(img.productId)) {
        imagesByProduct.set(img.productId, []);
      }
      imagesByProduct.get(img.productId)!.push(img);
    }

    // Combine products with their images
    const productsWithImages = productList.map((product) => {
      const productImagesList = imagesByProduct.get(product.id) || [];
      return {
        ...product,
        images: productImagesList.map(img => ({
          id: img.id,
          product_id: img.productId,
          image_url: [img.url],
          is_primary: false,
        })),
        price: product.price ? Number(product.price) : undefined,
        stock: product.stock ?? 0,
      };
    });

    return NextResponse.json(productsWithImages);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products
export async function POST(req: NextRequest) {
  const body = await req.json();
  const newProduct = {
    id: uuidv4(),
    productName: body.productName,
    shopId: body.shopId,
    categoryId: body.categoryId,
    price: body.price,
    SKU: body.SKU ?? undefined,
    description: body.description ?? "",
    rating: body.rating ?? "",
    isAvailable: typeof body.isAvailable === "boolean" ? body.isAvailable : true,
    status: body.status ?? "Available",
    createdAt: new Date(),
    updatedAt: new Date(),
    // add other fields as needed
  };
  await db.insert(products).values(newProduct);
  return NextResponse.json({ success: true, product: newProduct });
}

// PUT /api/products?id=xxx
export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("id");
  if (!productId) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const updates = await req.json();
  await db.update(products).set(updates).where(eq(products.id, productId));
  return NextResponse.json({ success: true });
}

// DELETE /api/products?id=xxx
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("id");
  if (!productId) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.delete(products).where(eq(products.id, productId));
  return NextResponse.json({ success: true });
}