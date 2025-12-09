import { NextResponse } from "next/server";
import { db } from '@/server/drizzle';
import { reviews } from '@/server/schema/auth-schema';
import { orderItems } from '@/server/schema/auth-schema';
import { orders } from '@/server/schema/auth-schema';
import { user } from '@/server/schema/auth-schema';
import { eq, inArray, and } from "drizzle-orm";
import { getServerSession } from "@/server/session";
import { v4 as uuidv4 } from "uuid";

// ------------------------------------------------------------
// GET /api/reviews?productId=xxxx
// ------------------------------------------------------------
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Missing productId" },
        { status: 400 }
      );
    }

    // 1. Get all orders that contain this product
    const relatedOrderItems = await db
      .select({
        orderId: orderItems.orderId,
      })
      .from(orderItems)
      .where(eq(orderItems.productId, productId));

    const orderIds = relatedOrderItems.map((o) => o.orderId);

    if (orderIds.length === 0) {
      return NextResponse.json([]);
    }

    // 2. Fetch reviews where orderId is in that order list
    const reviewData = await db
      .select({
        reviewId: reviews.id,
        orderId: reviews.orderId,
        buyerId: reviews.buyerId,
        comment: reviews.comment,
        rating: reviews.rating,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
        buyerName: user.name,
        buyerEmail: user.email,
      })
      .from(reviews)
      .leftJoin(orders, eq(reviews.orderId, orders.id))
      .leftJoin(user, eq(reviews.buyerId, user.id))
      .where(inArray(reviews.orderId, orderIds));

    return NextResponse.json(reviewData);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ------------------------------------------------------------
// POST /api/reviews
// Body: { productId, comment, rating }
// Only buyers who ordered the product may leave one review per order.
// If a review for that order already exists, it gets updated.
// ------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, comment, rating } = body || {};

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    // Find the most recent order of this buyer that contains the product
    const relatedOrders = await db
      .select({
        orderId: orderItems.orderId,
        createdAt: orders.createdAt,
      })
      .from(orderItems)
      .leftJoin(orders, eq(orderItems.orderId, orders.id))
      .where(
        and(
          eq(orderItems.productId, productId),
          eq(orders.buyerId, session.user.id)
        )
      )
      .orderBy(orders.createdAt);

    if (!relatedOrders.length) {
      return NextResponse.json(
        { error: "You can only review products you purchased." },
        { status: 403 }
      );
    }

    // Use the latest order containing this product
    const targetOrderId = relatedOrders[relatedOrders.length - 1].orderId;

    // Check for existing review for this order + buyer
    const existing = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.orderId, targetOrderId),
          eq(reviews.buyerId, session.user.id)
        )
      )
      .limit(1);

    const reviewPayload = {
      orderId: targetOrderId,
      buyerId: session.user.id,
      comment: comment ?? null,
      rating: rating ?? null,
    };

    if (existing.length) {
      await db
        .update(reviews)
        .set({
          ...reviewPayload,
          updatedAt: new Date(),
        })
        .where(eq(reviews.id, existing[0].id));

      return NextResponse.json({
        success: true,
        review: {
          reviewId: existing[0].id,
          ...reviewPayload,
          createdAt: existing[0].createdAt,
          updatedAt: new Date(),
        },
      });
    }

    const reviewId = uuidv4();
    await db.insert(reviews).values({
      id: reviewId,
      ...reviewPayload,
    });

    return NextResponse.json({
      success: true,
      review: {
        reviewId,
        ...reviewPayload,
        createdAt: new Date(),
      },
    });
  } catch (err) {
    console.error("Error creating review:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
