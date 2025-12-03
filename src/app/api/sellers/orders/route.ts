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

    const ordersList = await db
      .select()
      .from(orders)
      .where(inArray(orders.id, orderIds));

    const allOrderItems = await db
      .select({
        orderItem: orderItems,
        product: products,
        image: productImages,
      })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .leftJoin(productImages, eq(productImages.productId, products.id))
      .where(inArray(orderItems.orderId, orderIds));

    const allPayments = await db
      .select()
      .from(payments)
      .where(inArray(payments.orderId, orderIds));

    const allTransactions = await db
      .select()
      .from(transactions)
      .where(inArray(transactions.orderId, orderIds));

    // 🟩 Type-safe product item group
    type GroupedOrderItem = {
      orderItem: typeof orderItems.$inferSelect;
      product: (typeof products.$inferSelect & { images: unknown[] }) | null;
    };

    const transformedOrders = ordersList.map((order) => {
      const orderItemsForOrder = allOrderItems.filter(
        (item) => item.orderItem.orderId === order.id
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

      const payment = allPayments.find((p) => p.orderId === order.id);
      const orderTransactions = allTransactions.filter(
        (t) => t.orderId === order.id
      );

      return {
        id: order.id,
        buyerId: order.buyerId,
        addressId: order.addressId,
        total: order.total ? Number(order.total) : null,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
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

    return NextResponse.json(transformedOrders);
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
