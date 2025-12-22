import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { tenantBilling, user } from "@/server/schema/auth-schema";
import { eq, sql } from "drizzle-orm";
import { getServerSession } from "@/server/session";
import { USER_ROLES } from "@/server/schema/auth-schema";

// GET /api/admin/tenant-billing/stats - Get tenant billing statistics
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get total tenants (users with seller role)
    const totalSellers = await db
      .select({
        count: sql<number>`COUNT(DISTINCT ${tenantBilling.tenantId})`,
      })
      .from(tenantBilling);

    const totalTenants = Number(totalSellers[0]?.count || 0);

    // Get billing statistics by status
    // We need to allow for "Pending Verification" to count items that might have a pending payment,
    // even if the billing status itself hasn't been updated perfectly (though it should be).
    // Let's rely on the billing status first.

    // Also, the user mentioned "Pending" in the table (which is "unpaid" usually, or "pending" initial state).

    const statusStats = await db
      .select({
        status: tenantBilling.status,
        dueDate: tenantBilling.dueDate,
        amount: tenantBilling.amountDue,
      })
      .from(tenantBilling);

    let paid = 0;
    let unpaid = 0;
    let pendingVerification = 0;
    let rejected = 0;
    let totalPaid = 0;
    let totalUnpaid = 0;

    const now = new Date();

    statusStats.forEach((record) => {
      const amount = Number(record.amount || 0);
      const status = record.status?.toLowerCase()?.trim();
      const dueDate = new Date(record.dueDate);
      const isOverdue = dueDate < now;

      if (status === "paid") {
        paid++;
        totalPaid += amount;
      } else if (status === "rejected") {
        rejected++;
      } else {
        // Handle Unpaid, Pending, Pending Verification
        if (status === "pending_verification") {
          // Always pending verification if proof uploaded
          pendingVerification++;
        } else if (status === "pending") {
          // "Pending" (Future/Next Month) -> User wants this in Pending Verification (or just Pending bucket)
          pendingVerification++;
        } else if (status === "unpaid") {
          if (isOverdue) {
            // Unpaid AND Overdue -> Unpaid Stats
            unpaid++;
            totalUnpaid += amount;
          } else {
            // Unpaid but NOT Overdue -> Treat as active/pending
            pendingVerification++;
          }
        }
      }
    });

    // Get total billing records
    const totalRecordsResult = await db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(tenantBilling);

    const totalRecords = Number(totalRecordsResult[0]?.count || 0);

    return NextResponse.json({
      totalTenants,
      totalRecords,
      paid,
      unpaid,
      pendingVerification,
      rejected,
      totalPaid,
      totalUnpaid,
    });
  } catch (error) {
    console.error("Error fetching tenant billing stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch tenant billing statistics" },
      { status: 500 }
    );
  }
}

