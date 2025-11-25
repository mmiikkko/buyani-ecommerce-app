import { NextRequest, NextResponse } from "next/server";
import { getProducts, addProducts } from "@/lib/queries/products";

export async function GET(req: NextRequest) {
  const sellerId = req.nextUrl.searchParams.get("sellerId");
  if (!sellerId) return NextResponse.json({ error: "Missing sellerId" }, { status: 400 });

  const products = await getProducts(sellerId);
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const inserted = await addProducts(data);
  return NextResponse.json(inserted);
}
