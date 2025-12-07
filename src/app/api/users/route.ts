import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/drizzle';
import { user } from '@/server/schema/auth-schema';
import { eq } from 'drizzle-orm';


// GET /api/users
export async function GET(req: NextRequest) {
  const list = await db.select().from(user);
  return NextResponse.json(list);
}

// PUT /api/users?id=xxx
export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("id");
  if (!userId) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const updates = await req.json();
  await db.update(user).set(updates).where(eq(user.id, userId));
  return NextResponse.json({ success: true });
}

// DELETE /api/users?id=xxx
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("id");
  if (!userId) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.delete(user).where(eq(user.id, userId));
  return NextResponse.json({ success: true });
}