import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { orders, shop, orderItems, products, payments, user } from "@/server/schema/auth-schema";
import { eq, inArray, sql } from "drizzle-orm";
import { getServerSession } from "@/server/session";

// GET /api/sellers/recent-orders - Get recent orders for seller dashboard
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sellerId = session.user.id;

    // Get seller's shops
    const sellerShops = await db
      .select({ id: shop.id })
      .from(shop)
      .where(eq(shop.sellerId, sellerId));

    if (sellerShops.length === 0) {
      return NextResponse.json([]);
    }

    const shopIds = sellerShops.map((s) => s.id);

    // Get seller's products
    const sellerProducts = await db
      .select({ id: products.id })
      .from(products)
      .where(inArray(products.shopId, shopIds));

    const productIds = sellerProducts.map((p) => p.id);

    if (productIds.length === 0) {
      return NextResponse.json([]);
    }

    // Get order items for seller's products
    const orderItemsList = await db
      .select({ orderId: orderItems.orderId })
      .from(orderItems)
      .where(inArray(orderItems.productId, productIds));

    const orderIds = [...new Set(orderItemsList.map((item) => item.orderId))];

    if (orderIds.length === 0) {
      return NextResponse.json([]);
    }

    // Get recent orders with buyer info and payments
    const recentOrders = await db
      .select({
        id: orders.id,
        buyerId: orders.buyerId,
        buyerName: user.name,
        total: orders.total,
        createdAt: orders.createdAt,
        paymentStatus: payments.status,
      })
      .from(orders)
      .leftJoin(user, eq(orders.buyerId, user.id))
      .leftJoin(payments, eq(payments.orderId, orders.id))
      .where(inArray(orders.id, orderIds))
      .orderBy(sql`${orders.createdAt} DESC`)
      .limit(5);

    const formattedOrders = recentOrders.map((order) => ({
      id: order.id,
      status: order.paymentStatus?.toLowerCase() || "pending",
      customer: order.buyerName || "Unknown Customer",
      date: new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      amount: order.total ? Number(order.total) : 0,
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent orders" },
      { status: 500 }
    );
  }
}

