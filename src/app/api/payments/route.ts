import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { payments } from "@/server/schema/auth-schema";
import { eq } from "drizzle-orm";

// GET /api/payments?orderId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  
  if (orderId) {
    const payment = await db
      .select()
      .from(payments)
      .where(eq(payments.orderId, orderId))
      .limit(1);
    return NextResponse.json(payment[0] || null);
  }
  
  const allPayments = await db.select().from(payments);
  return NextResponse.json(allPayments);
}

// PUT /api/payments?orderId=xxx
export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  
  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }
  
  const updates = await req.json();
  
  await db
    .update(payments)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(payments.orderId, orderId));
  
  return NextResponse.json({ success: true });
}

