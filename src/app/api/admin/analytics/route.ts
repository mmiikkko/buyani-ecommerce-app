import { NextResponse } from "next/server";
import { getServerSession } from "@/server/session";
import { db } from "@/server/drizzle";

import {
  orders,
  orderItems,
  products,
  shop,
  payments,
} from "@/server/schema/auth-schema";

import { and, eq, gte, asc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const daysParam = searchParams.get("days");
    const shopId = searchParams.get("shopId");

    let startDate: Date | undefined;
    if (daysParam && daysParam !== "all") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - Number(daysParam));
    }

    /* ---------------- CONDITIONS ---------------- */
    const conditions = [
        eq(payments.status, "COMPLETED"), // ✅ correct column
    ];

    if (startDate) {
      conditions.push(gte(orders.createdAt, startDate));
    }

    if (shopId && shopId !== "all") {
      conditions.push(eq(products.shopId, shopId));
    }

    /* ---------------- QUERY ---------------- */
    const rows = await db
      .select({
        orderId: orders.id,
        createdAt: orders.createdAt,
        quantity: orderItems.quantity,
        price: orderItems.subtotal, // DECIMAL (string)
        productId: products.id,
        productName: products.productName,
        shopId: products.shopId,
      })
      .from(orders)
      .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
      .leftJoin(products, eq(products.id, orderItems.id))
      .where(and(...conditions))
      .orderBy(asc(orders.createdAt));

    /* ---------------- CHART ---------------- */
    const chartMap = new Map<string, { total: number; revenue: number }>();

    for (const row of rows) {
      if (!row.createdAt) continue;

      const dayKey = row.createdAt.toISOString().split("T")[0];

      if (!chartMap.has(dayKey)) {
        chartMap.set(dayKey, { total: 0, revenue: 0 });
      }

      const day = chartMap.get(dayKey)!;

      const qty = Number(row.quantity ?? 0);
      const price = Number(row.price ?? 0);

      day.total += qty;
      day.revenue += price * qty;
    }

    const chart = Array.from(chartMap.entries()).map(([day, data]) => ({
      day,
      total: data.total,
      revenue: data.revenue,
    }));

    /* ---------------- TOP ITEM ---------------- */
    const productSales = new Map<
      string,
      { productName: string; totalSold: number; shopId: string }
    >();

    for (const row of rows) {
      if (!row.productId) continue;

      if (!productSales.has(row.productId)) {
        productSales.set(row.productId, {
          productName: row.productName!,
          totalSold: 0,
          shopId: row.shopId!,
        });
      }

      productSales.get(row.productId)!.totalSold += Number(row.quantity ?? 0);
    }

    let topItem: any = null;
    for (const item of productSales.values()) {
      if (!topItem || item.totalSold > topItem.totalSold) {
        topItem = item;
      }
    }

    /* ---------------- SHOP NAME ---------------- */
    if (topItem && shopId === "all") {
      const result = await db
        .select({ name: shop.shopName })
        .from(shop)
        .where(eq(shop.id, topItem.shopId))
        .limit(1);

      if (result.length) {
        topItem.shopName = result[0].name;
      }
    }

    return NextResponse.json({ chart, topItem });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
