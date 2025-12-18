import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { tentantBilling, user, shop } from "@/server/schema/auth-schema";
import { eq, sql } from "drizzle-orm";
import { getServerSession } from "@/server/session";
import { USER_ROLES } from "@/server/schema/auth-schema";

// GET /api/admin/tenant-billing - Get all tenant billing records
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

    // Get all tenant billing records with seller and shop info
    const billingRecords = await db
      .select({
        id: tentantBilling.id,
        tenantId: tentantBilling.tenantId,
        billingMonth: tentantBilling.billingMonth,
        amountDue: tentantBilling.amountDue,
        dueDate: tentantBilling.dueDate,
        status: tentantBilling.status,
        createdAt: tentantBilling.createdAt,
        updatedAt: tentantBilling.updatedAt,
        tenantName: user.name,
        tenantEmail: user.email,
        shopName: shop.shopName,
      })
      .from(tentantBilling)
      .leftJoin(user, eq(tentantBilling.tenantId, user.id))
      .leftJoin(shop, eq(shop.sellerId, tentantBilling.tenantId))
      .orderBy(sql`${tentantBilling.createdAt} DESC`);

    const formattedRecords = billingRecords.map((record) => ({
      id: record.id,
      tenantId: record.tenantId,
      tenantName: record.tenantName || "Unknown",
      tenantEmail: record.tenantEmail,
      shopName: record.shopName || "N/A",
      billingMonth: record.billingMonth,
      amountDue: Number(record.amountDue || 0),
      dueDate: record.dueDate,
      status: record.status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    }));

    return NextResponse.json(formattedRecords);
  } catch (error) {
    console.error("Error fetching tenant billing:", error);
    return NextResponse.json(
      { error: "Failed to fetch tenant billing" },
      { status: 500 }
    );
  }
}

