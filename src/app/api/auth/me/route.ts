import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/server/session";
import { db } from "@/server/drizzle";
import { shop, user } from "@/server/schema/auth-schema";
import { eq } from "drizzle-orm";

// GET /api/auth/me - Get current user info
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user info
    const userData = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (userData.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentUser = userData[0];

    // Check if user has a shop
    const userShop = await db
      .select()
      .from(shop)
      .where(eq(shop.sellerId, userId))
      .limit(1);

    return NextResponse.json({
      id: currentUser.id,
      name: currentUser.name,
      firstName: currentUser.first_name,
      lastName: currentUser.last_name,
      email: currentUser.email,
      role: currentUser.role,
      emailVerified: currentUser.emailVerified,
      image: currentUser.image,
      hasShop: userShop.length > 0,
      shop: userShop.length > 0 ? {
        id: userShop[0].id,
        shopName: userShop[0].shopName,
        status: userShop[0].status,
      } : null,
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return NextResponse.json(
      { error: "Failed to fetch user info" },
      { status: 500 }
    );
  }
}

