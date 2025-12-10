import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/drizzle';
import { products, productImages, productInventory, shop } from '@/server/schema/auth-schema';
import { eq, and, inArray, sql } from 'drizzle-orm';

// GET /api/shops/[shopId]/products - Get products for a specific shop
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shopId: string }> }
) {
  try {
    const { shopId } = await params;

    // Verify shop exists and is approved
    const shopData = await db
      .select()
      .from(shop)
      .where(eq(shop.id, shopId))
      .limit(1);

    if (!shopData.length) {
      return NextResponse.json(
        { error: "Shop not found" },
        { status: 404 }
      );
    }

    if (shopData[0].status !== "approved") {
      return NextResponse.json(
        { error: "Shop is not available" },
        { status: 403 }
      );
    }

    // Get all available products for this shop
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
        eq(products.shopId, shopId),
        eq(products.isAvailable, true),
        // Exclude removed and deleted products
        sql`${products.status} != 'Deleted' AND ${products.status} != 'Removed'`
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
        images: productImagesList
          .filter(img => img.url && img.url.trim() !== "")
          .map(img => ({
            id: img.id,
            product_id: img.productId,
            image_url: [img.url!],
            is_primary: false,
          })),
        price: product.price ? Number(product.price) : undefined,
        stock: product.stock ?? 0,
      };
    });

    return NextResponse.json(productsWithImages);
  } catch (error) {
    console.error("Error fetching shop products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

