import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { orders, shop, payments, products, orderItems } from "@/server/schema/auth-schema";
import { eq, inArray, sql, and } from "drizzle-orm";
import { getServerSession } from "@/server/session";

// GET /api/sellers/stats - Get seller dashboard statistics
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
      return NextResponse.json({
        totalSales: 0,
        totalOrders: 0,
        pendingOrders: 0,
        totalProducts: 0,
      });
    }

    const shopIds = sellerShops.map((s) => s.id);

    // Get seller's products
    const sellerProducts = await db
      .select({ id: products.id })
      .from(products)
      .where(inArray(products.shopId, shopIds));

    const productIds = sellerProducts.map((p) => p.id);

    // Total Products
    const totalProducts = sellerProducts.length;

    // Get orders for seller's products
    let totalOrders = 0;
    let pendingOrders = 0;
    let totalSales = 0;

    if (productIds.length > 0) {
      const orderItemsList = await db
        .select({ orderId: orderItems.orderId })
        .from(orderItems)
        .where(inArray(orderItems.productId, productIds));

      const orderIds = [...new Set(orderItemsList.map((item) => item.orderId))];

      if (orderIds.length > 0) {
        // Total Orders
        totalOrders = orderIds.length;

        // Get orders with payments
        const ordersWithPayments = await db
          .select({
            orderId: orders.id,
            paymentReceived: payments.paymentReceived,
            status: payments.status,
          })
          .from(orders)
          .leftJoin(payments, eq(payments.orderId, orders.id))
          .where(inArray(orders.id, orderIds));

        // Calculate total sales
        totalSales = ordersWithPayments.reduce((sum, order) => {
          const amount = order.paymentReceived ? Number(order.paymentReceived) : 0;
          return sum + amount;
        }, 0);

        // Count pending orders (status is null or "pending")
        pendingOrders = ordersWithPayments.filter(
          (order) => !order.status || order.status.toLowerCase() === "pending"
        ).length;
      }
    }

    return NextResponse.json({
      totalSales,
      totalOrders,
      pendingOrders,
      totalProducts,
    });
  } catch (error) {
    console.error("Error fetching seller stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch seller stats" },
      { status: 500 }
    );
  }
}

