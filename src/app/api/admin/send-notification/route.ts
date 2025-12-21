import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { sellerNotifications, tenantBilling, user, shop } from "@/server/schema/auth-schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "@/server/session";
import { v4 as uuidv4 } from "uuid";

// POST /api/admin/send-notification - Send payment reminder to seller
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user is admin
        if (!session.user.role?.includes("admin")) {
            return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
        }

        const adminId = session.user.id;
        const body = await req.json();
        const { sellerId, billingId, message } = body;

        if (!sellerId || !message) {
            return NextResponse.json(
                { error: "Seller ID and message are required" },
                { status: 400 }
            );
        }

        // Get billing details if billingId provided
        let title = "Payment Reminder";
        let formattedMessage = message;

        if (billingId) {
            const billing = await db
                .select()
                .from(tenantBilling)
                .where(eq(tenantBilling.id, billingId))
                .limit(1);

            if (billing.length > 0) {
                const b = billing[0];
                title = `Payment Due: ${b.billingMonth}`;

                // Fetch shop name separately
                const shopData = await db
                    .select({ name: shop.shopName })
                    .from(shop)
                    .where(eq(shop.sellerId, sellerId))
                    .limit(1);

                const shopName = shopData[0]?.name || "Your Shop";
                const amount = Number(b.amountDue).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
                // Ensure date string handling safety
                const date = new Date(String(b.dueDate)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                formattedMessage = `Subject: ${title}\nStore: ${shopName}\nDue Date: ${date}\nAmount Due: ${amount}\n\nNote from Admin:\n${message}`;
            }
        }

        // Create notification
        const notificationId = uuidv4();
        await db.insert(sellerNotifications).values({
            id: notificationId,
            sellerId,
            billingId: billingId || null,
            title,
            message: formattedMessage,
            type: "payment_reminder",
            isRead: false,
            sentBy: adminId,
        });

        return NextResponse.json({
            success: true,
            message: "Notification sent successfully",
            notificationId,
        });
    } catch (error) {
        console.error("Error sending notification:", error);
        console.error("Error details:", {
            message: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined,
        });
        return NextResponse.json(
            { error: "Failed to send notification" },
            { status: 500 }
        );
    }
}
