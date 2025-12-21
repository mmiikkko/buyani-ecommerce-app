import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { orders, transactions, orderItems } from "@/server/schema/auth-schema";
import { eq, and, sql, inArray } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        // 1. Identify all orders that have an associated 'walk-in' or legacy 'instore' transaction
        const walkinTransactions = await db
            .select({ orderId: transactions.orderId })
            .from(transactions)
            .where(sql`${transactions.transactionType} = 'walk-in' OR ${transactions.transactionType} = 'instore'`);

        const walkinOrderIds = walkinTransactions.map((t) => t.orderId).filter(Boolean);

        let updatedCount = 0;
        if (walkinOrderIds.length > 0) {
            // Also migrate any legacy 'instore' transactions to 'walk-in'
            await db
                .update(transactions)
                .set({ transactionType: "walk-in" })
                .where(eq(transactions.transactionType, "instore"));

            // Set orderType = 'walk-in' for these orders
            await db
                .update(orders)
                .set({ orderType: "walk-in" })
                .where(inArray(orders.id, walkinOrderIds as string[]));
            updatedCount = walkinOrderIds.length;
        }

        // 2. Set orderType = 'online' for all orders where it is NULL and NOT in walkinOrderIds
        await db
            .update(orders)
            .set({ orderType: "online" })
            .where(sql`${orders.orderType} is null`);

        // 3. Fix zero totals
        const zeroTotalOrders = await db
            .select({ id: orders.id })
            .from(orders)
            .where(sql`${orders.total} = '0' OR ${orders.total} = '0.00' OR ${orders.total} is null`);

        let fixedTotalsCount = 0;
        for (const order of zeroTotalOrders) {
            const items = await db
                .select({ subtotal: orderItems.subtotal })
                .from(orderItems)
                .where(eq(orderItems.orderId, order.id));

            const newTotal = items.reduce((sum, item) => sum + Number(item.subtotal), 0);

            if (newTotal > 0) {
                await db
                    .update(orders)
                    .set({ total: String(newTotal) })
                    .where(eq(orders.id, order.id));
                fixedTotalsCount++;
            }
        }

        return NextResponse.json({
            success: true,
            walkinOrdersMarked: updatedCount,
            totalsFixed: fixedTotalsCount,
            message: "Data repair completed successfully"
        });
    } catch (error: any) {
        console.error("Data repair error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
