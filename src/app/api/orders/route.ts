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
} from '@/server/schema/auth-schema';
import { eq, inArray, and } from 'drizzle-orm';
import { getServerSession } from '@/server/session';
import { v4 as uuidv4 } from 'uuid';


// GET /api/orders - Get orders for the current user
// GET /api/orders - Get orders for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Join orders with user table to get the buyer's name
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
      .where(eq(orders.buyerId, session.user.id));

    // fetch items for each order with product images
    const orderIds = userOrders.map((o) => o.id);
    const items = orderIds.length
      ? await db
          .select({
            orderId: orderItems.orderId,
            productId: orderItems.productId,
            productName: products.productName,
            quantity: orderItems.quantity,
            subtotal: orderItems.subtotal,
          })
          .from(orderItems)
          .leftJoin(products, eq(orderItems.productId, products.id))
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

    const withItems = userOrders.map((o) => ({
      ...o,
      items: itemsWithImages.filter((i) => i.orderId === o.id),
      payment: paymentsData.find((p) => p.orderId === o.id),
    }));

    return NextResponse.json(withItems);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

type CartItem = {
  price?: number; // Optional, as indicated by `item.price || 0`
  quantity: number;
};

// POST /api/orders - Create a new order from cart
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { address, paymentMethod, cartItems: items } = body;

    if (!address || !paymentMethod || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate total
    const subtotal = items.reduce(
      (sum: number, item: CartItem) => sum + (item.price || 0) * item.quantity,
      0
    );

    // Create or get address
    let addressId: string | null = null;
    if (address) {
      // Check if address already exists for this user
      const existingAddresses = await db
        .select()
        .from(addresses)
        .where(eq(addresses.userId, session.user.id))
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
          userId: session.user.id,
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

    // Check stock availability before creating order
    const productIds = items.map((item: any) => item.productId);
    const inventory = await db
      .select()
      .from(productInventory)
      .where(inArray(productInventory.productId, productIds));

    for (const item of items) {
      const inv = inventory.find((inv) => inv.productId === item.productId);
      if (!inv || (Number(inv.quantityInStock || 0)) < item.quantity) {
        const product = await db
          .select({ productName: products.productName })
          .from(products)
          .where(eq(products.id, item.productId))
          .limit(1);
        return NextResponse.json(
          {
            error: `Insufficient stock for ${product[0]?.productName || "product"}. Available: ${inv?.quantityInStock || 0}, Requested: ${item.quantity}`,
          },
          { status: 400 }
        );
      }
    }

    // Create order
    const orderId = uuidv4();
    await db.insert(orders).values({
      id: orderId,
      buyerId: session.user.id,
      addressId,
      total: String(subtotal),
    });

    // Create order items and decrease stock
    for (const item of items) {
      await db.insert(orderItems).values({
        id: uuidv4(),
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        subtotal: String((item.price || 0) * item.quantity),
      });

      // Decrease product stock
      const inventory = await db
        .select()
        .from(productInventory)
        .where(eq(productInventory.productId, item.productId))
        .limit(1);

      if (inventory.length > 0) {
        const currentStock = Number(inventory[0].quantityInStock || 0);
        const newStock = Math.max(0, currentStock - item.quantity);
        await db
          .update(productInventory)
          .set({
            quantityInStock: newStock,
            itemsSold: (Number(inventory[0].itemsSold || 0) + item.quantity),
          })
          .where(eq(productInventory.productId, item.productId));
      }
    }

    // Create payment record
    const paymentId = uuidv4();
    const isCOD = paymentMethod === "cod";
    const isGCash = paymentMethod === "gcash";
    
    await db.insert(payments).values({
      id: paymentId,
      orderId,
      paymentMethod: paymentMethod, // Store payment method type
      paymentReceived: isCOD || isGCash ? null : String(subtotal), // For COD/GCash, payment received is null until confirmed
      change: null, // Will be calculated when payment is received
      status: isCOD || isGCash ? "pending" : "completed", // COD and GCash are pending until confirmed
    });

    // Clear only the checked-out cart items, keep others intact
    const cart = await db
      .select()
      .from(carts)
      .where(eq(carts.buyerId, session.user.id))
      .limit(1);

    const cartItemIds = Array.isArray(items)
      ? items
          .map((item: any) => item.id)
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

    return NextResponse.json({
      success: true,
      orderId,
      subtotal,
      paymentMethod,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

// PUT /api/orders?id=xxx
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id");
    if (!orderId) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await req.json();
    
    // Verify order belongs to user
    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (order.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order[0].buyerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// DELETE /api/orders?id=xxx
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("id");
  if (!orderId) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.delete(orders).where(eq(orders.id, orderId));
  return NextResponse.json({ success: true });
}
