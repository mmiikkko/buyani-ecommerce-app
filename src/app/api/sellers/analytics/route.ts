import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { getServerSession } from "@/server/session";
import { eq, inArray, sql, and, gte, lte } from "drizzle-orm";
import { orders, orderItems, products, shop, payments } from "@/server/schema/auth-schema";

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
    } else {
      // Default: last 30 days
      dateFilter = new Date();
      dateFilter.setDate(dateFilter.getDate() - 30);
    }

    const sellerId = session.user.id;

    // Get seller's shops
    const sellerShops = await db
      .select({ id: shop.id })
      .from(shop)
      .where(eq(shop.sellerId, sellerId));

    if (sellerShops.length === 0) {
      return NextResponse.json({
        chart: [],
        topItem: null,
      });
    }

    const shopIds = sellerShops.map((s) => s.id);

    // Get seller's products
    const sellerProducts = await db
      .select({ id: products.id })
      .from(products)
      .where(inArray(products.shopId, shopIds));

    const productIds = sellerProducts.map((p) => p.id);

    if (productIds.length === 0) {
      return NextResponse.json({
        chart: [],
        topItem: null,
      });
    }

    // Build date filter conditions
    const dateConditions = [];
    if (dateFilter) {
      dateConditions.push(gte(orders.createdAt, dateFilter));
    }
    if (endDateFilter) {
      dateConditions.push(lte(orders.createdAt, endDateFilter));
    }

    // Get order items for seller's products within date range
    const orderItemsList = await db
      .select({
        orderId: orderItems.orderId,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        createdAt: orders.createdAt,
        productName: products.productName,
        paymentStatus: payments.status,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .innerJoin(products, eq(orderItems.productId, products.id))
      .leftJoin(payments, eq(payments.orderId, orders.id))
      .where(
        and(
          inArray(orderItems.productId, productIds),
          ...dateConditions
        )
      );

    // Filter out rejected orders
    const validOrderItems = orderItemsList.filter(
      (item) => !item.paymentStatus || item.paymentStatus.toLowerCase() !== "rejected"
    );

    // Generate chart data - group by day
    const chartDataMap = new Map<string, number>();
    
    // Determine number of days to show
    let daysToShow = 30; // default
    if (startDate && endDateFilter) {
      const diffTime = endDateFilter.getTime() - dateFilter!.getTime();
      daysToShow = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    } else if (days) {
      daysToShow = parseInt(days, 10);
    }
    
    // Initialize all days with 0
    const endDateForInit = endDateFilter || new Date();
    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(endDateForInit);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      chartDataMap.set(dateKey, 0);
    }

    // Aggregate quantities by day
    validOrderItems.forEach((item) => {
      if (item.createdAt) {
        const dateKey = new Date(item.createdAt).toISOString().split('T')[0];
        const currentTotal = chartDataMap.get(dateKey) || 0;
        chartDataMap.set(dateKey, currentTotal + Number(item.quantity || 0));
      }
    });

    // Convert to array format for chart (most recent first)
    const chart = Array.from(chartDataMap.entries())
      .map(([day, total]) => ({ day, total }))
      .sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());

    // Find top selling product
    const productSalesMap = new Map<string, { productName: string; totalSold: number }>();
    
    validOrderItems.forEach((item) => {
      if (item.productName && item.productId) {
        const existing = productSalesMap.get(item.productId);
        if (existing) {
          existing.totalSold += Number(item.quantity || 0);
        } else {
          productSalesMap.set(item.productId, {
            productName: item.productName,
            totalSold: Number(item.quantity || 0),
          });
        }
      }
    });

    // Find the top item
    let topItem: { productName: string; totalSold: number } | null = null;
    let maxSold = 0;

    productSalesMap.forEach((product) => {
      if (product.totalSold > maxSold) {
        maxSold = product.totalSold;
        topItem = product;
      }
    });

    return NextResponse.json({
      chart,
      topItem,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
