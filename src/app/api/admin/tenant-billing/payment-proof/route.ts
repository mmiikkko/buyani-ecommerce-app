import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { tenantPayments } from "@/server/schema/auth-schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "@/server/session";
import { USER_ROLES } from "@/server/schema/auth-schema";

// GET /api/admin/tenant-billing/payment-proof?paymentId=xxx
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user is admin
        if (!session.user.role.includes(USER_ROLES.ADMIN)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const paymentId = searchParams.get("paymentId");

        if (!paymentId) {
            return NextResponse.json({ error: "Payment ID is required" }, { status: 400 });
        }

        const payment = await db
            .select({
                receiptUrl: tenantPayments.receiptUrl,
            })
            .from(tenantPayments)
            .where(eq(tenantPayments.id, paymentId))
            .limit(1);

        if (payment.length === 0) {
            return NextResponse.json({ error: "Payment not found" }, { status: 404 });
        }

        return NextResponse.json({ receiptUrl: payment[0].receiptUrl });
    } catch (error) {
        console.error("Error fetching payment proof:", error);
        return NextResponse.json(
            { error: "Failed to fetch payment proof" },
            { status: 500 }
        );
    }
}
