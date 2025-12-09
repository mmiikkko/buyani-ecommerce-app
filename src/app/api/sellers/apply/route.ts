import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { shop, user, USER_ROLES } from "@/server/schema/auth-schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "@/server/session";
import { v4 as uuidv4 } from "uuid";

// POST /api/sellers/apply - Apply to become a seller (create shop)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { shopName, description, imageURL } = body;

    if (!shopName) {
      return NextResponse.json(
        { error: "Shop name is required" },
        { status: 400 }
      );
    }

    // Check if user already has a shop
    const existingShop = await db
      .select()
      .from(shop)
      .where(eq(shop.sellerId, userId))
      .limit(1);

    if (existingShop.length > 0) {
      return NextResponse.json(
        { error: "You already have a shop registered" },
        { status: 400 }
      );
    }

    // Check if shop name is already taken
    const shopNameExists = await db
      .select()
      .from(shop)
      .where(eq(shop.shopName, shopName))
      .limit(1);

    if (shopNameExists.length > 0) {
      return NextResponse.json(
        { error: "Shop name is already taken" },
        { status: 400 }
      );
    }

    // Create shop with pending status
    const newShop = {
      id: uuidv4(),
      sellerId: userId,
      shopName: shopName,
      description: description || null,
      imageURL: imageURL || null,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(shop).values(newShop);

    // Update user role to pending_seller if not already a seller
    const currentUser = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (currentUser.length > 0 && currentUser[0].role !== USER_ROLES.SELLER) {
      await db
        .update(user)
        .set({ role: USER_ROLES.PENDING_SELLER })
        .where(eq(user.id, userId));
    }

    return NextResponse.json({
      success: true,
      shop: newShop,
      message: "Shop application submitted successfully. Waiting for admin approval.",
    });
  } catch (error) {
    console.error("Error applying for seller:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}

