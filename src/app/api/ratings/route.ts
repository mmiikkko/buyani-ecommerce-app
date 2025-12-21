import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { buyaniRatings, user } from "@/server/schema/auth-schema";
import { eq, desc } from "drizzle-orm";
import { getServerSession } from "@/server/session";
import { v4 as uuidv4 } from "uuid";

// POST /api/ratings - Create a new rating
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { rating, review } = body;

        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: "Rating must be between 1 and 5" },
                { status: 400 }
            );
        }

        // Create rating
        const ratingId = uuidv4();
        await db.insert(buyaniRatings).values({
            id: ratingId,
            userId: session.user.id,
            rating,
            review: review || null,
        });

        return NextResponse.json({
            success: true,
            message: "Rating submitted successfully",
        });
    } catch (error) {
        console.error("Error creating rating:", error);
        return NextResponse.json(
            { error: "Failed to submit rating" },
            { status: 500 }
        );
    }
}

// GET /api/ratings - Get all ratings (optional, for admin/display purposes)
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const ratings = await db
            .select({
                id: buyaniRatings.id,
                rating: buyaniRatings.rating,
                review: buyaniRatings.review,
                createdAt: buyaniRatings.createdAt,
                userName: user.name,
                userEmail: user.email,
                userImage: user.image,
            })
            .from(buyaniRatings)
            .leftJoin(user, eq(buyaniRatings.userId, user.id))
            .orderBy(desc(buyaniRatings.createdAt));

        return NextResponse.json(ratings);
    } catch (error) {
        console.error("Error fetching ratings:", error);
        return NextResponse.json(
            { error: "Failed to fetch ratings" },
            { status: 500 }
        );
    }
}
