import { NextResponse } from "next/server";
import { getServerSession } from "@/server/session";
import { db } from "@/server/drizzle";
import { shop } from "@/server/schema/auth-schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shopList = await db
      .select({
        id: shop.id,
        name: shop.shopName,
      })
      .from(shop)
      .orderBy(asc(shop.shopName));

    return NextResponse.json({ shops: shopList });
  } catch (error) {
    console.error("Error fetching shops:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
