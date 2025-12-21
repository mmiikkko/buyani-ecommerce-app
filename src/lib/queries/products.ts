import { db } from "@/server/drizzle";
import { products, productImages, productInventory, productVariation, shop, user, categories, reviews, orders, orderItems } from "@/server/schema/auth-schema";
import { eq, sql, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function getProducts(userId: string) {
  // 1. Get products
  const productRows = await db
    .select({
      id: products.id,
      name: products.productName,
      description: products.description,
    })
    .from(products)
    .leftJoin(shop, eq(products.shopId, shop.id))
    .where(eq(shop.sellerId, userId));

  if (productRows.length === 0) return [];

  const productIds = productRows.map(p => p.id);

  // 2. Get variations for these products
  const variations = await db
    .select()
    .from(productVariation)
    .where(inArray(productVariation.productId, productIds));

  const varIds = variations.map(v => v.id);

  // 3. Get inventory
  const inventories = varIds.length > 0
    ? await db.select().from(productInventory).where(inArray(productInventory.product_variation_id, varIds))
    : [];

  // 4. Get images
  const images = await db
    .select()
    .from(productImages)
    .where(inArray(productImages.productId, productIds));

  // 5. Combine data
  return productRows.map(p => {
    const pVars = variations.filter(v => v.productId === p.id);
    const mainVar = pVars[0];
    const pImages = images.filter(img => img.productId === p.id);

    let totalStock = 0;
    pVars.forEach(v => {
      const inv = inventories.find(i => i.product_variation_id === v.id);
      if (inv) totalStock += (inv.quantityInStock || 0);
    });

    return {
      ...p,
      price: mainVar ? Number(mainVar.price) : 0,
      stock: totalStock,
      images: pImages.map(img => img.url).filter(Boolean)[0] || null, // Keeping simple return format for this function if expected
    };
  });
}

export async function addProducts(req: NextRequest) {
  try {
    const body = await req.json();
    const { sellerId, shopId, productName, SKU, price, categoryId, description, images, quantityInStock } = body;

    if (!sellerId || !shopId || !productName || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const productId = uuid();

    // 1. Insert product
    await db.insert(products).values({
      id: productId,
      shopId,
      categoryId,
      productName,
      description,
    });

    // 2. Create a default variation
    const variationId = uuid();
    await db.insert(productVariation).values({
      id: variationId,
      productId: productId,
      variationName: "Standard",
      variationType: "Standard",
      variationValue: "Standard",
      price: String(price),
      SKU: SKU || `PRD-${Date.now()}`,
    });

    // 3. Create initial inventory
    await db.insert(productInventory).values({
      id: uuid(),
      product_variation_id: variationId,
      quantityInStock: quantityInStock ?? 0,
      itemsSold: 0,
    });

    // 4. Insert images
    if (images && Array.isArray(images)) {
      const imageRows = images.map((url: string) => ({
        id: uuid(),
        productId,
        url,
      }));
      if (imageRows.length > 0) {
        await db.insert(productImages).values(imageRows);
      }
    }

    return NextResponse.json({ message: "Product added", productId });
  } catch (err: any) {
    console.error("Error in addProducts (query):", err);
    return NextResponse.json({ error: "Failed to add product", message: err.message }, { status: 500 });
  }
}

export async function getProductById(productId: string) {
  const [productRow] = await db
    .select({
      id: products.id,
      shopId: products.shopId,
      categoryId: products.categoryId,
      productName: products.productName,
      description: products.description,
      rating: products.rating,
      isAvailable: products.isAvailable,
      status: products.status,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      shopName: shop.shopName,
      shopImage: shop.imageURL,
      shopStatus: shop.status,
      categoryName: categories.categoryName,
    })
    .from(products)
    .leftJoin(shop, eq(products.shopId, shop.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.id, productId))
    .limit(1);

  if (!productRow) {
    return null;
  }

  const imageRows = await db
    .select({
      id: productImages.id,
      productId: productImages.productId,
      url: productImages.url,
    })
    .from(productImages)
    .where(eq(productImages.productId, productId));

  // Get variations and inventory for this product
  const variations = await db
    .select()
    .from(productVariation)
    .where(eq(productVariation.productId, productId));

  const varIds = variations.map(v => v.id);
  const inventories = varIds.length > 0
    ? await db.select().from(productInventory).where(inArray(productInventory.product_variation_id, varIds))
    : [];

  // Group inventory by variation
  const variationsWithInventory = variations.map(v => {
    const inv = inventories.find(i => i.product_variation_id === v.id);
    return {
      ...v,
      quantityInStock: inv?.quantityInStock || 0,
    };
  });

  // Calculate total stock and items sold
  let totalStock = 0;
  let totalItemsSold = 0;
  inventories.forEach(inv => {
    totalStock += (inv.quantityInStock || 0);
    totalItemsSold += (inv.itemsSold || 0);
  });

  // Get review statistics for this product
  // Join: reviews -> orders -> order_items -> product_variation
  const reviewStats = varIds.length > 0
    ? await db
      .select({
        averageRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`.as('averageRating'),
        reviewCount: sql<number>`COUNT(${reviews.id})`.as('reviewCount'),
      })
      .from(reviews)
      .innerJoin(orders, eq(reviews.orderId, orders.id))
      .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
      .where(inArray(orderItems.product_variation_id, varIds))
    : [];

  const stats = reviewStats[0];
  const averageRating = stats?.averageRating ? Number(stats.averageRating) : 0;
  const reviewCount = stats?.reviewCount ? Number(stats.reviewCount) : 0;

  // Use calculated rating from reviews if available, otherwise fall back to product.rating
  const finalRating = reviewCount > 0 ? averageRating.toFixed(1) : (productRow.rating ?? null);

  return {
    id: productRow.id,
    shopId: productRow.shopId,
    categoryId: productRow.categoryId,
    productName: productRow.productName,
    SKU: variations[0]?.SKU ?? "",
    description: productRow.description ?? null,
    price: variations[0]?.price !== null ? Number(variations[0]?.price) : 0,
    rating: finalRating,
    isAvailable: productRow.isAvailable ?? true,
    status: productRow.status ?? "Available",
    stock: totalStock,
    itemsSold: totalItemsSold,
    images: imageRows.map((image) => ({
      id: image.id,
      product_id: image.productId,
      image_url: image.url ?? "",
      is_primary: false,
    })),
    createdAt: productRow.createdAt,
    updatedAt: productRow.updatedAt,
    shopName: productRow.shopName ?? null,
    shopImage: productRow.shopImage ?? null,
    shopStatus: productRow.shopStatus ?? null,
    categoryName: productRow.categoryName ?? null,
    reviewCount: reviewCount,
    variations: variationsWithInventory,
  };
}
