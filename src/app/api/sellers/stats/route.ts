import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { orders, shop, payments, products, orderItems, productVariation } from "@/server/schema/auth-schema";
import { eq, inArray, and, gte, lte } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/mobile-auth";

// GET /api/sellers/stats - Get seller dashboard statistics
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user?.id) {
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

    const sellerId = user.id;

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

    // Count active products (all posted products, including out of stock)
    const activeProducts = sellerProducts.filter(p => {
      const status = (p.status || "").toString().trim().toLowerCase();
      const isRemoved = status === "removed" || status === "deleted";
      return !isRemoved;
    }).length;

    // Count strictly removed/deleted products
    const removedProducts = sellerProducts.filter(p => {
      const status = (p.status || "").toString().trim().toLowerCase();
      const isRemoved = status === "removed" || status === "deleted";
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
        productId: productVariation.productId,
      })
      .from(orderItems)
      .innerJoin(productVariation, eq(orderItems.product_variation_id, productVariation.id))
      .innerJoin(products, eq(productVariation.productId, products.id))
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

      // Get orders with payments and order totals/subtotals
      const ordersWithPayments = await db
        .select({
          orderId: orders.id,
          itemSubtotal: orderItems.subtotal,
          paymentMethod: payments.paymentMethod,
          status: payments.status,
          createdAt: orders.createdAt,
        })
        .from(orders)
        .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
        .innerJoin(productVariation, eq(orderItems.product_variation_id, productVariation.id))
        .innerJoin(products, eq(productVariation.productId, products.id))
        .leftJoin(payments, eq(payments.orderId, orders.id))
        .where(
          and(
            inArray(orders.id, orderIds),
            inArray(products.shopId, shopIds), // Ensure we only count items for this seller's shops
            dateFilter ? gte(orders.createdAt, dateFilter) : undefined as any,
            endDateFilter ? lte(orders.createdAt, endDateFilter) : undefined as any
          )
        );

      // Define successful and active statuses
      const successfulStatuses = ["paid", "completed", "succeeded", "captured"];
      const activeCODStatuses = ["pending", "confirmed", "accepted", "shipped", "delivered"];
      const excludedStatuses = ["rejected", "cancelled"];

      // Calculate total sales using item subtotals
      totalSales = ordersWithPayments.reduce((sum, item) => {
        const status = item.status?.toLowerCase();
        const method = item.paymentMethod?.toLowerCase();

        if (!status || excludedStatuses.includes(status)) {
          return sum;
        }

        const isSuccessful = successfulStatuses.includes(status);
        const isCODActive = method === "cod" && activeCODStatuses.includes(status);

        if (isSuccessful || isCODActive) {
          return sum + Number(item.itemSubtotal || 0);
        }
        return sum;
      }, 0);

      // Count unique orders that are NOT rejected or cancelled
      const validOrders = new Set(
        ordersWithPayments
          .filter(item => {
            const status = item.status?.toLowerCase();
            return status && !excludedStatuses.includes(status);
          })
          .map(item => item.orderId)
      );
      totalOrders = validOrders.size;

      // Count pending orders (specifically those with "pending" status and NOT cancelled/rejected)
      pendingOrders = new Set(
        ordersWithPayments
          .filter(item => item.status?.toLowerCase() === "pending")
          .map(item => item.orderId)
      ).size;
    }

    return NextResponse.json({
      totalSales,
      totalOrders,
      pendingOrders,
      totalProducts: activeProducts, // Total Products now shows only active products
      activeProducts,
      removedProducts,
    });
  } catch (error: any) {
    console.error("Error fetching seller stats:", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to fetch seller stats", message: error.message },
      { status: 500 }
    );
  }
}

