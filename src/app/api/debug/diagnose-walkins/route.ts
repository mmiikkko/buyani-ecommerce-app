import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { orders, transactions, orderItems, products } from "@/server/schema/auth-schema";
import { eq, and, sql, inArray } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const walkinOrders = await db
            .select()
            .from(orders)
            .where(eq(orders.orderType, "walk-in"));

        const details = await Promise.all(walkinOrders.map(async (o) => {
            const items = await db
                .select({
                    itemId: orderItems.id,
                    quantity: orderItems.quantity,
                    subtotal: orderItems.subtotal,
                    productVariationId: orderItems.product_variation_id,
                })
                .from(orderItems)
                .where(eq(orderItems.orderId, o.id));

            const trans = await db
                .select()
                .from(transactions)
                .where(eq(transactions.orderId, o.id));

            return {
                orderId: o.id,
                buyerId: o.buyerId,
                total: o.total,
                orderType: o.orderType,
                items,
                transactions: trans
            };
        }));

        // Also look for orders that SHOULD be walk-ins but aren't
        const suspiciousOrders = await db
            .select()
            .from(orders)
            .where(sql`${orders.orderType} != 'walk-in' OR ${orders.orderType} IS NULL`);

        const suspectDetails = [];
        for (const o of suspiciousOrders) {
            const trans = await db.select().from(transactions).where(and(eq(transactions.orderId, o.id), sql`${transactions.transactionType} = 'walk-in' OR ${transactions.transactionType} = 'instore'`));
            if (trans.length > 0 || o.addressId === null) {
                suspectDetails.push({
                    orderId: o.id,
                    buyerId: o.buyerId,
                    total: o.total,
                    orderType: o.orderType,
                    hasWalkinTrans: trans.length > 0,
                    hasNoAddress: o.addressId === null
                });
            }
        }

        return NextResponse.json({
            walkinDetails: details,
            suspectDetails: suspectDetails
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
