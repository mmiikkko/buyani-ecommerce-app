import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import {
  orders,
  orderItems,
  payments,
  transactions,
  products,
  productInventory,
  shop,
} from "@/server/schema/auth-schema";
import { eq, inArray } from "drizzle-orm";
import { getServerSession } from "@/server/session";
import { v4 as uuidv4 } from "uuid";

// POST /api/sellers/pos/complete-sale - Complete an in-store sale
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sellerId = session.user.id;
    const body = await req.json();
    const { items, paymentMethod, paymentReceived, change } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items are required" },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "Payment method is required" },
        { status: 400 }
      );
    }

    // Get seller's shop
    const sellerShops = await db
      .select({ id: shop.id })
      .from(shop)
      .where(eq(shop.sellerId, sellerId))
      .limit(1);

    if (sellerShops.length === 0) {
      return NextResponse.json(
        { error: "No shop found for seller" },
        { status: 400 }
      );
    }

    const shopId = sellerShops[0].id;

    // Verify all products belong to seller's shop and check stock
    const productIds = items.map((item: any) => item.productId);
    const sellerProducts = await db
      .select()
      .from(products)
      .where(
        inArray(products.id, productIds)
      );

    // Filter products that belong to seller's shop
    const validProducts = sellerProducts.filter((p) => p.shopId === shopId);

    if (validProducts.length !== productIds.length) {
      return NextResponse.json(
        { error: "Some products do not belong to your shop" },
        { status: 403 }
      );
    }

    // Check stock availability
    const inventory = await db
      .select()
      .from(productInventory)
      .where(inArray(productInventory.productId, productIds));

    for (const item of items) {
      const inv = inventory.find((inv) => inv.productId === item.productId);
      if (!inv || (inv.quantityInStock || 0) < item.quantity) {
        const product = validProducts.find((p) => p.id === item.productId);
        return NextResponse.json(
          {
            error: `Insufficient stock for ${product?.productName || "product"}`,
          },
          { status: 400 }
        );
      }
    }

    // Calculate total
    const total = items.reduce(
      (sum: number, item: any) => sum + (item.price || 0) * item.quantity,
      0
    );

    // Create order (in-store orders don't need address)
    const orderId = uuidv4();
    await db.insert(orders).values({
      id: orderId,
      buyerId: session.user.id, // For in-store, buyer is the seller (walk-in customer)
      addressId: null, // No address for in-store
      total: String(total),
    });

    // Create order items
    for (const item of items) {
      await db.insert(orderItems).values({
        id: uuidv4(),
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        subtotal: String((item.price || 0) * item.quantity),
      });

      // Update inventory - decrease stock
      const inv = inventory.find((inv) => inv.productId === item.productId);
      if (inv) {
        await db
          .update(productInventory)
          .set({
            quantityInStock: (inv.quantityInStock || 0) - item.quantity,
            itemsSold: (inv.itemsSold || 0) + item.quantity,
          })
          .where(eq(productInventory.productId, item.productId));
      }
    }

    // Create payment record
    // For in-store sales, all payments are considered completed (paid in person)
    const paymentId = uuidv4();
    const paymentStatus = "completed"; // All in-store sales are completed immediately

    // Ensure paymentReceived is set to total if not provided (for non-cash methods)
    const finalPaymentReceived = paymentReceived 
      ? String(paymentReceived) 
      : String(total);

    await db.insert(payments).values({
      id: paymentId,
      orderId,
      paymentMethod: paymentMethod === "cash" ? "1" : paymentMethod === "gcash" ? "2" : "3", // 1=Cash, 2=GCash, 3=Maya
      paymentReceived: finalPaymentReceived, // Always set for in-store sales
      change: change ? String(change) : "0", // Set to 0 if no change
      status: paymentStatus,
    });

    // Create transaction record (mark as in-store)
    const transactionId = uuidv4();
    await db.insert(transactions).values({
      id: transactionId,
      userId: sellerId,
      orderId,
      transactionType: "instore",
      remarks: `In-store sale completed via ${paymentMethod}`,
    });

    return NextResponse.json({
      success: true,
      orderId,
      total,
      paymentMethod,
      message: "Sale completed successfully",
    });
  } catch (error) {
    console.error("Error completing sale:", error);
    return NextResponse.json(
      { error: "Failed to complete sale" },
      { status: 500 }
    );
  }
}

