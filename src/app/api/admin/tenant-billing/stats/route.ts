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
    const statusStats = await db
      .select({
        status: tenantBilling.status,
        count: sql<number>`COUNT(*)`,
        totalAmount: sql<number>`COALESCE(SUM(${tenantBilling.amountDue}), 0)`,
      })
      .from(tenantBilling)
      .groupBy(tenantBilling.status);

    let paid = 0;
    let unpaid = 0;
    let pendingVerification = 0;
    let rejected = 0;
    let totalPaid = 0;
    let totalUnpaid = 0;

    statusStats.forEach((stat) => {
      const count = Number(stat.count || 0);
      const amount = Number(stat.totalAmount || 0);

      if (stat.status === "paid") {
        paid = count;
        totalPaid = amount;
      } else if (stat.status === "unpaid") {
        unpaid = count;
        totalUnpaid = amount;
      } else if (stat.status === "pending_verification") {
        pendingVerification = count;
      } else if (stat.status === "rejected") {
        rejected = count;
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

