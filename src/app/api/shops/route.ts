import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/drizzle';
import { shop, user, products, USER_ROLES } from '@/server/schema/auth-schema';
import { eq, and, sql } from 'drizzle-orm';
import { getServerSession } from '@/server/session';
import { v4 as uuidv4 } from 'uuid'; // For unique IDs

// GET /api/shops - get all shops (with optional status filter) or single shop by id
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get("id");
    const statusFilter = searchParams.get("status"); // "approved", "pending", or null for all

    // If shopId is provided, return single shop
    if (shopId) {
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

      if (!shopItem.length) {
        return NextResponse.json(
          { error: "Shop not found" },
          { status: 404 }
        );
      }

      const shopData = shopItem[0];
      
      // Get product count
      const productCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(and(
          eq(products.shopId, shopData.id),
          eq(products.isAvailable, true)
        ));

      return NextResponse.json({
        id: shopData.id,
        seller_id: shopData.sellerId,
        shop_name: shopData.shopName,
        shop_rating: shopData.shopRating,
        description: shopData.description,
        image: shopData.imageURL,
        status: shopData.status,
        created_at: shopData.createdAt,
        updated_at: shopData.updatedAt,
        owner_name: shopData.ownerName || 
          `${shopData.ownerFirstName || ""} ${shopData.ownerLastName || ""}`.trim() ||
          "Unknown",
        products: Number(productCount[0]?.count || 0),
      });
    }

    // Build query with optional status filter
    let shopsList;
    if (statusFilter && statusFilter !== "all") {
      shopsList = await db
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
        .where(eq(shop.status, statusFilter));
    } else {
      // Return all shops (for status=all or no filter, but default to approved for backward compatibility)
      if (statusFilter === "all") {
        shopsList = await db
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
          .leftJoin(user, eq(shop.sellerId, user.id));
      } else {
        // Default: return approved shops only (for backward compatibility)
        shopsList = await db
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
          .where(eq(shop.status, "approved"));
      }
    }

    // Get product counts for each shop
    const shopsWithCounts = await Promise.all(
      shopsList.map(async (shopItem) => {
        const productCount = await db
          .select({ count: sql<number>`count(*)` })
          .from(products)
          .where(and(
            eq(products.shopId, shopItem.id),
            eq(products.isAvailable, true)
          ));

        return {
          id: shopItem.id,
          seller_id: shopItem.sellerId,
          shop_name: shopItem.shopName,
          shop_rating: shopItem.shopRating,
          description: shopItem.description,
          image: shopItem.imageURL,
          status: shopItem.status,
          created_at: shopItem.createdAt,
          updated_at: shopItem.updatedAt,
          owner_name: shopItem.ownerName || 
            `${shopItem.ownerFirstName || ""} ${shopItem.ownerLastName || ""}`.trim() ||
            "Unknown",
          products: Number(productCount[0]?.count || 0),
        };
      })
    );

    return NextResponse.json(shopsWithCounts);
  } catch (error) {
    console.error("Error fetching shops:", error);
    return NextResponse.json(
      { error: "Failed to fetch shops" },
      { status: 500 }
    );
  }
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
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get('id');
    if (!shopId) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    // Check if user is admin (can modify any shop) or shop owner
    const isAdmin = session.user.role?.includes(USER_ROLES.ADMIN) ?? false;
    
    if (!isAdmin) {
      // Verify shop belongs to the seller (non-admins only)
      const shopData = await db
        .select()
        .from(shop)
        .where(and(eq(shop.id, shopId), eq(shop.sellerId, session.user.id)))
        .limit(1);

      if (shopData.length === 0) {
        return NextResponse.json({ error: "Shop not found or unauthorized" }, { status: 404 });
      }
    } else {
      // Admin: just verify shop exists
      const shopExists = await db
        .select({ id: shop.id })
        .from(shop)
        .where(eq(shop.id, shopId))
        .limit(1);

      if (shopExists.length === 0) {
        return NextResponse.json({ error: "Shop not found" }, { status: 404 });
      }
    }

    const updates = await req.json();
    await db.update(shop).set({ ...updates, updatedAt: new Date() }).where(eq(shop.id, shopId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating shop:", error);
    return NextResponse.json(
      { error: "Failed to update shop" },
      { status: 500 }
    );
  }
}

// DELETE /api/shops?id=xxx - delete a shop
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get('id');
    if (!shopId) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    // Check if user is admin (can delete any shop) or shop owner
    const isAdmin = session.user.role?.includes(USER_ROLES.ADMIN) ?? false;

    if (!isAdmin) {
      // Verify shop belongs to the seller (non-admins only)
      const shopData = await db
        .select()
        .from(shop)
        .where(and(eq(shop.id, shopId), eq(shop.sellerId, session.user.id)))
        .limit(1);

      if (shopData.length === 0) {
        return NextResponse.json({ error: "Shop not found or unauthorized" }, { status: 404 });
      }
    } else {
      // Admin: just verify shop exists
      const shopExists = await db
        .select({ id: shop.id })
        .from(shop)
        .where(eq(shop.id, shopId))
        .limit(1);

      if (shopExists.length === 0) {
        return NextResponse.json({ error: "Shop not found" }, { status: 404 });
      }
    }

    await db.delete(shop).where(eq(shop.id, shopId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting shop:", error);
    return NextResponse.json(
      { error: "Failed to delete shop" },
      { status: 500 }
    );
  }
}
