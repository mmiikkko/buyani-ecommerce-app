import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { orders, shop, payments, products, orderItems, productVariation } from "@/server/schema/auth-schema";
import { eq, inArray, and, gte, lte, sql } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/mobile-auth";

// GET /api/sellers/stats - Get seller dashboard statistics
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const daysParam = searchParams.get("days");

    let dateFilter: Date | null = null;
    let endDateFilter: Date | null = null;

    if (startDateParam && endDateParam) {
      dateFilter = new Date(startDateParam);
      endDateFilter = new Date(endDateParam);
      endDateFilter.setHours(23, 59, 59, 999);
    } else if (daysParam) {
      const daysNum = parseInt(daysParam, 10);
      if (daysNum > 0) {
        dateFilter = new Date();
        dateFilter.setDate(dateFilter.getDate() - daysNum);
        dateFilter.setHours(0, 0, 0, 0);
      }
    }

    const sellerId = user.id;

    // 1. Get seller's shops
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

    // 2. Fetch Aggregated Product Stats
    const productStats = await db
      .select({
        status: products.status,
        count: sql<number>`COUNT(*)`,
      })
      .from(products)
      .where(inArray(products.shopId, shopIds))
      .groupBy(products.status);

    let activeProducts = 0;
    let removedProducts = 0;
    productStats.forEach(stat => {
      const st = (stat.status || "").toString().trim().toLowerCase();
      if (st === "removed" || st === "deleted") {
        removedProducts += Number(stat.count);
      } else {
        activeProducts += Number(stat.count);
      }
    });

    // 3. Fetch Aggregated Order/Sales Stats
    const successfulStatuses = ["paid", "completed", "succeeded", "captured"];
    const activeCODStatuses = ["pending", "confirmed", "accepted", "shipped", "delivered"];
    const excludedStatuses = ["rejected", "cancelled"];

    // Build subquery to get all unique seller-relevant items within date range
    const orderMetrics = await db
      .select({
        orderId: orders.id,
        itemSubtotal: orderItems.subtotal,
        paymentStatus: payments.status,
        paymentMethod: payments.paymentMethod,
      })
      .from(orderItems)
      .innerJoin(productVariation, eq(orderItems.product_variation_id, productVariation.id))
      .innerJoin(products, eq(productVariation.productId, products.id))
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .leftJoin(payments, eq(orders.id, payments.orderId))
      .where(
        and(
          inArray(products.shopId, shopIds),
          dateFilter ? gte(orders.createdAt, dateFilter) : undefined as any,
          endDateFilter ? lte(orders.createdAt, endDateFilter) : undefined as any,
          sql`${payments.status} NOT IN (${sql.join(excludedStatuses.map(s => sql`${s}`), sql`, `)}) OR ${payments.status} IS NULL`
        )
      );

    let totalSales = 0;
    const uniqueOrders = new Set<string>();
    const pendingOrderIds = new Set<string>();

    orderMetrics.forEach(item => {
      const status = (item.paymentStatus || "").toLowerCase();
      const method = (item.paymentMethod || "").toLowerCase();

      // Calculate Revenue
      const isSuccessful = successfulStatuses.includes(status);
      const isCODActive = method === "cod" && activeCODStatuses.includes(status);
      if (isSuccessful || isCODActive) {
        totalSales += Number(item.itemSubtotal || 0);
      }

      // Count Orders
      uniqueOrders.add(item.orderId);
      if (status === "pending") {
        pendingOrderIds.add(item.orderId);
      }
    });

    const response = NextResponse.json({
      totalSales,
      totalOrders: uniqueOrders.size,
      pendingOrders: pendingOrderIds.size,
      totalProducts: activeProducts,
      activeProducts,
      removedProducts,
    });
    // Add short cache to balance freshness and speed
    response.headers.set('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=60');
    return response;
  } catch (error: any) {
    console.error("Error fetching seller stats:", error);
    return NextResponse.json({ error: "Failed to fetch seller stats" }, { status: 500 });
  }
}

