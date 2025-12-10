import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { orders, shop, payments, products, orderItems } from "@/server/schema/auth-schema";
import { eq, inArray, sql, and, gte, lte } from "drizzle-orm";
import { getServerSession } from "@/server/session";

// GET /api/sellers/stats - Get seller dashboard statistics
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get date range from query params
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const days = searchParams.get("days");

    // Calculate date range
    let dateFilter: Date | null = null;
    let endDateFilter: Date | null = null;
    
    if (startDate && endDate) {
      // Custom date range
      dateFilter = new Date(startDate);
      endDateFilter = new Date(endDate);
      endDateFilter.setHours(23, 59, 59, 999); // End of day
    } else if (days) {
      // Days filter (e.g., 7, 30, 90, 365)
      const daysNum = parseInt(days, 10);
      if (daysNum > 0) {
        dateFilter = new Date();
        dateFilter.setDate(dateFilter.getDate() - daysNum);
      }
    }
    // If no date filter, show all time

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
        activeProducts: 0,
        removedProducts: 0,
      });
    }

    const shopIds = sellerShops.map((s) => s.id);

    // Get seller's products (including deleted ones for stats purposes)
    const sellerProducts = await db
      .select({ 
        id: products.id,
        status: products.status,
        isAvailable: products.isAvailable,
      })
      .from(products)
      .where(inArray(products.shopId, shopIds));

    // Count active products (not removed)
    const activeProducts = sellerProducts.filter(p => {
      const status = (p.status || "").toString().trim().toLowerCase();
      const isRemoved = status === "removed" || status === "deleted" || (!p.isAvailable && !status);
      return !isRemoved;
    }).length;

    // Count removed products
    const removedProducts = sellerProducts.filter(p => {
      const status = (p.status || "").toString().trim().toLowerCase();
      const isRemoved = status === "removed" || status === "deleted" || (!p.isAvailable && !status);
      return isRemoved;
    }).length;

    // Get orders for seller's products by joining orderItems with products
    // This way, even if a product is deleted, we can still find orderItems
    // by joining through products that belong to the seller's shops
    let totalOrders = 0;
    let pendingOrders = 0;
    let totalSales = 0;

    // Query orderItems by joining with products and orders to filter by shopId and date
    // This ensures we get all orderItems for seller's products, even if products are later deleted
    const orderItemsConditions = [inArray(products.shopId, shopIds)];
    if (dateFilter) {
      orderItemsConditions.push(gte(orders.createdAt, dateFilter));
    }
    if (endDateFilter) {
      orderItemsConditions.push(lte(orders.createdAt, endDateFilter));
    }

    const orderItemsList = await db
      .select({ 
        orderId: orderItems.orderId,
        productId: orderItems.productId,
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(and(...orderItemsConditions));

    if (orderItemsList.length > 0) {
      const orderIds = [...new Set(orderItemsList.map((item) => item.orderId))];

      // Total Orders
      totalOrders = orderIds.length;

      // Build date filter conditions
      const dateConditions = [inArray(orders.id, orderIds)];
      if (dateFilter) {
        dateConditions.push(gte(orders.createdAt, dateFilter));
      }
      if (endDateFilter) {
        dateConditions.push(lte(orders.createdAt, endDateFilter));
      }

      // Get orders with payments and order totals
      const ordersWithPayments = await db
        .select({
          orderId: orders.id,
          orderTotal: orders.total,
          paymentReceived: payments.paymentReceived,
          status: payments.status,
          createdAt: orders.createdAt,
        })
        .from(orders)
        .leftJoin(payments, eq(payments.orderId, orders.id))
        .where(and(...dateConditions));

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
      totalProducts: activeProducts, // Total Products now shows only active products
      activeProducts,
      removedProducts,
    });
  } catch (error) {
    console.error("Error fetching seller stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch seller stats" },
      { status: 500 }
    );
  }
}

