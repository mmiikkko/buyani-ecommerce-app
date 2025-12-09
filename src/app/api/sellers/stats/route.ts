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

    // Get seller's products (including deleted ones for stats purposes)
    const sellerProducts = await db
      .select({ id: products.id })
      .from(products)
      .where(inArray(products.shopId, shopIds));

    // Total Products - only count non-deleted products
    const totalProducts = sellerProducts.length;

    // Get orders for seller's products by joining orderItems with products
    // This way, even if a product is deleted, we can still find orderItems
    // by joining through products that belong to the seller's shops
    let totalOrders = 0;
    let pendingOrders = 0;
    let totalSales = 0;

    // Query orderItems by joining with products to filter by shopId
    // This ensures we get all orderItems for seller's products, even if products are later deleted
    const orderItemsList = await db
      .select({ 
        orderId: orderItems.orderId,
        productId: orderItems.productId,
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(inArray(products.shopId, shopIds));

    if (orderItemsList.length > 0) {
      const orderIds = [...new Set(orderItemsList.map((item) => item.orderId))];

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

