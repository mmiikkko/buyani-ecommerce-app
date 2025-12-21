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
  productVariation,
} from "@/server/schema/auth-schema";
import { eq, inArray } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/mobile-auth";
import { v4 as uuidv4 } from "uuid";

// POST /api/sellers/pos/complete-sale - Complete a walk-in sale
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sellerId = user.id;
    const body = await req.json();
    const { items, paymentMethod, paymentReceived, change, customerName } = body;

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

    // Get variations for these products (assuming default variation for POS for now, or adapt if needed)
    const variations = await db
      .select()
      .from(productVariation)
      .where(inArray(productVariation.productId, productIds));

    const variationIds = variations.map(v => v.id);

    // Filter products that belong to seller's shop
    const validProducts = sellerProducts.filter((p) => p.shopId === shopId);

    if (validProducts.length !== productIds.length) {
      return NextResponse.json(
        { error: "Some products do not belong to your shop" },
        { status: 403 }
      );
    }

    // Check stock availability (inventory is linked to product_variation_id)
    const inventory = await db
      .select()
      .from(productInventory)
      .where(inArray(productInventory.product_variation_id, variationIds));

    for (const item of items) {
      const variation = variations.find(v => v.productId === item.productId);
      if (!variation) {
        return NextResponse.json({ error: `No variation found for product ${item.productId}` }, { status: 400 });
      }
      const inv = inventory.find((inv) => inv.product_variation_id === variation.id);
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

    // Create order (walk-in orders don't need address)
    const orderId = uuidv4();
    await db.insert(orders).values({
      id: orderId,
      buyerId: user.id, // For walk-in, buyer is the seller (walk-in customer)
      addressId: null, // No address for walk-in
      total: String(total),
      orderType: "walk-in",
      customerName: customerName || "Walk-in Customer",
    });

    // Create order items
    for (const item of items) {
      const variation = variations.find(v => v.productId === item.productId);
      if (!variation) continue;

      await db.insert(orderItems).values({
        id: uuidv4(),
        orderId,
        product_variation_id: variation.id,
        quantity: item.quantity,
        subtotal: String((item.price || 0) * item.quantity),
      });

      // Update inventory - decrease stock
      const inv = inventory.find((inv) => inv.product_variation_id === variation.id);
      if (inv) {
        await db
          .update(productInventory)
          .set({
            quantityInStock: (inv.quantityInStock || 0) - item.quantity,
            itemsSold: (inv.itemsSold || 0) + item.quantity,
          })
          .where(eq(productInventory.product_variation_id, variation.id));
      }
    }

    // Create payment record
    // For walk-in sales, all payments are considered completed (paid in person)
    const paymentId = uuidv4();
    const paymentStatus = "completed"; // All walk-in sales are completed immediately

    // Ensure paymentReceived is set to total if not provided (for non-cash methods)
    const finalPaymentReceived = paymentReceived
      ? String(paymentReceived)
      : String(total);

    await db.insert(payments).values({
      id: paymentId,
      orderId,
      paymentMethod: paymentMethod === "cash" ? "1" : paymentMethod === "gcash" ? "2" : "3", // 1=Cash, 2=GCash, 3=Maya
      paymentReceived: finalPaymentReceived, // Always set for walk-in sales
      change: change ? String(change) : "0", // Set to 0 if no change
      status: paymentStatus,
    });

    // Create transaction record (mark as walk-in)
    const transactionId = uuidv4();
    await db.insert(transactions).values({
      id: transactionId,
      userId: sellerId,
      orderId,
      transactionType: "walk-in",
      remarks: `Walk-in sale completed via ${paymentMethod}`,
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

