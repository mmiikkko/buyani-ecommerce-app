import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { shop, user } from "@/server/schema/auth-schema";
import { eq, sql } from "drizzle-orm";

// GET /api/admin/pending-shops - Get pending shop approvals
export async function GET(req: NextRequest) {
  try {
    const pendingShops = await db
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
        ownerEmail: user.email,
      })
      .from(shop)
      .leftJoin(user, eq(shop.sellerId, user.id))
      .where(eq(shop.status, "pending"))
      .orderBy(sql`${shop.createdAt} DESC`)
      .limit(10);

    const formattedShops = pendingShops.map((shopItem) => ({
      id: shopItem.id,
      seller_id: shopItem.sellerId,
      shop_name: shopItem.shopName,
      shop_rating: shopItem.shopRating,
      description: shopItem.description,
      image: shopItem.imageURL,
      status: shopItem.status,
      created_at: shopItem.createdAt,
      updated_at: shopItem.updatedAt,
      owner_name:
        shopItem.ownerName ||
        `${shopItem.ownerFirstName || ""} ${shopItem.ownerLastName || ""}`.trim() ||
        "Unknown",
      owner_email: shopItem.ownerEmail,
    }));

    return NextResponse.json(formattedShops);
  } catch (error) {
    console.error("Error fetching pending shops:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending shops" },
      { status: 500 }
    );
  }
}

