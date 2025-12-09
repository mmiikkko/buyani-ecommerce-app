// src/app/api/sellers/pending/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { user, USER_ROLES } from "@/server/schema/auth-schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  // Update the user's role to "pending_seller"
  await db.update(user)
    .set({ role: USER_ROLES.PENDING_SELLER })
    .where(eq(user.id, userId));

  return NextResponse.json({ success: true });
}