import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { orders, user, shop, payments } from "@/server/schema/auth-schema";
import { eq, sql, inArray, and, gte, lte } from "drizzle-orm";
import { USER_ROLES } from "@/server/schema/auth-schema";

// GET /api/admin/stats - Get admin dashboard statistics
export async function GET(req: NextRequest) {
  try {
    const successfulStatuses = ["paid", "completed", "succeeded", "captured"];
    const activeCODStatuses = ["pending", "confirmed", "accepted", "shipped", "delivered"];

    // 1. Fetch Global Stats in Parallel
    const [ordersCount, usersCount, sellersCount, revenueResult] = await Promise.all([
      db.select({ count: sql<number>`COUNT(*)` }).from(orders),
      db.select({ count: sql<number>`COUNT(*)` }).from(user).where(inArray(user.role, [USER_ROLES.CUSTOMER, USER_ROLES.SELLER])),
      db.select({ count: sql<number>`COUNT(*)` }).from(shop).where(eq(shop.status, "approved")),
      db.select({ total: sql<string>`SUM(CAST(${orders.total} AS DECIMAL(10,2)))` })
        .from(orders)
        .leftJoin(payments, eq(orders.id, payments.orderId))
        .where(
          and(
            sql`${orders.total} != '0' AND ${orders.total} IS NOT NULL`,
            sql`(${payments.status} IN (${sql.join(successfulStatuses.map(s => sql`${s}`), sql`, `)}) 
                OR (${payments.paymentMethod} = 'cod' AND ${payments.status} IN (${sql.join(activeCODStatuses.map(s => sql`${s}`), sql`, `)})))`
          )
        )
    ]);

    // 2. Fetch Monthly Revenue for last 6 months in ONE query
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyData = await db
      .select({
        month: sql<string>`DATE_FORMAT(${orders.createdAt}, '%Y-%m')`,
        total: sql<string>`SUM(CAST(${orders.total} AS DECIMAL(10,2)))`,
      })
      .from(orders)
      .leftJoin(payments, eq(orders.id, payments.orderId))
      .where(
        and(
          gte(orders.createdAt, sixMonthsAgo),
          sql`(${payments.status} IN (${sql.join(successfulStatuses.map(s => sql`${s}`), sql`, `)}) 
              OR (${payments.paymentMethod} = 'cod' AND ${payments.status} IN (${sql.join(activeCODStatuses.map(s => sql`${s}`), sql`, `)})))`
        )
      )
      .groupBy(sql`DATE_FORMAT(${orders.createdAt}, '%Y-%m')`)
      .orderBy(sql`DATE_FORMAT(${orders.createdAt}, '%Y-%m')`);

    // Format monthly revenue for response (fill gaps if necessary, though unlikely for active apps)
    const monthlyRevenue = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toISOString().slice(0, 7); // YYYY-MM
      const label = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });

      const record = monthlyData.find(m => m.month === key);
      monthlyRevenue.push({
        month: label,
        total: Number(record?.total || 0)
      });
    }

    return NextResponse.json({
      totalRevenue: Number(revenueResult[0]?.total || 0),
      totalOrders: Number(ordersCount[0]?.count || 0),
      activeUsers: Number(usersCount[0]?.count || 0),
      activeSellers: Number(sellersCount[0]?.count || 0),
      monthlyRevenue,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 });
  }
}

