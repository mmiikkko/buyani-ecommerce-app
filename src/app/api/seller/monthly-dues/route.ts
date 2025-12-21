import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { tenantBilling, tenantPayments, user } from "@/server/schema/auth-schema";
import { eq, desc } from "drizzle-orm";
import { getServerSession } from "@/server/session";

// GET /api/seller/monthly-dues - Get seller's billing records and payment history
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sellerId = session.user.id;

    // Get all billing records for this seller
    const billingRecords = await db
      .select()
      .from(tenantBilling)
      .where(eq(tenantBilling.tenantId, sellerId))
      .orderBy(desc(tenantBilling.createdAt));

    // Get all payment records for this seller's billings
    const billingIds = billingRecords.map((b) => b.id);
    let paymentRecords: any[] = [];

    if (billingIds.length > 0) {
      paymentRecords = await db
        .select()
        .from(tenantPayments)
        .where(eq(tenantPayments.tenantId, sellerId))
        .orderBy(desc(tenantPayments.createdAt));
    }

    // Format billing records
    const formattedBillings = billingRecords.map((billing) => {
      // Find payments for this billing
      const payments = paymentRecords.filter(
        (p) => p.billingId === billing.id
      );

      return {
        id: billing.id,
        billingMonth: billing.billingMonth,
        amountDue: Number(billing.amountDue || 0),
        dueDate: billing.dueDate,
        status: billing.status,
        createdAt: billing.createdAt,
        updatedAt: billing.updatedAt,
        payments: payments.map((p) => ({
          id: p.id,
          receiptNumber: p.receiptNumber,
          amountPaid: Number(p.amountPaid || 0),
          receiptUrl: p.receiptUrl,
          paymentDate: p.paymentDate,
          verificationStatus: p.verificationStatus,
          createdAt: p.createdAt,
        })),
      };
    });

    return NextResponse.json({
      billings: formattedBillings,
    });
  } catch (error) {
    console.error("Error fetching seller monthly dues:", error);
    return NextResponse.json(
      { error: "Failed to fetch monthly dues" },
      { status: 500 }
    );
  }
}

