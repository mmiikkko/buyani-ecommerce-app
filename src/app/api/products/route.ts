import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/drizzle';
import { products, productImages, productInventory, productVariation, shop, cartItems, orderItems, reviews, orders, categories } from '@/server/schema/auth-schema';
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
        categoryName: categories.categoryName,
        productName: products.productName,
        description: products.description,
        rating: products.rating,
        isAvailable: products.isAvailable,
        status: products.status,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        shopName: shop.shopName,
        shopStatus: shop.status,
      })
      .from(products)
      .leftJoin(shop, eq(products.shopId, shop.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(...whereConditions));

    // Get all images
    const productIds = productList.map(p => p.id);

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
        const pVariations = await db
          .select({ id: productVariation.id })
          .from(productVariation)
          .where(eq(productVariation.productId, productId));
        const vIds = pVariations.map(v => v.id);

        if (vIds.length > 0) {
          // Get all order items for this product's variations
          const relatedOrderItems = await db
            .select({ orderId: orderItems.orderId })
            .from(orderItems)
            .where(inArray(orderItems.product_variation_id, vIds));

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
    }

    // Combine products with their images, variants, and review data
    const productsWithImages = productList.map((product) => {
      const productImagesList = imagesByProduct.get(product.id) || [];
      const reviewStats = reviewStatsMap.get(product.id);

      const pVariations = allVariations.filter(v => v.productId === product.id);
      const mainVar = pVariations[0];
      const price = mainVar ? Number(mainVar.price) : 0;

      let stock = 0;
      pVariations.forEach(v => {
        const inv = allInventory.find(i => i.product_variation_id === v.id);
        if (inv) stock += (inv.quantityInStock || 0);
      });

      const finalRating = reviewStats && reviewStats.reviewCount > 0
        ? reviewStats.averageRating.toFixed(1)
        : (product.rating ?? null);

      return {
        ...product,
        categoryName: product.categoryName ?? null,
        images: productImagesList
          .filter(img => img.url && img.url.trim() !== "")
          .map(img => ({
            id: img.id,
            product_id: img.productId,
            image_url: img.url ?? "",
            is_primary: false,
          })),
        price,
        SKU: mainVar?.SKU || undefined,
        stock,
        rating: finalRating,
        reviewCount: reviewStats?.reviewCount ?? 0,
        variations: pVariations // Optionally return variations for Detail View immediate access
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
  try {
    const body = await req.json();
    const productId = uuidv4();
    const price = body.price ? String(body.price) : "0.00";
    const sku = body.SKU || `PRD-${Date.now()}`;

    const newProduct = {
      id: productId,
      productName: body.productName,
      shopId: body.shopId,
      categoryId: body.categoryId,
      description: body.description ?? "",
      rating: body.rating ?? 0,
      isAvailable: typeof body.isAvailable === "boolean" ? body.isAvailable : true,
      status: body.status ?? "Available",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 1. Insert product
    await db.insert(products).values(newProduct);

    // 2. Create a default variation (to satisfy schema requirements and handle price/SKU)
    const variationId = uuidv4();
    await db.insert(productVariation).values({
      id: variationId,
      productId: productId,
      variationName: "Standard",
      variationType: "Standard",
      variationValue: "Standard",
      price: price,
      SKU: sku,
    });

    // 3. Create initial inventory
    await db.insert(productInventory).values({
      id: uuidv4(),
      product_variation_id: variationId,
      quantityInStock: body.stock ?? 0,
      itemsSold: 0,
    });

    return NextResponse.json({ success: true, product: { ...newProduct, price, SKU: sku } });
  } catch (error) {
    console.error("Error creating product via global API:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

// PUT /api/products?id=xxx
export async function PUT(req: NextRequest) {
  try {
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

    // Regular update - exclude price and SKU from product table update
    const { price, SKU, stock, ...productUpdates } = body;

    if (Object.keys(productUpdates).length > 0) {
      await db.update(products).set({ ...productUpdates, updatedAt: new Date() }).where(eq(products.id, productId));
    }

    // If price or SKU provided, update all variations (Standard behavior for this simple API)
    if (price !== undefined || SKU !== undefined) {
      const varUpdates: any = {};
      if (price !== undefined) varUpdates.price = String(price);
      if (SKU !== undefined) varUpdates.SKU = SKU;

      await db.update(productVariation)
        .set(varUpdates)
        .where(eq(productVariation.productId, productId));
    }

    // If stock provided, update inventory for all variations
    if (stock !== undefined) {
      const pVariations = await db.select({ id: productVariation.id })
        .from(productVariation)
        .where(eq(productVariation.productId, productId));

      const vIds = pVariations.map(v => v.id);
      if (vIds.length > 0) {
        await db.update(productInventory)
          .set({ quantityInStock: Number(stock) })
          .where(inArray(productInventory.product_variation_id, vIds));
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating product via global API:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
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
    // Delete cart items (users shouldn't be able to add removed products to cart)
    const varsToDelete = await db.select({ id: productVariation.id }).from(productVariation).where(eq(productVariation.productId, productId));
    const vIdsToDelete = varsToDelete.map(v => v.id);

    if (vIdsToDelete.length > 0) {
      await db.delete(cartItems).where(inArray(cartItems.productVariationId, vIdsToDelete));
    }

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