import { notFound } from "next/navigation";
import { ShopDetailClient } from "./shop-detail-client";
import { db } from "@/server/drizzle";
import { shop, user, products } from "@/server/schema/auth-schema";
import { eq, and, sql } from "drizzle-orm";
import type { Shop } from "@/types/shops";

type ShopPageProps = {
  params: Promise<{ shopId: string }>;
};

async function getShopById(shopId: string): Promise<Shop | null> {
  try {
    const shopItem = await db
      .select({
        id: shop.id,
        sellerId: shop.sellerId,
        shopName: shop.shopName,
        shopRating: shop.shopRating,
        description: shop.description,
        imageURL: shop.imageURL,
        status: shop.status,
        createdAt: shop.createdAt,
        updatedAt: shop.updatedAt,
        ownerName: user.name,
        ownerFirstName: user.first_name,
        ownerLastName: user.last_name,
      })
      .from(shop)
      .leftJoin(user, eq(shop.sellerId, user.id))
      .where(eq(shop.id, shopId))
      .limit(1);

    if (!shopItem.length) return null;

    const shopData = shopItem[0];

    // Product count
    const productCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(and(eq(products.shopId, shopData.id), eq(products.isAvailable, true)));

    return {
      id: shopData.id,
      seller_id: shopData.sellerId,
      shop_name: shopData.shopName,
      shop_rating: shopData.shopRating,
      description: shopData.description,
      image: shopData.imageURL,
      status: shopData.status,
      created_at: shopData.createdAt,
      updated_at: shopData.updatedAt,
      owner_name:
        shopData.ownerName ||
        `${shopData.ownerFirstName || ""} ${shopData.ownerLastName || ""}`.trim() ||
        "Unknown",
      products: Number(productCount[0]?.count || 0),
    };
  } catch (error) {
    console.error("Error fetching shop:", error);
    return null;
  }
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { shopId } = await params;
  const shop = await getShopById(shopId);

  if (!shop) notFound();

  return (
    <main className="relative min-h-screen bg-slate-50">
      <ShopDetailClient shop={shop} shopId={shopId} />
    </main>
  );
}
