import { notFound } from "next/navigation";
import { ShopDetailClient } from "./shop-detail-client";
import { db } from "@/server/drizzle";
import { shop, user, products } from "@/server/schema/auth-schema";
import { eq, and, sql } from "drizzle-orm";
import type { Shop } from "@/types/shops";

type ShopPageProps = {
  params: Promise<{ shopId: string }>;
};

// Helper function to execute queries with retry logic
async function executeQueryWithRetry<T>(
  queryFn: () => Promise<T>,
  retries = 3
): Promise<T> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await queryFn();
    } catch (error: any) {
      const isConnectionError =
        error?.cause?.code === "ECONNRESET" ||
        error?.cause?.code === "PROTOCOL_CONNECTION_LOST" ||
        error?.cause?.code === "ETIMEDOUT" ||
        error?.cause?.errno === -4077 ||
        error?.message?.includes("ECONNRESET") ||
        error?.message?.includes("Connection lost") ||
        error?.message?.includes("Failed query");

      if (isConnectionError && attempt < retries - 1) {
        // Exponential backoff: 100ms, 200ms, 400ms
        const delay = Math.min(100 * Math.pow(2, attempt), 1000);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Query failed after retries");
}

async function getShopById(shopId: string): Promise<Shop | null> {
  try {
    const shopItem = await executeQueryWithRetry(async () => {
      return await db
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
    });

    if (!shopItem.length) return null;

    const shopData = shopItem[0];

    // Product count with retry
    const productCount = await executeQueryWithRetry(async () => {
      return await db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(and(eq(products.shopId, shopData.id), eq(products.isAvailable, true)));
    });

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
  } catch (error: any) {
    // Only log non-connection errors to avoid spam
    const isConnectionError =
      error?.cause?.code === "ECONNRESET" ||
      error?.cause?.code === "PROTOCOL_CONNECTION_LOST" ||
      error?.cause?.code === "ETIMEDOUT" ||
      error?.message?.includes("ECONNRESET") ||
      error?.message?.includes("Failed query");

    if (!isConnectionError) {
      console.error("Error fetching shop:", error?.message || error);
    }
    return null;
  }
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { shopId } = await params;
  const shop = await getShopById(shopId);

  if (!shop) notFound();

  // TypeScript guard - notFound() throws but TS doesn't know
  if (!shop) {
    return null;
  }

  return (
    <main className="relative min-h-screen">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-200/10 rounded-full blur-3xl"></div>
      </div>
      <div className="relative bg-gradient-to-b from-blue-50/50 via-white to-purple-50/30">
        <ShopDetailClient shop={shop} shopId={shopId} />
      </div>
    </main>
  );
}