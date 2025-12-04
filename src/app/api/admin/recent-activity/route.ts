import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { orders, user, transactions } from "@/server/schema/auth-schema";
import { sql, eq } from "drizzle-orm";

// GET /api/admin/recent-activity - Get recent activities (orders and transactions)
export async function GET(req: NextRequest) {
  try {
    // Get recent orders (last 10)
    const recentOrders = await db
      .select({
        id: orders.id,
        type: sql<string>`'order'`.as("type"),
        buyerId: orders.buyerId,
        buyerName: user.name,
        total: orders.total,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .leftJoin(user, eq(orders.buyerId, user.id))
      .orderBy(sql`${orders.createdAt} DESC`)
      .limit(5);

    // Get recent transactions (last 10)
    const recentTransactions = await db
      .select({
        id: transactions.id,
        type: sql<string>`'transaction'`.as("type"),
        userId: transactions.userId,
        userName: user.name,
        transactionType: transactions.transactionType,
        remarks: transactions.remarks,
        createdAt: transactions.createdAt,
      })
      .from(transactions)
      .leftJoin(user, eq(transactions.userId, user.id))
      .orderBy(sql`${transactions.createdAt} DESC`)
      .limit(5);

    // Combine and sort by date
    const activities = [
      ...recentOrders.map((o) => ({
        id: o.id,
        type: "order",
        user: o.buyerName || "Unknown",
        description: `New order placed - ₱${Number(o.total || 0).toFixed(2)}`,
        date: o.createdAt,
      })),
      ...recentTransactions.map((t) => ({
        id: t.id,
        type: "transaction",
        user: t.userName || "Unknown",
        description: `${t.transactionType || "Transaction"}: ${t.remarks || "No remarks"}`,
        date: t.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent activity" },
      { status: 500 }
    );
  }
}

