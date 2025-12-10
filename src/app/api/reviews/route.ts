import { NextResponse } from "next/server";
import { db } from '@/server/drizzle';
import { reviews } from '@/server/schema/auth-schema';
import { orderItems } from '@/server/schema/auth-schema';
import { orders } from '@/server/schema/auth-schema';
import { user } from '@/server/schema/auth-schema';
import { eq, inArray, and } from "drizzle-orm";
import { getServerSession } from '@/server/session';
import { v4 as uuidv4 } from 'uuid';

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

    const orderIds = [...new Set(relatedOrderItems.map((o) => o.orderId))];

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
// POST /api/reviews - Create a new review
// ------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, rating, comment } = body;

    if (!orderId || !rating) {
      return NextResponse.json(
        { error: "Missing required fields: orderId and rating" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Verify the order belongs to the user
    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (order.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order[0].buyerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Verify the order contains the product (for product-specific reviews)
    // This ensures the review is linked to a product through the order
    const orderItemsForOrder = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    if (orderItemsForOrder.length === 0) {
      return NextResponse.json({ error: "Order has no items" }, { status: 400 });
    }

    // Check if review already exists for this order and buyer
    const existingReview = await db
      .select()
      .from(reviews)
      .where(and(
        eq(reviews.orderId, orderId),
        eq(reviews.buyerId, session.user.id)
      ))
      .limit(1);

    if (existingReview.length > 0) {
      // Update existing review
      await db
        .update(reviews)
        .set({
          rating,
          comment: comment || null,
          updatedAt: new Date(),
        })
        .where(eq(reviews.id, existingReview[0].id));

      return NextResponse.json({ 
        success: true, 
        message: "Review updated successfully",
        reviewId: existingReview[0].id 
      });
    }

    // Create new review
    const reviewId = uuidv4();
    await db.insert(reviews).values({
      id: reviewId,
      orderId,
      buyerId: session.user.id,
      rating,
      comment: comment || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ 
      success: true, 
      message: "Review submitted successfully",
      reviewId 
    });
  } catch (err) {
    console.error("Error creating review:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
