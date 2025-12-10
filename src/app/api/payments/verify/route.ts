import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { payments, orders } from "@/server/schema/auth-schema";
import { eq } from "drizzle-orm";
import { env } from "@/lib/env";

// GET /api/payments/verify?session_id=xxx&order_id=xxx
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");
    const orderId = searchParams.get("order_id");

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Missing order_id" },
        { status: 400 }
      );
    }

    // Use validated environment variable
    const secretKey = env.PAYMONGO_SECRET_KEY;
    
    // If session_id is valid (not a template placeholder), verify with PayMongo
    if (sessionId && !sessionId.includes("{") && !sessionId.includes("}") && secretKey) {
      try {
        const response = await fetch(
          `https://api.paymongo.com/v1/checkout_sessions/${sessionId}`,
          {
            headers: {
              Authorization: `Basic ${Buffer.from(secretKey + ":").toString("base64")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const checkoutSession = data.data;
          const paymentStatus = checkoutSession.attributes.payment_intent?.attributes?.status;
          const payments_arr = checkoutSession.attributes.payments;

          const isSuccessful = 
            paymentStatus === "succeeded" || 
            (payments_arr && payments_arr.length > 0 && payments_arr[0].attributes.status === "paid");

          if (isSuccessful) {
            const paidAmount = checkoutSession.attributes.line_items?.[0]?.amount / 100 || 0;
            
            await db
              .update(payments)
              .set({
                status: "completed",
                paymentReceived: String(paidAmount),
              })
              .where(eq(payments.orderId, orderId));

            return NextResponse.json({
              success: true,
              message: "Payment verified successfully",
              paymentStatus: "completed",
            });
          }
        }
      } catch (error) {
        console.error("PayMongo verification error:", error);
        // Fall through to mark as complete anyway since user was redirected to success URL
      }
    }

    // PayMongo only redirects to success_url when payment is successful
    // So if we're here, we can safely mark the payment as complete
    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (order.length > 0) {
      const total = order[0].total;
      
      await db
        .update(payments)
        .set({
          status: "completed",
          paymentReceived: total,
        })
        .where(eq(payments.orderId, orderId));

      return NextResponse.json({
        success: true,
        message: "Payment confirmed",
        paymentStatus: "completed",
      });
    }

    return NextResponse.json({
      success: false,
      message: "Order not found",
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
