import { NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { getServerSession } from "@/server/session";
import { eq, inArray, sql, and, gte } from "drizzle-orm";
import { orders, orderItems, products, shop, payments } from "@/server/schema/auth-schema";

export async function GET() {
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

    // Get orders from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get order items for seller's products from last 30 days
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
          gte(orders.createdAt, thirtyDaysAgo)
        )
      );

    // Filter out rejected orders
    const validOrderItems = orderItemsList.filter(
      (item) => !item.paymentStatus || item.paymentStatus.toLowerCase() !== "rejected"
    );

    // Generate chart data - group by day for last 30 days
    const chartDataMap = new Map<string, number>();
    
    // Initialize all 30 days with 0
    for (let i = 0; i < 30; i++) {
      const date = new Date();
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
