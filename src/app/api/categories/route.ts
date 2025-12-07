import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { categories, products, shop } from "@/server/schema/auth-schema";
import { eq, and, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { corsResponse, corsOptions } from '@/lib/api-utils';

// OPTIONS /api/categories - Handle CORS preflight
export async function OPTIONS() {
  return corsOptions();
}

// GET /api/categories
// Optional query param: ?withCounts=true to include product counts
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const withCounts = searchParams.get("withCounts") === "true";

    const allCategories = await db.select().from(categories);

    if (withCounts) {
      // Get product counts for each category
      const categoriesWithCounts = await Promise.all(
        allCategories.map(async (category) => {
          const productCount = await db
            .select({ count: sql<number>`count(*)` })
            .from(products)
            .leftJoin(shop, eq(products.shopId, shop.id))
            .where(and(
              eq(products.categoryId, category.id),
              eq(products.isAvailable, true),
              eq(shop.status, "approved")
            ));

          return {
            ...category,
            productCount: Number(productCount[0]?.count || 0),
          };
        })
      );

      return corsResponse(categoriesWithCounts);
    }

    return corsResponse(allCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return corsResponse(
      { error: "Failed to fetch categories" },
      500
    );
  }
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
