import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/drizzle';
import { products, productImages, productInventory, shop, cartItems, orderItems, reviews, orders } from '@/server/schema/auth-schema';
import { eq, and, inArray, sql } from 'drizzle-orm';
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
      eq(shop.status, "approved"),
      // Exclude removed and deleted products
      sql`${products.status} != 'Deleted' AND ${products.status} != 'Removed'`
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

    // Get review statistics for all products
    const productIdsForReviews = productList.map(p => p.id);
    const reviewStatsMap = new Map<string, { averageRating: number; reviewCount: number }>();
    
    if (productIdsForReviews.length > 0) {
      // For each product, calculate review stats similar to getProductById
      for (const productId of productIdsForReviews) {
        // Get all order items for this product
        const relatedOrderItems = await db
          .select({ orderId: orderItems.orderId })
          .from(orderItems)
          .where(eq(orderItems.productId, productId));
        
        const orderIds = relatedOrderItems.map(o => o.orderId);
        
        if (orderIds.length > 0) {
          // Get reviews for orders containing this product
          const reviewStats = await db
            .select({
              averageRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`.as('averageRating'),
              reviewCount: sql<number>`COUNT(${reviews.id})`.as('reviewCount'),
            })
            .from(reviews)
            .where(inArray(reviews.orderId, orderIds));
          
          const stats = reviewStats[0];
          if (stats) {
            const avgRating = stats.averageRating ? Number(stats.averageRating) : 0;
            const count = stats.reviewCount ? Number(stats.reviewCount) : 0;
            if (count > 0) {
              reviewStatsMap.set(productId, {
                averageRating: avgRating,
                reviewCount: count,
              });
            }
          }
        }
      }
    }

    // Combine products with their images and review data
    const productsWithImages = productList.map((product) => {
      const productImagesList = imagesByProduct.get(product.id) || [];
      const reviewStats = reviewStatsMap.get(product.id);
      const finalRating = reviewStats && reviewStats.reviewCount > 0 
        ? reviewStats.averageRating.toFixed(1) 
        : (product.rating ?? null);
      
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
        rating: finalRating,
        reviewCount: reviewStats?.reviewCount ?? 0,
      };
    });

    const response = corsResponse(productsWithImages);
    // Add cache headers (1 minute - products change more frequently)
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
    return response;
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
  
  const body = await req.json();
  const action = body.action; // Check if this is a restore action
  
  if (action === "restore") {
    // Restore a removed product
    await db
      .update(products)
      .set({
        status: "Available",
        isAvailable: true,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId));
    
    return NextResponse.json({ 
      success: true,
      message: "Product restored successfully. You can now update stock and make it available."
    });
  }
  
  // Regular update
  const updates = body;
  await db.update(products).set(updates).where(eq(products.id, productId));
  return NextResponse.json({ success: true });
}

// DELETE /api/products?id=xxx - Soft delete (remove product)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");
    if (!productId) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // Always use soft delete: Mark product as removed but keep it in database
    // This allows sellers to restock the product later
    await db
      .update(products)
      .set({
        status: "Removed",
        isAvailable: false,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId));

    // Delete cart items (users shouldn't be able to add removed products to cart)
    await db.delete(cartItems).where(eq(cartItems.productId, productId));

    return NextResponse.json({ 
      success: true,
      message: "Product removed successfully. You can restock it later."
    });
  } catch (error: any) {
    console.error("Error removing product:", error);
    
    return NextResponse.json(
      { error: "Failed to remove product." },
      { status: 500 }
    );
  }
}