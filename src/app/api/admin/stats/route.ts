import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { orders, user, shop, payments } from "@/server/schema/auth-schema";
import { eq, sql, inArray, and, gte, lte } from "drizzle-orm";
import { USER_ROLES } from "@/server/schema/auth-schema";

// GET /api/admin/stats - Get admin dashboard statistics
export async function GET(req: NextRequest) {
  try {
    // Total Revenue - sum of all payments
    const revenueResult = await db
      .select({
        total: sql<number>`COALESCE(SUM(${payments.paymentReceived}), 0)`,
      })
      .from(payments);

    const totalRevenue = Number(revenueResult[0]?.total || 0);

    // Total Orders - count of all orders
    const ordersResult = await db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(orders);

    const totalOrders = Number(ordersResult[0]?.count || 0);

    // Active Users - count of users with role 'customer' or 'seller'
    const usersResult = await db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(user)
      .where(
        inArray(user.role, [USER_ROLES.CUSTOMER, USER_ROLES.SELLER])
      );

    const activeUsers = Number(usersResult[0]?.count || 0);

    // Active Sellers - count of approved shops
    const sellersResult = await db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(shop)
      .where(eq(shop.status, "approved"));

    const activeSellers = Number(sellersResult[0]?.count || 0);

    // Monthly Revenue Breakdown for the last 6 months
    const monthlyRevenue: { month: string; total: number }[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthYear = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

      const monthRevenueResult = await db
        .select({
          total: sql<number>`COALESCE(SUM(${payments.paymentReceived}), 0)`,
        })
        .from(payments)
        .where(
          and(
            gte(payments.createdAt, monthStart),
            lte(payments.createdAt, monthEnd),
            eq(payments.status, "completed")
          )
        );

      monthlyRevenue.push({
        month: monthYear,
        total: Number(monthRevenueResult[0]?.total || 0),
      });
    }

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      activeUsers,
      activeSellers,
      monthlyRevenue,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}

