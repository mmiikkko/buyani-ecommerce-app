import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/drizzle';
import { orders } from '@/server/schema/auth-schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

// GET /api/orders
// Note: This returns ALL orders. For seller-specific orders, use /api/sellers/orders
export async function GET(req: NextRequest) {
  const allOrders = await db.select().from(orders);
  return NextResponse.json(allOrders);
}

// POST /api/orders
export async function POST(req: NextRequest) {
  const body = await req.json();
  const newOrder = {
    id: uuidv4(),
    buyerId: body.buyerId,
    addressId: body.addressId,
    total: body.total,
    createdAt: new Date(),
    updatedAt: new Date(),
    // add more fields if needed
  };
  await db.insert(orders).values(newOrder);
  return NextResponse.json({ success: true, order: newOrder });
}

// PUT /api/orders?id=xxx
export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("id");
  if (!orderId) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const updates = await req.json();
  await db.update(orders).set(updates).where(eq(orders.id, orderId));
  return NextResponse.json({ success: true });
}

// DELETE /api/orders?id=xxx
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("id");
  if (!orderId) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.delete(orders).where(eq(orders.id, orderId));
  return NextResponse.json({ success: true });
}
