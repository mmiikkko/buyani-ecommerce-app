import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { orders, shop, orderItems, products, productImages, payments, user as userTable, productVariation, transactions } from "@/server/schema/auth-schema";
import { eq, inArray, sql, and } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/mobile-auth";

// GET /api/sellers/recent-orders - Get recent orders for seller dashboard
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sellerId = user.id;

    // Get seller's shops
    const sellerShops = await db
      .select({ id: shop.id })
      .from(shop)
      .where(eq(shop.sellerId, sellerId));

    if (sellerShops.length === 0) {
      return NextResponse.json([]);
    }

    const shopIds = sellerShops.map((s) => s.id);

    // Get seller's products
    const sellerProducts = await db
      .select({ id: products.id })
      .from(products)
      .where(inArray(products.shopId, shopIds));

    const productIds = sellerProducts.map((p) => p.id);

    if (productIds.length === 0) {
      return NextResponse.json([]);
    }

    // Optimized: Get order IDs first, then fetch recent orders
    // This avoids GROUP BY issues and is still fast
    const orderItemsList = await db
      .select({ orderId: orderItems.orderId })
      .from(orderItems)
      .innerJoin(productVariation, eq(orderItems.product_variation_id, productVariation.id))
      .where(inArray(productVariation.productId, productIds))
      .limit(100); // Limit to avoid too many order IDs

    const uniqueOrderIds = [...new Set(orderItemsList.map((item) => item.orderId))];

    if (uniqueOrderIds.length === 0) {
      return NextResponse.json([]);
    }

    // Get recent orders with buyer info
    const recentOrdersList = await db
      .select({
        id: orders.id,
        buyerId: orders.buyerId,
        buyerName: userTable.name,
        buyerFirstName: userTable.first_name,
        buyerLastName: userTable.last_name,
        total: orders.total,
        orderType: orders.orderType,
        customerName: orders.customerName,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .leftJoin(userTable, eq(orders.buyerId, userTable.id))
      .where(inArray(orders.id, uniqueOrderIds))
      .orderBy(sql`${orders.createdAt} DESC`)
      .limit(5);

    const resultOrderIds = recentOrdersList.map(o => o.id);

    // Fetch payments and transactions for these specific orders
    const [allPayments, allTransactions, allOrderItems] = await Promise.all([
      db.select().from(payments).where(inArray(payments.orderId, resultOrderIds)),
      db.select().from(transactions).where(inArray(transactions.orderId, resultOrderIds)),
      db.select({
        orderId: orderItems.orderId,
        productId: productVariation.productId,
        productName: products.productName,
        quantity: orderItems.quantity,
        subtotal: orderItems.subtotal,
        image: productImages.url
      })
        .from(orderItems)
        .innerJoin(productVariation, eq(orderItems.product_variation_id, productVariation.id))
        .innerJoin(products, eq(productVariation.productId, products.id))
        .leftJoin(productImages, eq(products.id, productImages.productId))
        .where(inArray(orderItems.orderId, resultOrderIds))
    ]);

    // Optimized: Get order with first product image
    const ordersWithImages = recentOrdersList.map((order) => {
      const itemsForOrder = allOrderItems.filter(i => i.orderId === order.id);
      const payment = allPayments.find(p => p.orderId === order.id);
      const transaction = allTransactions.find(t => t.orderId === order.id);

      // Determine customer name with fallbacks
      const customerName = order.orderType === "walk-in" && order.customerName
        ? order.customerName
        : (order.buyerName ||
          (order.buyerFirstName && order.buyerLastName
            ? `${order.buyerFirstName} ${order.buyerLastName}`.trim()
            : order.buyerFirstName || order.buyerLastName || "Unknown Customer"));

      return {
        id: order.id,
        orderId: order.id,
        status: payment?.status?.toLowerCase() || "pending",
        customer: customerName,
        date: new Date(order.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        total: order.total ? Number(order.total) : 0,
        createdAt: order.createdAt,
        type: order.orderType || transaction?.transactionType || "online",
        items: itemsForOrder.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          subtotal: Number(item.subtotal),
          productImage: item.image
        })),
      };
    });

    const response = NextResponse.json(ordersWithImages);
    // Add cache headers for faster subsequent loads (30 seconds)
    response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    return response;
  } catch (error: any) {
    console.error("Error fetching recent orders:", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to fetch recent orders", message: error.message },
      { status: 500 }
    );
  }
}

