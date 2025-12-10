import { NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import {
  orders,
  orderItems,
  products,
  shop,
  payments,
  transactions,
  productImages,
  user,
} from "@/server/schema/auth-schema";
import { eq, inArray } from "drizzle-orm";
import { getServerSession } from "@/server/session";

// GET /api/sellers/orders - Get orders for the current seller
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Handle database connection errors gracefully
    try {
      const sellerId = session.user.id;

      const sellerShops = await db
        .select({ id: shop.id })
        .from(shop)
        .where(eq(shop.sellerId, sellerId));

      if (sellerShops.length === 0) {
        return NextResponse.json([]);
      }

      const shopIds = sellerShops.map((s) => s.id);

      const sellerProducts = await db
        .select({ id: products.id })
        .from(products)
        .where(inArray(products.shopId, shopIds));

      const productIds = sellerProducts.map((p) => p.id);

      if (productIds.length === 0) {
        return NextResponse.json([]);
      }

      const items = await db
        .select()
        .from(orderItems)
        .where(inArray(orderItems.productId, productIds));

      const orderIds = [...new Set(items.map((item) => item.orderId))];

      if (orderIds.length === 0) {
        return NextResponse.json([]);
      }

      // Optimize: Fetch all data in parallel for faster loading
      const [ordersList, allOrderItems, allPayments, allTransactions] = await Promise.all([
        db
          .select({
            id: orders.id,
            buyerId: orders.buyerId,
            addressId: orders.addressId,
            total: orders.total,
            createdAt: orders.createdAt,
            updatedAt: orders.updatedAt,
            buyerName: user.name,
            buyerFirstName: user.first_name,
            buyerLastName: user.last_name,
          })
          .from(orders)
          .leftJoin(user, eq(orders.buyerId, user.id))
          .where(inArray(orders.id, orderIds)),
        db
          .select({
            orderItem: orderItems,
            product: products,
            image: productImages,
          })
          .from(orderItems)
          .leftJoin(products, eq(orderItems.productId, products.id))
          .leftJoin(productImages, eq(productImages.productId, products.id))
          .where(inArray(orderItems.orderId, orderIds)),
        db
          .select()
          .from(payments)
          .where(inArray(payments.orderId, orderIds)),
        db
          .select()
          .from(transactions)
          .where(inArray(transactions.orderId, orderIds))
      ]);


      // 🟩 Type-safe product item group
      type GroupedOrderItem = {
        orderItem: typeof orderItems.$inferSelect;
        product: (typeof products.$inferSelect & { images: unknown[] }) | null;
      };

      const transformedOrders = ordersList.map((orderRow) => {
      const buyerName = orderRow.buyerName || 
        (orderRow.buyerFirstName && orderRow.buyerLastName 
          ? `${orderRow.buyerFirstName} ${orderRow.buyerLastName}`.trim()
          : orderRow.buyerFirstName || orderRow.buyerLastName || null);
      
      const orderItemsForOrder = allOrderItems.filter(
        (item) => item.orderItem.orderId === orderRow.id
      );

      const itemsWithProducts = orderItemsForOrder.reduce(
        (acc, row) => {
          const productId = row.orderItem.productId;

          if (!acc[productId]) {
            acc[productId] = {
              orderItem: row.orderItem,
              product: row.product
                ? { ...row.product, images: [] }
                : null,
            };
          }

          if (row.image) {
            acc[productId].product?.images.push({
              id: row.image.id,
              product_id: row.image.productId,
              image_url: [row.image.url],
              is_primary: false,
            });
          }

          return acc;
        },
        {} as Record<string, GroupedOrderItem>
      );

      // 🟩 FIX: removed "any", strong typing applied
      const items = Object.values(itemsWithProducts).map((item) => ({
        id: item.orderItem.id,
        orderId: item.orderItem.orderId,
        productId: item.orderItem.productId,
        quantity: item.orderItem.quantity,
        subtotal: Number(item.orderItem.subtotal),
        product: item.product
          ? {
              id: item.product.id,
              productName: item.product.productName,
              price: Number(item.product.price),
              images: item.product.images || [],
            }
          : null,
      }));

      const payment = allPayments.find((p) => p.orderId === orderRow.id);
      const orderTransactions = allTransactions.filter(
        (t) => t.orderId === orderRow.id
      );

      return {
        id: orderRow.id,
        buyerId: orderRow.buyerId,
        buyerName: buyerName,
        addressId: orderRow.addressId,
        total: orderRow.total ? Number(orderRow.total) : null,
        createdAt: orderRow.createdAt,
        updatedAt: orderRow.updatedAt,
        items,
        payment: payment
          ? {
              id: payment.id,
              orderId: payment.orderId,
              paymentMethod: payment.paymentMethod
                ? Number(payment.paymentMethod)
                : null,
              paymentReceived: payment.paymentReceived
                ? Number(payment.paymentReceived)
                : null,
              change: payment.change ? Number(payment.change) : null,
              status: payment.status || null,
              createdAt: payment.createdAt,
              updatedAt: payment.updatedAt,
            }
          : null,
        transactions: orderTransactions.map((t) => ({
          id: t.id,
          userId: t.userId,
          orderId: t.orderId,
          transactionType: t.transactionType || null,
          remarks: t.remarks || null,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        })),
        status: payment?.status?.toLowerCase() || "pending",
        type: orderTransactions[0]?.transactionType || "online",
      };
      });

      const response = NextResponse.json(transformedOrders);
      // Add cache headers for faster subsequent loads (1 minute)
      response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
      return response;
    } catch (dbError: any) {
      // Check for database connection errors
      const isConnectionError = 
        dbError?.cause?.code === "ECONNRESET" ||
        dbError?.cause?.code === "PROTOCOL_CONNECTION_LOST" ||
        dbError?.cause?.errno === -4077 ||
        dbError?.message?.includes("ECONNRESET");

      if (isConnectionError) {
        console.error("Database connection error in orders API:", dbError);
        return NextResponse.json(
          { error: "Database connection error. Please try again." },
          { status: 503 } // Service Unavailable
        );
      }
      throw dbError; // Re-throw if it's not a connection error
    }
  } catch (error) {
    // 🟩 FIX: error is unknown → properly narrowed
    if (error instanceof Error) {
      console.error("Error fetching seller orders:", error.message);
    } else {
      console.error("Unknown error fetching seller orders:", String(error));
    }

    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
