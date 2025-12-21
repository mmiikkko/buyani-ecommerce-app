import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { sellerNotifications } from "@/server/schema/auth-schema";
import { eq, and, desc } from "drizzle-orm";
import { getServerSession } from "@/server/session";

// GET /api/seller/notifications - Get unread notifications
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const sellerId = session.user.id;

        const notifications = await db
            .select()
            .from(sellerNotifications)
            .where(
                and(
                    eq(sellerNotifications.sellerId, sellerId),
                    eq(sellerNotifications.isRead, false)
                )
            )
            .orderBy(desc(sellerNotifications.createdAt));

        return NextResponse.json({ notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { error: "Failed to fetch notifications" },
            { status: 500 }
        );
    }
}

// PUT /api/seller/notifications - Mark notification as read
export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { notificationId } = await req.json();

        if (!notificationId) {
            return NextResponse.json(
                { error: "Notification ID required" },
                { status: 400 }
            );
        }

        await db
            .update(sellerNotifications)
            .set({
                isRead: true,
                readAt: new Date(),
            })
            .where(eq(sellerNotifications.id, notificationId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return NextResponse.json(
            { error: "Failed to update notification" },
            { status: 500 }
        );
    }
}
