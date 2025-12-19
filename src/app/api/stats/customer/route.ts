import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { user, shop, products, productInventory } from "@/server/schema/auth-schema";
import { eq, sql, and } from "drizzle-orm";

// GET /api/stats/customer - Get customer-facing statistics
export async function GET(req: NextRequest) {
  try {
    // Get total products count (available products from approved shops)
    const productsResult = await db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(products)
      .leftJoin(shop, eq(products.shopId, shop.id))
      .where(
        and(
          eq(products.isAvailable, true),
          eq(shop.status, "approved"),
          sql`${products.status} != 'Deleted' AND ${products.status} != 'Removed'`
        )
      );

    const totalProducts = Number(productsResult[0]?.count || 0);

    // Get total shops count (all registered shops, not just approved)
    const shopsResult = await db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(shop);

    const totalShops = Number(shopsResult[0]?.count || 0);

    // Get total users count (all users with accounts)
    const usersResult = await db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(user);

    const totalUsers = Number(usersResult[0]?.count || 0);

    return NextResponse.json({
      products: totalProducts,
      shops: totalShops,
      users: totalUsers,
    });
  } catch (error) {
    console.error("Error fetching customer stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

