import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { categories } from "@/server/schema/auth-schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// GET /api/categories
export async function GET(req: NextRequest) {
  const allCategories = await db.select().from(categories);
  return NextResponse.json(allCategories);
}

// POST /api/categories
export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.categoryName) {
    return NextResponse.json({ error: "Missing categoryName" }, { status: 400 });
  }
  const newCategory = {
    id: uuidv4(),
    categoryName: body.categoryName,
  };
  await db.insert(categories).values(newCategory);
  return NextResponse.json(newCategory);
}

// PUT /api/categories?id=xxx
export async function PUT(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const categoryId = searchParams.get("id");
  if (!categoryId) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const updates = await req.json();
  await db.update(categories).set(updates).where(eq(categories.id, categoryId));
  return NextResponse.json({ success: true });
}

// DELETE /api/categories?id=xxx
export async function DELETE(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const categoryId = searchParams.get("id");
  if (!categoryId) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.delete(categories).where(eq(categories.id, categoryId));
  return NextResponse.json({ success: true });
}
