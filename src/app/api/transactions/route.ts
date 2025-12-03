import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { transactions } from "@/server/schema/auth-schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// GET /api/transactions
export async function GET(req: NextRequest) {
  const allTransactions = await db.select().from(transactions);
  return NextResponse.json(allTransactions);
}

// PUT /api/transactions?id=xxx
export async function PUT(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const transactionId = searchParams.get("id");
  if (!transactionId) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const updates = await req.json();
  await db.update(transactions).set(updates).where(eq(transactions.id, transactionId));
  return NextResponse.json({ success: true });
}

// DELETE /api/transactions?id=xxx
export async function DELETE(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const transactionId = searchParams.get("id");
  if (!transactionId) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.delete(transactions).where(eq(transactions.id, transactionId));
  return NextResponse.json({ success: true });
}
