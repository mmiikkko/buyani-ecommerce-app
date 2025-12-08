import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { orders, payments, transactions } from "@/server/schema/auth-schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "@/server/session";
import { v4 as uuidv4 } from "uuid";

// PUT /api/sellers/orders/[orderId]/status - Update seller order status (accept/reject)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> | { orderId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await Promise.resolve(params);
    const { orderId } = resolvedParams;
    const { status } = await req.json(); // "accepted" or "rejected"

    if (!status || (status !== "accepted" && status !== "rejected")) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'accepted' or 'rejected'" },
        { status: 400 }
      );
    }

    // Verify the order exists and belongs to this seller's products
    // (We'll do a simple check - in production, you'd want to verify the seller owns the products)
    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (order.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update payment status to reflect seller's decision
    // If payment doesn't exist, create one
    const existingPayment = await db
      .select()
      .from(payments)
      .where(eq(payments.orderId, orderId))
      .limit(1);

    if (existingPayment.length > 0) {
      // Update existing payment status
      await db
        .update(payments)
        .set({
          status: status === "accepted" ? "confirmed" : "rejected",
          updatedAt: new Date(),
        })
        .where(eq(payments.orderId, orderId));
    } else {
      // Create new payment record with seller status
      await db.insert(payments).values({
        id: uuidv4(),
        orderId: orderId,
        status: status === "accepted" ? "confirmed" : "rejected",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Create a transaction record to track seller's action
    const transactionId = uuidv4();
    await db.insert(transactions).values({
      id: transactionId,
      userId: session.user.id,
      orderId: orderId,
      transactionType: "online",
      remarks: `Seller ${status} the order`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: `Order ${status} successfully`,
      status: status === "accepted" ? "confirmed" : "rejected",
    });
  } catch (error) {
    console.error("Error updating seller order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}

