import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { shop, shopReviews, user, orders, orderItems, productVariation, products } from "@/server/schema/auth-schema";
import { eq, avg, sql, and } from "drizzle-orm";
import { getServerSession } from "@/server/session";
import { v4 as uuidv4 } from "uuid";

// GET /api/shops/[shopId]/reviews - Get all reviews for a shop
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ shopId: string }> }
) {
    try {
        const { shopId } = await params;

        const reviews = await db
            .select({
                id: shopReviews.id,
                rating: shopReviews.rating,
                comment: shopReviews.comment,
                createdAt: shopReviews.createdAt,
                buyerName: user.name,
            })
            .from(shopReviews)
            .leftJoin(user, eq(shopReviews.buyerId, user.id))
            .where(eq(shopReviews.shopId, shopId))
            .orderBy(sql`${shopReviews.createdAt} DESC`);

        return NextResponse.json(reviews);
    } catch (error) {
        console.error("Error fetching shop reviews:", error);
        return NextResponse.json(
            { error: "Failed to fetch shop reviews" },
            { status: 500 }
        );
    }
}

// POST /api/shops/[shopId]/reviews - Submit a shop review
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ shopId: string }> }
) {
    try {
        const { shopId } = await params;
        const session = await getServerSession();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { rating, comment, orderId } = await req.json();

        // Check if user has purchased from this shop
        const purchaseHistory = await db
            .select({ id: orders.id })
            .from(orders)
            .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
            .innerJoin(productVariation, eq(orderItems.product_variation_id, productVariation.id))
            .innerJoin(products, eq(productVariation.productId, products.id))
            .where(
                and(
                    eq(orders.buyerId, session.user.id),
                    eq(products.shopId, shopId)
                )
            )
            .limit(1);

        if (purchaseHistory.length === 0) {
            return NextResponse.json(
                { error: "Only buyers of this shop's products can leave a review." },
                { status: 403 }
            );
        }

        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: "Rating must be between 1 and 5" },
                { status: 400 }
            );
        }

        const reviewId = uuidv4();
        await db.insert(shopReviews).values({
            id: reviewId,
            shopId,
            buyerId: session.user.id,
            orderId: orderId || null,
            rating,
            comment: comment || null,
        });

        // Update the average rating in the shop table
        const result = await db
            .select({ averageRating: avg(shopReviews.rating) })
            .from(shopReviews)
            .where(eq(shopReviews.shopId, shopId));

        const averageRating = result[0]?.averageRating || "0";

        await db
            .update(shop)
            .set({
                shopRating: String(Number(averageRating).toFixed(1)),
                updatedAt: new Date(),
            })
            .where(eq(shop.id, shopId));

        return NextResponse.json({
            success: true,
            message: "Shop review submitted successfully",
            averageRating: Number(averageRating).toFixed(1),
        });
    } catch (error) {
        console.error("Error submitting shop review:", error);
        return NextResponse.json(
            { error: "Failed to submit shop review" },
            { status: 500 }
        );
    }
}
