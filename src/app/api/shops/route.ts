import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/drizzle';
import { shop } from '@/server/schema/auth-schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid'; // For unique IDs

// GET /api/shops - get all shops
export async function GET(req: NextRequest) {
  const shops = await db.select().from(shop);
  return NextResponse.json(shops);
}

// POST /api/shops - create a new shop
export async function POST(req: NextRequest) {
  const body = await req.json();
  const newShop = {
    id: uuidv4(),
    shopName: body.shop_name,
    sellerId: body.seller_id,
    imageURL: body.imageURL,
    description: body.description ?? '',
    shopRating: body.shopRating ?? '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  // Add other fields from your schema as needed

  await db.insert(shop).values(newShop);
  return NextResponse.json({ success: true, shop: newShop });
}

// PUT /api/shops?id=xxx - update a shop
export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const shopId = searchParams.get('id');
  if (!shopId) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const updates = await req.json();
  await db.update(shop).set(updates).where(eq(shop.id, shopId));
  return NextResponse.json({ success: true });
}

// DELETE /api/shops?id=xxx - delete a shop
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const shopId = searchParams.get('id');
  if (!shopId) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await db.delete(shop).where(eq(shop.id, shopId));
  return NextResponse.json({ success: true });
}
