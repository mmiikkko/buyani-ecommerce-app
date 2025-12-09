import { db } from "@/server/drizzle";
import { products, productImages, productInventory, shop, user, categories, reviews, orders, orderItems } from "@/server/schema/auth-schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function getProducts(userId: string) {
  return db
    .select({
      id: products.id,
      name: products.productName,
      price: products.price,
      description: products.description,
      stock: productInventory.quantityInStock,
      images: productImages.url,
    })
    .from(products)
    .leftJoin(shop, eq(products.shopId, shop.id))
    .leftJoin(user, eq(shop.sellerId, user.id))
    .leftJoin(productInventory, eq(productInventory.productId, products.id))
    .leftJoin(productImages, eq(productImages.productId, products.id))
    .where(eq(shop.sellerId, userId)); 
}

export async function addProducts(req: NextRequest) {
    const body = await req.json();
    const { sellerId, shopId, productName, SKU, price, categoryId, description, images, quantityInStock } = body;
  
    if (!sellerId || !shopId || !productName || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
  
    try {
      const productId = uuid();
  
      // Insert product
      await db.insert(products).values({
        id: productId,
        shopId,
        categoryId,
        productName,
        SKU,
        price,
        description,
      });
  
      // Insert inventory
      if (quantityInStock !== undefined) {
        await db.insert(productInventory).values({
          id: uuid(),
          productId,
          quantityInStock,
          itemsSold: 0,
        });
      }
  
      // Insert images
      if (images && Array.isArray(images)) {
        const imageRows = images.map((url: string) => ({
          id: uuid(),
          productId,
          url,
        }));
        await db.insert(productImages).values(imageRows);
      }
  
      return NextResponse.json({ message: "Product added", productId });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
    }
    
  }

export async function getProductById(productId: string) {
  try {
    const [productRow] = await db
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
        categoryName: categories.categoryName,
      })
      .from(products)
      .leftJoin(productInventory, eq(productInventory.productId, products.id))
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

    // Get review statistics for this product
    // Join: reviews -> orders -> order_items -> products
    const reviewStats = await db
      .select({
        averageRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`.as('averageRating'),
        reviewCount: sql<number>`COUNT(${reviews.id})`.as('reviewCount'),
      })
      .from(reviews)
      .innerJoin(orders, eq(reviews.orderId, orders.id))
      .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
      .where(eq(orderItems.productId, productId));

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
      SKU: productRow.SKU ?? "",
      description: productRow.description ?? null,
      price: productRow.price !== null ? Number(productRow.price) : undefined,
      rating: finalRating,
      isAvailable: productRow.isAvailable ?? true,
      status: productRow.status ?? "Available",
      stock: productRow.stock ?? 0,
      itemsSold: productRow.itemsSold ?? null,
      images: imageRows.map((image) => ({
        id: image.id,
        product_id: image.productId,
        image_url: image.url ?? "", // ✅ string
        is_primary: false,
      })),
      createdAt: productRow.createdAt,
      updatedAt: productRow.updatedAt,
      shopName: productRow.shopName ?? null,
      shopStatus: null, // TODO: Add shop.status column to database or query separately
      categoryName: productRow.categoryName ?? null,
      reviewCount: reviewCount,
    };
  } catch (error) {
    console.error("getProductById failed", { productId, error });
    return null;
  }
}