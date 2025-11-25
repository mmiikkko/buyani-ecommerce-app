import { db } from "@/server/drizzle";
import { products, productImages, productInventory, shop, user } from "@/server/schema/auth-schema";
import { eq } from "drizzle-orm";
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