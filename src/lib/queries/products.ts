import { db } from "@/server/drizzle";
import { products, productImages, productInventory, shop, user, categories } from "@/server/schema/auth-schema";
import { eq, inArray, and, ne } from "drizzle-orm";
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

export async function getProductById(productId: string) {
  // Fetch product with shop and category
  const productResult = await db
    .select({
      id: products.id,
      productName: products.productName,
      price: products.price,
      description: products.description,
      rating: products.rating,
      isAvailable: products.isAvailable,
      status: products.status,
      SKU: products.SKU,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      shopId: products.shopId,
      shopName: shop.shopName,
      shopImage: shop.imageURL,
      shopRating: shop.shopRating,
      categoryId: products.categoryId,
      categoryName: categories.categoryName,
    })
    .from(products)
    .leftJoin(shop, eq(products.shopId, shop.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.id, productId))
    .limit(1);

  if (productResult.length === 0) {
    return null;
  }

  const product = productResult[0];

  // Fetch product images
  const images = await db
    .select({
      id: productImages.id,
      url: productImages.url,
    })
    .from(productImages)
    .where(eq(productImages.productId, productId));

  // Fetch product inventory
  const inventoryResult = await db
    .select({
      quantityInStock: productInventory.quantityInStock,
      itemsSold: productInventory.itemsSold,
    })
    .from(productInventory)
    .where(eq(productInventory.productId, productId))
    .limit(1);

  const inventory = inventoryResult[0] || { quantityInStock: 0, itemsSold: 0 };

  return {
    id: product.id,
    productName: product.productName,
    price: product.price ? parseFloat(String(product.price)) : 0,
    description: product.description,
    rating: product.rating,
    isAvailable: product.isAvailable,
    status: product.status,
    SKU: product.SKU,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    stock: inventory.quantityInStock || 0,
    itemsSold: inventory.itemsSold || 0,
    images: images.map(img => ({ id: img.id, url: img.url })),
    shop: {
      id: product.shopId,
      name: product.shopName,
      image: product.shopImage,
      rating: product.shopRating,
    },
    category: {
      id: product.categoryId,
      name: product.categoryName,
    },
  };
}

export async function getRelatedProducts(categoryId: string, excludeProductId: string, limit: number = 4) {
  // Fetch products in the same category, excluding the current product
  const relatedProducts = await db
    .select({
      id: products.id,
      productName: products.productName,
      price: products.price,
      shopName: shop.shopName,
    })
    .from(products)
    .leftJoin(shop, eq(products.shopId, shop.id))
    .where(and(
      eq(products.categoryId, categoryId),
      ne(products.id, excludeProductId)
    ))
    .limit(limit);

  // Get product IDs for image lookup
  const productIds = relatedProducts.map(p => p.id);
  
  if (productIds.length === 0) {
    return [];
  }

  // Fetch first image for each product
  const images = await db
    .select({
      productId: productImages.productId,
      url: productImages.url,
    })
    .from(productImages)
    .where(inArray(productImages.productId, productIds));

  // Create a map of productId -> first image URL
  const imageMap = new Map<string, string | null>();
  for (const img of images) {
    if (img.productId && !imageMap.has(img.productId)) {
      imageMap.set(img.productId, img.url);
    }
  }

  return relatedProducts.map(product => ({
    id: product.id,
    productName: product.productName,
    price: product.price ? parseFloat(String(product.price)) : 0,
    shopName: product.shopName,
    image: imageMap.get(product.id) || null,
  }));
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