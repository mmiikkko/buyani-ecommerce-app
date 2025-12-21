import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { tenantBilling, user } from "@/server/schema/auth-schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { getServerSession } from "@/server/session";

// GET /api/seller/notifications/dues - Get upcoming due notifications
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const sellerId = session.user.id;
        const today = new Date();
        const fiveDaysFromNow = new Date(today);
        fiveDaysFromNow.setDate(today.getDate() + 5);

        // Get unpaid bills due within the next 5 days
        const upcomingDues = await db
            .select({
                id: tenantBilling.id,
                billingMonth: tenantBilling.billingMonth,
                amountDue: tenantBilling.amountDue,
                dueDate: tenantBilling.dueDate,
                status: tenantBilling.status,
            })
            .from(tenantBilling)
            .where(
                and(
                    eq(tenantBilling.tenantId, sellerId),
                    sql`${tenantBilling.status} IN ('pending', 'overdue')`,
                    lte(tenantBilling.dueDate, fiveDaysFromNow)
                )
            )
            .orderBy(tenantBilling.dueDate);

        // Calculate days until due for each bill
        const notifications = upcomingDues.map((bill) => {
            const dueDate = new Date(bill.dueDate);
            const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            const isOverdue = daysUntilDue < 0;

            return {
                id: bill.id,
                billingMonth: bill.billingMonth,
                amountDue: Number(bill.amountDue),
                dueDate: bill.dueDate,
                daysUntilDue: Math.abs(daysUntilDue),
                isOverdue,
                urgency: isOverdue ? "overdue" : daysUntilDue <= 2 ? "urgent" : "upcoming",
                message: isOverdue
                    ? `Payment for ${bill.billingMonth} is ${Math.abs(daysUntilDue)} day(s) overdue`
                    : `Payment for ${bill.billingMonth} is due in ${daysUntilDue} day(s)`,
            };
        });

        return NextResponse.json({
            notifications,
            hasUpcomingDues: notifications.length > 0,
            overdueCount: notifications.filter((n) => n.isOverdue).length,
        });
    } catch (error) {
        console.error("Error fetching due notifications:", error);
        return NextResponse.json(
            { error: "Failed to fetch notifications" },
            { status: 500 }
        );
    }
}
