import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { shop, user } from "@/server/schema/auth-schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "@/server/session";

// GET /api/sellers/shop - Get current seller's shop and user data
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sellerId = session.user.id;

    // Get user data
    const userData = await db
      .select()
      .from(user)
      .where(eq(user.id, sellerId))
      .limit(1);

    if (userData.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get shop data
    const shopData = await db
      .select()
      .from(shop)
      .where(eq(shop.sellerId, sellerId))
      .limit(1);

    return NextResponse.json({
      user: {
        id: userData[0].id,
        name: userData[0].name,
        firstName: userData[0].first_name,
        lastName: userData[0].last_name,
        email: userData[0].email,
        image: userData[0].image,
      },
      shop: shopData.length > 0 ? {
        id: shopData[0].id,
        shopName: shopData[0].shopName,
        description: shopData[0].description,
        imageURL: shopData[0].imageURL,
        status: shopData[0].status,
        shopRating: shopData[0].shopRating,
      } : null,
    });
  } catch (error) {
    console.error("Error fetching seller shop data:", error);
    return NextResponse.json(
      { error: "Failed to fetch shop data" },
      { status: 500 }
    );
  }
}

// PUT /api/sellers/shop - Update shop information
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sellerId = session.user.id;
    const body = await req.json();

    // Verify seller has a shop
    const shopData = await db
      .select()
      .from(shop)
      .where(eq(shop.sellerId, sellerId))
      .limit(1);

    if (shopData.length === 0) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    const updates: any = {};
    if (body.shopName !== undefined) {
      // Check if shop name is already taken by another shop
      const existingShop = await db
        .select()
        .from(shop)
        .where(eq(shop.shopName, body.shopName))
        .limit(1);
      
      if (existingShop.length > 0 && existingShop[0].id !== shopData[0].id) {
        return NextResponse.json(
          { error: "Shop name is already taken" },
          { status: 400 }
        );
      }
      updates.shopName = body.shopName;
    }
    if (body.description !== undefined) updates.description = body.description;
    if (body.imageURL !== undefined) updates.imageURL = body.imageURL;

    await db
      .update(shop)
      .set(updates)
      .where(eq(shop.id, shopData[0].id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating shop:", error);
    return NextResponse.json(
      { error: "Failed to update shop" },
      { status: 500 }
    );
  }
}

