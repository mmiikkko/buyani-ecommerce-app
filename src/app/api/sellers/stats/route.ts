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

        // Get orders with payments and order totals
        const ordersWithPayments = await db
          .select({
            orderId: orders.id,
            orderTotal: orders.total,
            paymentReceived: payments.paymentReceived,
            status: payments.status,
          })
          .from(orders)
          .leftJoin(payments, eq(payments.orderId, orders.id))
          .where(inArray(orders.id, orderIds));

        // Calculate total sales
        // For seller stats, we use order total (which represents the seller's revenue from that order)
        // This matches how recent-orders displays amounts
        // Exclude rejected orders from total sales
        totalSales = ordersWithPayments.reduce((sum, order) => {
          // Skip rejected orders - they shouldn't count towards sales
          const orderStatus = order.status?.toLowerCase();
          if (orderStatus === "rejected") {
            return sum;
          }
          
          // Use order total as the primary source (seller's revenue from the order)
          // paymentReceived might be different (e.g., includes change for cash payments)
          const amount = order.orderTotal ? Number(order.orderTotal) : 0;
          return sum + amount;
        }, 0);

        // Count pending orders (status is null or "pending")
        pendingOrders = ordersWithPayments.filter(
          (order) => !order.status || order.status.toLowerCase() === "pending"
        ).length;
      }
    } else {
      // If no products, still return zeros but log for debugging
      console.log(`[Stats] Seller ${sellerId} has no products. Shop IDs: ${shopIds.join(", ")}`);
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

