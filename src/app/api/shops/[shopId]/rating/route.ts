import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import {
  orders,
  orderItems,
  products,
  reviews,
} from "@/server/schema/auth-schema";
import { and, eq, desc } from "drizzle-orm";
import { getServerSession } from "@/server/session";
import crypto from "crypto";

type RatingResponse = {
  average: number;
  count: number;
  canRate: boolean;
  existingRating?: number | null;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shopId: string }> }
) {
  try {
    const { shopId } = await params;
    const session = await getServerSession();
    const userId = session?.user?.id;

    // Fetch all ratings for orders that include products from this shop
    const rows = await db
      .select({
        orderId: orders.id,
        rating: reviews.rating,
        buyerId: reviews.buyerId,
        createdAt: orders.createdAt,
      })
      .from(reviews)
      .leftJoin(orders, eq(reviews.orderId, orders.id))
      .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(products.shopId, shopId));

    // Deduplicate per (orderId, buyerId) to avoid double-counting when an order has many items
    const unique: Record<string, number> = {};
    rows.forEach((row) => {
      if (!row.orderId || row.rating == null) return;
      const key = `${row.orderId}-${row.buyerId}`;
      unique[key] = row.rating;
    });

    const values = Object.values(unique);
    const count = values.length;
    const average =
      count === 0
        ? 0
        : values.reduce((sum, val) => sum + Number(val || 0), 0) / count;

    let canRate = false;
    let existingRating: number | null = null;

    if (userId) {
      // Determine if the current user has an order containing this shop's products
      const userOrders = await db
        .select({
          orderId: orders.id,
          createdAt: orders.createdAt,
        })
        .from(orders)
        .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
        .leftJoin(products, eq(orderItems.productId, products.id))
        .where(and(eq(orders.buyerId, userId), eq(products.shopId, shopId)))
        .orderBy(desc(orders.createdAt));

      canRate = userOrders.length > 0;

      if (canRate) {
        const latestOrderId = userOrders[0].orderId;
        const existing = await db
          .select({ rating: reviews.rating })
          .from(reviews)
          .where(and(eq(reviews.orderId, latestOrderId), eq(reviews.buyerId, userId)))
          .limit(1);
        existingRating = existing[0]?.rating ?? null;
      }
    }

    const payload: RatingResponse = { average, count, canRate, existingRating };
    return NextResponse.json(payload);
  } catch (error) {
    console.error("Error fetching shop rating", error);
    return NextResponse.json(
      { error: "Failed to load shop rating" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ shopId: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { shopId } = await params;
    const body = await req.json().catch(() => ({}));
    const rating = Number(body?.rating ?? 0);

    if (Number.isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Find the most recent order for this buyer that contains a product from the shop
    const eligibleOrders = await db
      .select({
        orderId: orders.id,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(
        and(eq(orders.buyerId, session.user.id), eq(products.shopId, shopId))
      )
      .orderBy(desc(orders.createdAt));

    if (!eligibleOrders.length) {
      return NextResponse.json(
        { error: "Only customers who purchased from this shop can rate it." },
        { status: 403 }
      );
    }

    const targetOrderId = eligibleOrders[0].orderId;

    // Upsert review for this order + buyer
    const existing = await db
      .select()
      .from(reviews)
      .where(
        and(eq(reviews.orderId, targetOrderId), eq(reviews.buyerId, session.user.id))
      )
      .limit(1);

    if (existing.length) {
      await db
        .update(reviews)
        .set({ rating, updatedAt: new Date() })
        .where(
          and(
            eq(reviews.orderId, targetOrderId),
            eq(reviews.buyerId, session.user.id)
          )
        );
    } else {
      await db.insert(reviews).values({
        id: crypto.randomUUID(),
        orderId: targetOrderId,
        buyerId: session.user.id,
        rating,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving shop rating", error);
    return NextResponse.json(
      { error: "Failed to submit rating" },
      { status: 500 }
    );
  }
}

