import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { shop, user, products } from "@/server/schema/auth-schema";
import { eq, and, sql } from "drizzle-orm";

// GET /api/shops/[shopId] - Get a single shop by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shopId: string }> }
) {
  try {
    const { shopId } = await params;

    const shopItem = await db
      .select({
        id: shop.id,
        sellerId: shop.sellerId,
        shopName: shop.shopName,
        shopRating: shop.shopRating,
        description: shop.description,
        imageURL: shop.imageURL,
        status: shop.status,
        createdAt: shop.createdAt,
        updatedAt: shop.updatedAt,
        ownerName: user.name,
        ownerFirstName: user.first_name,
        ownerLastName: user.last_name,
      })
      .from(shop)
      .leftJoin(user, eq(shop.sellerId, user.id))
      .where(eq(shop.id, shopId))
      .limit(1);

    if (!shopItem.length) {
      return NextResponse.json(
        { error: "Shop not found" },
        { status: 404 }
      );
    }

    const shopData = shopItem[0];
    
    // Get product count
    const productCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(and(
        eq(products.shopId, shopData.id),
        eq(products.isAvailable, true)
      ));

    return NextResponse.json({
      id: shopData.id,
      seller_id: shopData.sellerId,
      shop_name: shopData.shopName,
      shop_rating: shopData.shopRating,
      description: shopData.description,
      image: shopData.imageURL,
      status: shopData.status,
      created_at: shopData.createdAt,
      updated_at: shopData.updatedAt,
      owner_name: shopData.ownerName || 
        `${shopData.ownerFirstName || ""} ${shopData.ownerLastName || ""}`.trim() ||
        "Unknown",
      products: Number(productCount[0]?.count || 0),
    });
  } catch (error) {
    console.error("Error fetching shop:", error);
    return NextResponse.json(
      { error: "Failed to fetch shop" },
      { status: 500 }
    );
  }
}

