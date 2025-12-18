import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/drizzle';
import {
  orders,
  orderItems,
  addresses,
  cartItems,
  carts,
  payments,
  user,
  products,
  productInventory,
  productImages,
  shop,
} from '@/server/schema/auth-schema';
import { eq, inArray } from 'drizzle-orm';
import { getServerSession } from '@/server/session';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { corsResponse, corsOptions } from '@/lib/api-utils';

async function getUserId(req: NextRequest): Promise<string | null> {
  const session = await getServerSession();
  if (session?.user?.id) return session.user.id;

  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET || 'your-secret-key';
    try {
      const decoded = jwt.verify(token, jwtSecret) as { userId?: string };
      return decoded.userId || null;
    } catch {
      return null;
    }
  }
  return null;
}

export async function OPTIONS() {
  return corsOptions();
}


// GET /api/orders - Get orders for the current user
export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return corsResponse({ error: "Unauthorized" }, 401);
    }

    // Get orders for the user
    const userOrders = await db
      .select({
        id: orders.id,
        buyerId: orders.buyerId,
        buyerName: user.name,
        addressId: orders.addressId,
        total: orders.total,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
      })
      .from(orders)
      .leftJoin(user, eq(orders.buyerId, user.id))
      .where(eq(orders.buyerId, userId));

    // fetch items for each order with product images and shop info
    const orderIds = userOrders.map((o) => o.id);
    const items = orderIds.length
      ? await db
          .select({
            orderId: orderItems.orderId,
            productId: orderItems.productId,
            productName: products.productName,
            shopId: products.shopId,
            shopName: shop.shopName,
            quantity: orderItems.quantity,
            subtotal: orderItems.subtotal,
          })
          .from(orderItems)
          .leftJoin(products, eq(orderItems.productId, products.id))
          .leftJoin(shop, eq(products.shopId, shop.id))
          .where(inArray(orderItems.orderId, orderIds))
      : [];

    // Fetch product images for each product
    const productIds = [...new Set(items.map((i) => i.productId).filter(Boolean))];
    const images = productIds.length
      ? await db
          .select({
            productId: productImages.productId,
            imageUrl: productImages.url,
          })
          .from(productImages)
          .where(inArray(productImages.productId, productIds))
      : [];

    // Group images by productId and get primary image (first one)
    const productImageMap = new Map<string, string>();
    images.forEach((img) => {
      if (img.productId && img.imageUrl && !productImageMap.has(img.productId)) {
        productImageMap.set(img.productId, img.imageUrl);
      }
    });

    // Add image URL to each item
    const itemsWithImages = items.map((item) => ({
      ...item,
      productImage: productImageMap.get(item.productId || "") || null,
    }));

    const paymentsData = orderIds.length
      ? await db
          .select({
            orderId: payments.orderId,
            status: payments.status,
            paymentMethod: payments.paymentMethod,
            paymentReceived: payments.paymentReceived,
            change: payments.change,
          })
          .from(payments)
          .where(inArray(payments.orderId, orderIds))
      : [];

    // Derive shop info from items (all items in an order belong to same shop)
    const withItems = userOrders.map((o) => {
      const orderItemsList = itemsWithImages.filter((i) => i.orderId === o.id);
      const firstItem = orderItemsList[0];
      return {
        ...o,
        shopId: firstItem?.shopId || null,
        shopName: firstItem?.shopName || null,
        items: orderItemsList,
        payment: paymentsData.find((p) => p.orderId === o.id),
      };
    });

    return corsResponse(withItems);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return corsResponse(
      { error: "Failed to fetch orders" },
      500
    );
  }
}

type CartItem = {
  id?: string;
  productId: string;
  price?: number;
  quantity: number;
  shopId?: string;
};

// POST /api/orders - Create new orders from cart (separated by shop)
export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return corsResponse({ error: "Unauthorized" }, 401);
    }

    const body = await req.json();
    const { address, paymentMethod, cartItems: items } = body;

    if (!address || !paymentMethod || !items || items.length === 0) {
      return corsResponse(
        { error: "Missing required fields" },
        400
      );
    }

    // Create or get address
    let addressId: string | null = null;
    if (address) {
      // Check if address already exists for this user
      const existingAddresses = await db
        .select()
        .from(addresses)
        .where(eq(addresses.userId, userId))
        .limit(1);

      if (existingAddresses.length > 0) {
        addressId = existingAddresses[0].id;
        // Update existing address
        const fullStreet = address.apartment
          ? `${address.street}, ${address.apartment}`
          : address.street;
        await db
          .update(addresses)
          .set({
            receipientName: address.fullName,
            street: fullStreet,
            city: address.city,
            province: address.province,
            zipcode: address.zipcode,
            region: address.country,
            remarks: address.deliveryNotes || null,
          })
          .where(eq(addresses.id, addressId));
      } else {
        // Create new address
        addressId = uuidv4();
        const fullStreet = address.apartment
          ? `${address.street}, ${address.apartment}`
          : address.street;
        await db.insert(addresses).values({
          id: addressId,
          userId: userId,
          receipientName: address.fullName,
          street: fullStreet,
          city: address.city,
          province: address.province,
          zipcode: address.zipcode,
          region: address.country,
          remarks: address.deliveryNotes || null,
        });
      }
    }

    // Get product info with shop IDs
    const productIds = items.map((item: CartItem) => item.productId);
    const productData = await db
      .select({
        id: products.id,
        shopId: products.shopId,
        productName: products.productName,
      })
      .from(products)
      .where(inArray(products.id, productIds));

    // Check stock availability before creating orders
    const inventory = await db
      .select()
      .from(productInventory)
      .where(inArray(productInventory.productId, productIds));

    for (const item of items) {
      const inv = inventory.find((inv) => inv.productId === item.productId);
      if (!inv || (Number(inv.quantityInStock || 0)) < item.quantity) {
        const product = productData.find((p) => p.id === item.productId);
        return corsResponse(
          {
            error: `Insufficient stock for ${product?.productName || "product"}. Available: ${inv?.quantityInStock || 0}, Requested: ${item.quantity}`,
          },
          400
        );
      }
    }

    // Group items by shop
    const itemsByShop = new Map<string, CartItem[]>();
    for (const item of items) {
      const product = productData.find((p) => p.id === item.productId);
      const shopId = product?.shopId || item.shopId || "unknown";
      
      if (!itemsByShop.has(shopId)) {
        itemsByShop.set(shopId, []);
      }
      itemsByShop.get(shopId)!.push(item);
    }

    // Get shop names for the response
    const shopIds = Array.from(itemsByShop.keys()).filter(id => id !== "unknown");
    const shopData = shopIds.length > 0
      ? await db
          .select({ id: shop.id, shopName: shop.shopName })
          .from(shop)
          .where(inArray(shop.id, shopIds))
      : [];

    const createdOrders: { orderId: string; shopId: string; shopName: string; subtotal: number }[] = [];
    let totalSubtotal = 0;

    // Create separate order for each shop
    for (const [shopId, shopItems] of itemsByShop) {
      const shopSubtotal = shopItems.reduce(
        (sum: number, item: CartItem) => sum + (item.price || 0) * item.quantity,
        0
      );
      totalSubtotal += shopSubtotal;

      const shopInfo = shopData.find((s) => s.id === shopId);
      const orderId = uuidv4();

      // Create order (shop is determined by products in order items)
      await db.insert(orders).values({
        id: orderId,
        buyerId: userId,
        addressId,
        total: String(shopSubtotal),
      });

      // Create order items and decrease stock for this shop's items
      for (const item of shopItems) {
        await db.insert(orderItems).values({
          id: uuidv4(),
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          subtotal: String((item.price || 0) * item.quantity),
        });

        // Decrease product stock
        const inv = inventory.find((i) => i.productId === item.productId);
        if (inv) {
          const currentStock = Number(inv.quantityInStock || 0);
          const newStock = Math.max(0, currentStock - item.quantity);
          await db
            .update(productInventory)
            .set({
              quantityInStock: newStock,
              itemsSold: (Number(inv.itemsSold || 0) + item.quantity),
            })
            .where(eq(productInventory.productId, item.productId));
          
          // Update the inventory object for subsequent items
          inv.quantityInStock = newStock;
          inv.itemsSold = (Number(inv.itemsSold || 0) + item.quantity);
        }
      }

      // Create payment record for this order
      const paymentId = uuidv4();
      const isCOD = paymentMethod === "cod";
      const isGCash = paymentMethod === "gcash";
      
      await db.insert(payments).values({
        id: paymentId,
        orderId,
        paymentMethod: paymentMethod,
        paymentReceived: isCOD || isGCash ? null : String(shopSubtotal),
        change: null,
        status: isCOD || isGCash ? "pending" : "completed",
      });

      createdOrders.push({
        orderId,
        shopId,
        shopName: shopInfo?.shopName || "Unknown Shop",
        subtotal: shopSubtotal,
      });
    }

    // Clear only the checked-out cart items, keep others intact
    const cart = await db
      .select()
      .from(carts)
      .where(eq(carts.buyerId, userId))
      .limit(1);

    const cartItemIds = Array.isArray(items)
      ? items
          .map((item: CartItem) => item.id)
          .filter((id: string | undefined) => Boolean(id))
      : [];

    if (cart.length > 0 && cartItemIds.length > 0) {
      await db
        .delete(cartItems)
        .where(
          (
            eq(cartItems.cartId, cart[0].id),
            inArray(cartItems.id, cartItemIds as string[])
          )
        );
    }

    return corsResponse({
      success: true,
      orders: createdOrders,
      // Keep backward compatibility - return first orderId for single shop orders
      orderId: createdOrders[0]?.orderId,
      subtotal: totalSubtotal,
      paymentMethod,
      message: `${createdOrders.length} order(s) placed successfully`,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return corsResponse(
      { error: "Failed to create order" },
      500
    );
  }
}

// PUT /api/orders?id=xxx
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id");
    if (!orderId) return corsResponse({ error: "Missing id" }, 400);
    
    const userId = await getUserId(req);
    if (!userId) {
      return corsResponse({ error: "Unauthorized" }, 401);
    }

    const updates = await req.json();
    
    // Verify order belongs to user
    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (order.length === 0) {
      return corsResponse({ error: "Order not found" }, 404);
    }

    if (order[0].buyerId !== userId) {
      return corsResponse({ error: "Unauthorized" }, 403);
    }

    // If order is being cancelled, restore stock
    if (updates.status === "cancelled" || updates.status === "rejected") {
      // Get order items
      const orderItemsData = await db
        .select({
          productId: orderItems.productId,
          quantity: orderItems.quantity,
        })
        .from(orderItems)
        .where(eq(orderItems.orderId, orderId));

      // Restore stock for each item
      for (const item of orderItemsData) {
        const inventory = await db
          .select()
          .from(productInventory)
          .where(eq(productInventory.productId, item.productId))
          .limit(1);

        if (inventory.length > 0) {
          const currentStock = Number(inventory[0].quantityInStock || 0);
          const currentSold = Number(inventory[0].itemsSold || 0);
          await db
            .update(productInventory)
            .set({
              quantityInStock: currentStock + item.quantity,
              itemsSold: Math.max(0, currentSold - item.quantity),
            })
            .where(eq(productInventory.productId, item.productId));
        }
      }
    }

    // Update payment status (status is stored in payments table, not orders table)
    if (updates.status) {
      const existingPayment = await db
        .select()
        .from(payments)
        .where(eq(payments.orderId, orderId))
        .limit(1);

      if (existingPayment.length > 0) {
        await db
          .update(payments)
          .set({
            status: updates.status,
            updatedAt: new Date(),
          })
          .where(eq(payments.orderId, orderId));
      } else {
        // Create payment record if it doesn't exist
        await db.insert(payments).values({
          id: uuidv4(),
          orderId: orderId,
          status: updates.status,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    // Update other order fields if provided (excluding status which is in payments)
    const { status, ...orderUpdates } = updates;
    if (Object.keys(orderUpdates).length > 0) {
      await db.update(orders).set(orderUpdates).where(eq(orders.id, orderId));
    }

    return corsResponse({ success: true });
  } catch (error) {
    console.error("Error updating order:", error);
    return corsResponse(
      { error: "Failed to update order" },
      500
    );
  }
}

// DELETE /api/orders?id=xxx
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("id");
  if (!orderId) return corsResponse({ error: "Missing id" }, 400);
  await db.delete(orders).where(eq(orders.id, orderId));
  return corsResponse({ success: true });
}
