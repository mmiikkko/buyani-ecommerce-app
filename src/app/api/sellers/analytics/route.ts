// app/api/sellers/recent-orders/route.ts
import { NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { getServerSession } from "@/server/session";
import { eq } from "drizzle-orm";
import { orders, orderItems, products, shop } from "@/server/schema/auth-schema";

// TypeScript type for your recent order
export type RecentOrderItem = {
  productName: string;
  quantity: number;
  subtotal: number;
};

export type RecentOrder = {
  orderId: string;
  createdAt: string; // ISO string
  total: number;
  items: RecentOrderItem[];
  shopName: string;
};

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sellerId = session.user.id;

    // Fetch recent orders for this seller
    const rawOrders = await db
      .select({
        orderId: orders.id,
        createdAt: orders.createdAt,
        total: orders.total,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        subtotal: orderItems.subtotal,
        productName: products.productName,
        shopName: shop.shopName,
      })
      .from(orders)
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .innerJoin(products, eq(products.id, orderItems.productId))
      .innerJoin(shop, eq(shop.id, products.shopId))
      .where(eq(shop.sellerId, sellerId))
      .orderBy(orders.createdAt)
      .limit(10);

    // Group order items under each order
    const groupedOrders: RecentOrder[] = [];
    const map = new Map<string, RecentOrder>();

    rawOrders.forEach((row) => {
      const orderId = row.orderId;
      const existing = map.get(orderId);
      const item: RecentOrderItem = {
        productName: row.productName,
        quantity: row.quantity,
        subtotal: Number(row.subtotal),
      };

      if (existing) {
        existing.items.push(item);
      } else {
        const newOrder: RecentOrder = {
          orderId,
          createdAt: row.createdAt.toISOString(),
          total: Number(row.total),
          shopName: row.shopName,
          items: [item],
        };
        map.set(orderId, newOrder);
        groupedOrders.push(newOrder);
      }
    });

    return NextResponse.json(groupedOrders);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch recent orders" },
      { status: 500 }
    );
  }
}
