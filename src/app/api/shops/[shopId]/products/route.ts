import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/drizzle';
import { products, productImages, productInventory, productVariation, shop, reviews, orderItems, categories } from '@/server/schema/auth-schema';
import { eq, and, inArray, sql, avg } from 'drizzle-orm';

// GET /api/shops/[shopId]/products - Get products for a specific shop
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shopId: string }> }
) {
  try {
    const { shopId } = await params;

    // Verify shop exists and is approved
    const shopData = await db
      .select({
        id: shop.id,
        status: shop.status,
        shopName: shop.shopName,
      })
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
        categoryName: categories.categoryName,
        productName: products.productName,
        description: products.description,
        rating: products.rating,
        isAvailable: products.isAvailable,
        status: products.status,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        shopName: sql<string>`${shopData[0].shopName}`,
        shopStatus: sql<string>`${shopData[0].status}`,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(
        eq(products.shopId, shopId),
        eq(products.isAvailable, true),
        // Exclude removed and deleted products
        sql`${products.status} != 'Deleted' AND ${products.status} != 'Removed'`
      ));

    const productIds = productList.map(p => p.id);

    // Fetch average ratings for these products from order reviews
    const productRatings = productIds.length > 0
      ? await db
        .select({
          productId: productVariation.productId,
          avgRating: avg(reviews.rating),
        })
        .from(reviews)
        .innerJoin(orderItems, eq(reviews.orderId, orderItems.orderId))
        .innerJoin(productVariation, eq(orderItems.product_variation_id, productVariation.id))
        .where(inArray(productVariation.productId, productIds))
        .groupBy(productVariation.productId)
      : [];

    // Fetch Images
    const allImages = productIds.length > 0
      ? await db
        .select()
        .from(productImages)
        .where(inArray(productImages.productId, productIds))
      : [];

    // Fetch Variations
    const allVariations = productIds.length > 0
      ? await db
        .select()
        .from(productVariation)
        .where(inArray(productVariation.productId, productIds))
      : [];

    const variationIds = allVariations.map(v => v.id);

    // Fetch Inventory
    const allInventory = variationIds.length > 0
      ? await db
        .select()
        .from(productInventory)
        .where(inArray(productInventory.product_variation_id, variationIds))
      : [];

    // Group images by productId
    const imagesByProduct = new Map<string, typeof allImages>();
    for (const img of allImages) {
      if (!imagesByProduct.has(img.productId)) {
        imagesByProduct.set(img.productId, []);
      }
      imagesByProduct.get(img.productId)!.push(img);
    }

    // Combine products with their images, variants, and inventory data
    const productsWithImages = productList.map((product) => {
      const productImagesList = imagesByProduct.get(product.id) || [];
      const pVariations = allVariations.filter(v => v.productId === product.id);
      const mainVar = pVariations[0];
      const price = mainVar ? Number(mainVar.price) : 0;

      let stock = 0;
      pVariations.forEach(v => {
        const inv = allInventory.find(i => i.product_variation_id === v.id);
        if (inv) stock += (inv.quantityInStock || 0);
      });

      const avgRating = productRatings.find(r => r.productId === product.id)?.avgRating;

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
        price,
        SKU: mainVar?.SKU || undefined,
        stock,
        rating: avgRating ? Number(avgRating) : 0,
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
