import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/server/session";

// POST /api/payments/gcash - Create PayMongo GCash checkout session
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, amount, description } = body;

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: "Missing orderId or amount" },
        { status: 400 }
      );
    }

    const secretKey = process.env.PAYMONGO_SECRET_KEY;
    if (!secretKey) {
      console.error("PAYMONGO_SECRET_KEY not configured");
      return NextResponse.json(
        { error: "Payment service not configured" },
        { status: 500 }
      );
    }

    // Get the base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.headers.get("origin") || "http://localhost:3000";

    // Create PayMongo Checkout Session
    const response = await fetch("https://api.paymongo.com/v1/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(secretKey + ":").toString("base64")}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            description: description || `Order #${orderId}`,
            line_items: [
              {
                currency: "PHP",
                amount: Math.round(amount * 100), // PayMongo expects amount in cents
                name: `Order #${orderId}`,
                quantity: 1,
              },
            ],
            payment_method_types: ["gcash"],
            success_url: `${baseUrl}/checkout/success?order_id=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/checkout/cancel?order_id=${orderId}`,
            reference_number: orderId,
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("PayMongo error:", data);
      return NextResponse.json(
        { error: data.errors?.[0]?.detail || "Failed to create checkout session" },
        { status: response.status }
      );
    }

    // Return the checkout URL for redirect
    return NextResponse.json({
      checkoutUrl: data.data.attributes.checkout_url,
      checkoutSessionId: data.data.id,
    });
  } catch (error) {
    console.error("Error creating GCash checkout:", error);
    return NextResponse.json(
      { error: "Failed to create payment session" },
      { status: 500 }
    );
  }
}
