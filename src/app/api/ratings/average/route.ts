import { NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { buyaniRatings } from "@/server/schema/auth-schema";
import { sql } from "drizzle-orm";

// GET /api/ratings/average - Get average rating
export async function GET() {
    try {
        const result = await db
            .select({
                average: sql<number>`AVG(${buyaniRatings.rating})`,
                count: sql<number>`COUNT(*)`,
            })
            .from(buyaniRatings);

        const average = result[0]?.average || 0;
        const count = result[0]?.count || 0;

        return NextResponse.json({
            average: Number(average),
            count: Number(count),
        });
    } catch (error) {
        console.error("Error fetching average rating:", error);
        return NextResponse.json(
            { average: 0, count: 0 },
            { status: 200 } // Return 200 with default values instead of error
        );
    }
}
