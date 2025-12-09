import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { shop, user } from "@/server/schema/auth-schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "@/server/session";
import { v4 as uuidv4 } from "uuid";

// POST /api/sellers/apply - Apply to become a seller (create shop)
export async function POST(req: NextRequest) {
  try {
    const SUSPENSION_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
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

    // Check if user already has a shop (any status)
    const existingShop = await db
      .select()
      .from(shop)
      .where(eq(shop.sellerId, userId))
      .limit(1);

    if (existingShop.length > 0) {
      const current = existingShop[0];

      // Already approved seller
      if (current.status === "approved") {
        return NextResponse.json(
          { error: "You already have an approved shop." },
          { status: 400 }
        );
      }

      // Already pending
      if (current.status === "pending") {
        return NextResponse.json(
          { error: "Your seller application is already pending." },
          { status: 400 }
        );
      }

      // Suspended: enforce cooldown before re-applying
      if (current.status === "suspended") {
        const lastUpdated =
          (current.updatedAt instanceof Date
            ? current.updatedAt
            : current.updated_at) || new Date(0);
        const retryAt = new Date(
          new Date(lastUpdated).getTime() + SUSPENSION_COOLDOWN_MS
        );
        const now = new Date();

        if (retryAt.getTime() > now.getTime()) {
          const remainingMs = retryAt.getTime() - now.getTime();
          const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
          return NextResponse.json(
            {
              error:
                "Your shop was suspended. Please wait before re-applying to become a seller.",
              retryAt: retryAt.toISOString(),
              remainingDays,
            },
            { status: 403 }
          );
        }

        // Cooldown passed: recycle existing shop record as pending with new details
        await db
          .update(shop)
          .set({
            shopName,
            description: description || null,
            imageURL: imageURL || null,
            status: "pending",
            updatedAt: new Date(),
          })
          .where(eq(shop.id, current.id));
      }
    } else {
      // No existing shop: create new pending shop
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

    // Update user role to pending_seller if not already a seller
    const currentUser = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (currentUser.length > 0 && currentUser[0].role !== "seller") {
      await db
        .update(user)
        .set({ role: "pending_seller" })
        .where(eq(user.id, userId));
    }

    return NextResponse.json({
      success: true,
      message:
        "Shop application submitted successfully. Waiting for admin approval.",
    });
  } catch (error) {
    console.error("Error applying for seller:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}

