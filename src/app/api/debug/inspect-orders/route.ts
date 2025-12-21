import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { orders, transactions, orderItems } from "@/server/schema/auth-schema";
import { eq, and, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const allOrders = await db
            .select({
                id: orders.id,
                buyerId: orders.buyerId,
                total: orders.total,
                orderType: orders.orderType,
                createdAt: orders.createdAt,
            })
            .from(orders)
            .orderBy(sql`${orders.createdAt} DESC`)
            .limit(20);

        const orderData = await Promise.all(allOrders.map(async (o) => {
            const trans = await db
                .select()
                .from(transactions)
                .where(eq(transactions.orderId, o.id));

            const items = await db
                .select()
                .from(orderItems)
                .where(eq(orderItems.orderId, o.id));

            return {
                ...o,
                transactions: trans,
                itemsCount: items.length,
                itemsSubtotals: items.map(i => i.subtotal)
            };
        }));

        return NextResponse.json(orderData);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
