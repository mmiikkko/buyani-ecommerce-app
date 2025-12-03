import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/drizzle';
import { products } from '@/server/schema/auth-schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

// GET /api/products
// Note: This returns ALL products. For seller-specific products, use /api/sellers/products
export async function GET(req: NextRequest) {
  const list = await db.select().from(products);
  return NextResponse.json(list);
}

// POST /api/products
export async function POST(req: NextRequest) {
  const body = await req.json();
  const newProduct = {
    id: uuidv4(),
    productName: body.productName,
    shopId: body.shopId,
    categoryId: body.categoryId,
    price: body.price,
    SKU: body.SKU ?? undefined,
    description: body.description ?? "",
    rating: body.rating ?? "",
    isAvailable: typeof body.isAvailable === "boolean" ? body.isAvailable : true,
    status: body.status ?? "Available",
    createdAt: new Date(),
    updatedAt: new Date(),
    // add other fields as needed
  };
  await db.insert(products).values(newProduct);
  return NextResponse.json({ success: true, product: newProduct });
}

// PUT /api/products?id=xxx
export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("id");
  if (!productId) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const updates = await req.json();
  await db.update(products).set(updates).where(eq(products.id, productId));
  return NextResponse.json({ success: true });
}

// DELETE /api/products?id=xxx
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("id");
  if (!productId) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.delete(products).where(eq(products.id, productId));
  return NextResponse.json({ success: true });
}