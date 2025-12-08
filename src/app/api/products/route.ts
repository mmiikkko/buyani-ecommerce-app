import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/drizzle';
import { products, productImages, productInventory, shop, cartItems } from '@/server/schema/auth-schema';
import { eq, and, inArray } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { corsResponse, corsOptions } from '@/lib/api-utils';

// OPTIONS /api/products - Handle CORS preflight
export async function OPTIONS() {
  return corsOptions();
}

// GET /api/products
// Optional query param: ?categoryId=xxx to filter by category
// Note: This returns ALL products. For seller-specific products, use /api/sellers/products
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    // Build where conditions
    const whereConditions = [
      eq(products.isAvailable, true),
      eq(shop.status, "approved")
    ];

    // Add category filter if provided
    if (categoryId) {
      whereConditions.push(eq(products.categoryId, categoryId));
    }

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
      .where(and(...whereConditions));

    // Get all images for products
    const productIds = productList.map(p => p.id);
    const allImages = productIds.length > 0
      ? await db
          .select()
          .from(productImages)
          .where(inArray(productImages.productId, productIds))
      : [];

    console.log(`Found ${productList.length} products, ${allImages.length} images for customer UI`);

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
        images: productImagesList
          .filter(img => img.url && img.url.trim() !== "") // Filter out null/empty URLs
          .map(img => ({
            id: img.id,
            product_id: img.productId,
            image_url: [img.url!], // Non-null assertion since we filtered
            is_primary: false,
          })),
        price: product.price ? Number(product.price) : undefined,
        stock: product.stock ?? 0,
      };
    });

    return corsResponse(productsWithImages);
  } catch (error) {
    console.error("Error fetching products:", error);
    return corsResponse(
      { error: "Failed to fetch products" },
      500
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
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");
    if (!productId) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // First, delete all cart_items that reference this product
    // This is necessary because cart_items has ON DELETE RESTRICT constraint
    await db.delete(cartItems).where(eq(cartItems.productId, productId));

    // Delete product images (has ON DELETE CASCADE, but being explicit)
    await db.delete(productImages).where(eq(productImages.productId, productId));

    // Delete product inventory (if it exists)
    await db.delete(productInventory).where(eq(productInventory.productId, productId));

    // Finally, delete the product itself
    await db.delete(products).where(eq(products.id, productId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product. It may be referenced in orders or other records." },
      { status: 500 }
    );
  }
}