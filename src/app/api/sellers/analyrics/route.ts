// app/api/sellers/analytics/route.ts
import { NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { getServerSession } from "@/server/session";
import { eq, sql } from "drizzle-orm";
import {
  orders,
  orderItems,
  products,
  shop
} from "@/server/schema/auth-schema";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sellerId = session.user.id;

    // Seller shop
    const sellerShop = await db
      .select({ id: shop.id })
      .from(shop)
      .where(eq(shop.sellerId, sellerId))
      .limit(1);

    if (!sellerShop.length) {
      return NextResponse.json({
        chart: [],
        topItem: null,
      });
    }

    const shopId = sellerShop[0].id;

    // LAST 30 DAYS SALES (GROUP BY DATE)
    const last30Days = await db.execute(sql`
        SELECT
          DATE(o.created_at) AS day,
          SUM(oi.quantity) AS total
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE o.shop_id = ${shopId}
          AND o.created_at >= CURDATE() - INTERVAL 30 DAY
        GROUP BY DATE(o.created_at)
        ORDER BY day ASC
      `);
      

    // MOST BOUGHT ITEM (LAST 30 DAYS)
    const topItem = await db.execute(sql`
        SELECT
          p.productName,
          SUM(oi.quantity) AS totalSold
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        JOIN products p ON oi.product_id = p.id
        WHERE o.shop_id = ${shopId}
          AND o.created_at >= CURDATE() - INTERVAL 30 DAY
        GROUP BY p.id, p.productName
        ORDER BY totalSold DESC
        LIMIT 1
      `);
      

    return NextResponse.json({
      //chart: last30Days.rows,
      //topItem: topItem.rows?.[0] ?? null,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load analytics" },
      { status: 500 }
    );
  }
}
