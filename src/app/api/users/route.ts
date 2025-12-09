import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/drizzle';
import { user, session, orders, transactions } from '@/server/schema/auth-schema';
import { eq, gt, sql } from 'drizzle-orm';


// GET /api/users
export async function GET(req: NextRequest) {
  const list = await db.select().from(user);
  
  // Get last active time from multiple sources:
  // 1. Most recent order created/updated
  // 2. Most recent transaction created
  // 3. Session updatedAt (if available)
  // 4. User updatedAt as fallback
  
  const lastActiveMap = new Map<string, Date>();
  
  // Get most recent order per user
  const recentOrders = await db
    .select({
      userId: orders.buyerId,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
    })
    .from(orders);
  
  recentOrders.forEach(o => {
    const existing = lastActiveMap.get(o.userId);
    const createdAt = o.createdAt instanceof Date ? o.createdAt : new Date(o.createdAt);
    const updatedAt = o.updatedAt ? (o.updatedAt instanceof Date ? o.updatedAt : new Date(o.updatedAt)) : null;
    const activityDate = updatedAt && updatedAt > createdAt ? updatedAt : createdAt;
    if (!existing || activityDate > existing) {
      lastActiveMap.set(o.userId, activityDate);
    }
  });
  
  // Get most recent transaction per user
  const recentTransactions = await db
    .select({
      userId: transactions.userId,
      createdAt: transactions.createdAt,
      updatedAt: transactions.updatedAt,
    })
    .from(transactions);
  
  recentTransactions.forEach(t => {
    if (!t.createdAt) return;
    const existing = lastActiveMap.get(t.userId);
    const createdAt = t.createdAt instanceof Date ? t.createdAt : new Date(t.createdAt);
    const updatedAt = t.updatedAt ? (t.updatedAt instanceof Date ? t.updatedAt : new Date(t.updatedAt)) : null;
    const activityDate = updatedAt && updatedAt > createdAt ? updatedAt : createdAt;
    if (!existing || activityDate > existing) {
      lastActiveMap.set(t.userId, activityDate);
    }
  });
  
  // Get session updatedAt as additional source
  const userSessions = await db
    .select({
      userId: session.userId,
      updatedAt: session.updatedAt,
    })
    .from(session);
  
  userSessions.forEach(s => {
    if (s.updatedAt) {
      const existing = lastActiveMap.get(s.userId);
      const activityDate = s.updatedAt instanceof Date ? s.updatedAt : new Date(s.updatedAt);
      if (!existing || activityDate > existing) {
        lastActiveMap.set(s.userId, activityDate);
      }
    }
  });
  
  // Add last active timestamp to each user (use user.updatedAt as final fallback)
  const usersWithLastActive = list.map(u => {
    const lastActive = lastActiveMap.get(u.id) || (u.updatedAt instanceof Date ? u.updatedAt : u.updatedAt ? new Date(u.updatedAt) : null);
    return {
      ...u,
      lastActive: lastActive ? lastActive.toISOString() : null,
    };
  });
  
  return NextResponse.json(usersWithLastActive);
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