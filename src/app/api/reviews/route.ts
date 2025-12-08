import { NextResponse } from "next/server";
import { db } from '@/server/drizzle';
import { reviews } from '@/server/schema/auth-schema';
import { orderItems } from '@/server/schema/auth-schema';
import { orders } from '@/server/schema/auth-schema';
import { user } from '@/server/schema/auth-schema';
import { eq, inArray } from "drizzle-orm";

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
