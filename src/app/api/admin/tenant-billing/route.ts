import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { tenantBilling, user, shop } from "@/server/schema/auth-schema";
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
        id: tenantBilling.id,
        tenantId: tenantBilling.tenantId,
        billingMonth: tenantBilling.billingMonth,
        amountDue: tenantBilling.amountDue,
        dueDate: tenantBilling.dueDate,
        status: tenantBilling.status,
        createdAt: tenantBilling.createdAt,
        updatedAt: tenantBilling.updatedAt,
        tenantName: user.name,
        tenantEmail: user.email,
        shopName: shop.shopName,
      })
      .from(tenantBilling)
      .leftJoin(user, eq(tenantBilling.tenantId, user.id))
      .leftJoin(shop, eq(shop.sellerId, tenantBilling.tenantId))
      .orderBy(sql`${tenantBilling.createdAt} DESC`);

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

// PUT /api/admin/tenant-billing - Update billing status (e.g. Mark as Paid)
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (!session.user.role.includes(USER_ROLES.ADMIN)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { billingId, status } = body;

    if (!billingId) {
      return NextResponse.json({ error: "Billing ID is required" }, { status: 400 });
    }

    // Default to 'paid' if just marking as paid, or use provided status
    const newStatus = status || "paid";

    await db
      .update(tenantBilling)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(tenantBilling.id, billingId));

    return NextResponse.json({ success: true, status: newStatus });
  } catch (error) {
    console.error("Error updating tenant billing:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
