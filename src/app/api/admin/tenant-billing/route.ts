import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { tenantBilling, user, shop, tenantPayments } from "@/server/schema/auth-schema";
import { eq, sql, and } from "drizzle-orm";
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
    // Left join with tenantPayments to get the LATEST payment attempt info
    // Note: In a real app we might want to be more specific about WHICH payment if multiple exist.
    // Here we assume the latest one is relevant for the status.
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
        // Payment info
        paymentId: tenantPayments.id,
        receiptNumber: tenantPayments.receiptNumber,
        paymentDate: tenantPayments.paymentDate,
        amountPaid: tenantPayments.amountPaid,
        // We do NOT fetch receiptUrl here as it might be a large base64 string
      })
      .from(tenantBilling)
      .leftJoin(user, eq(tenantBilling.tenantId, user.id))
      .leftJoin(shop, eq(shop.sellerId, tenantBilling.tenantId))
      .leftJoin(tenantPayments, eq(tenantPayments.billingId, tenantBilling.id))
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
      payment: record.paymentId ? {
        id: record.paymentId,
        receiptNumber: record.receiptNumber,
        paymentDate: record.paymentDate,
        amountPaid: Number(record.amountPaid || 0),
      } : null,
    }));

    // De-duplicate billings if multiple payments exist? 
    // The left join might produce duplicates if there are multiple payments for one billing.
    // We should group by billing ID.
    // For simplicity in this fix, we'll map reduce to unique billings.
    const uniqueRecordsMap = new Map();
    formattedRecords.forEach(r => {
      if (!uniqueRecordsMap.has(r.id)) {
        uniqueRecordsMap.set(r.id, r);
      } else {
        // If duplicate, maybe keep the one with payment info?
        // The status should be the same.
        if (r.payment) uniqueRecordsMap.set(r.id, r);
      }
    });

    return NextResponse.json(Array.from(uniqueRecordsMap.values()));
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

    await db.transaction(async (tx) => {
      // 1. Update billing status
      await tx
        .update(tenantBilling)
        .set({
          status: newStatus,
          updatedAt: new Date(),
        })
        .where(eq(tenantBilling.id, billingId));

      // 2. If marking as paid
      if (newStatus === "paid") {
        // Check if ANY payment exists for this billing
        const existingPayments = await tx
          .select()
          .from(tenantPayments)
          .where(eq(tenantPayments.billingId, billingId));

        if (existingPayments.length > 0) {
          // Update existing pending payments to verified
          await tx
            .update(tenantPayments)
            .set({
              verificationStatus: "verified",
              updatedAt: new Date(),
            })
            .where(and(
              eq(tenantPayments.billingId, billingId),
              eq(tenantPayments.verificationStatus, "pending")
            ));
        } else {
          // NO payment record exists (e.g. manual cash payment without upload)
          // Create a system generated payment record so it shows up in history
          const billingInfo = await tx.select().from(tenantBilling).where(eq(tenantBilling.id, billingId)).limit(1);
          if (billingInfo[0]) {
            const { v4: uuidv4 } = require('uuid');
            await tx.insert(tenantPayments).values({
              id: uuidv4(),
              tenantId: billingInfo[0].tenantId,
              billingId: billingId,
              receiptNumber: `MANUAL-${Date.now()}`,
              amountPaid: billingInfo[0].amountDue, // Assume full payment
              receiptUrl: "manual_verification", // Placeholder
              paymentDate: new Date(), // Now
              verificationStatus: "verified"
            });
          }
        }

        // 3. Auto-generate NEXT month's bill if it doesn't exist
        const currentBill = await tx.select().from(tenantBilling).where(eq(tenantBilling.id, billingId)).limit(1);
        if (currentBill[0]) {
          const currentMonthStr = currentBill[0].billingMonth; // "YYYY-MM"
          const [year, month] = currentMonthStr.split('-').map(Number);

          // Calculate next month
          const nextDate = new Date(year, month - 1 + 1, 1); // month is 0-indexed in Date, but 1-based in string. +1 for next month
          const nextYear = nextDate.getFullYear();
          const nextMonthVal = nextDate.getMonth() + 1;
          const nextMonthStr = `${nextYear}-${String(nextMonthVal).padStart(2, '0')}`;

          // Determine Due Date (same day of month as current due date, but next month)
          const currentDueDate = new Date(currentBill[0].dueDate);
          const nextDueDate = new Date(currentDueDate);
          nextDueDate.setMonth(nextDueDate.getMonth() + 1);

          // Check existence
          const existingNextBill = await tx.select()
            .from(tenantBilling)
            .where(and(
              eq(tenantBilling.tenantId, currentBill[0].tenantId),
              eq(tenantBilling.billingMonth, nextMonthStr)
            ))
            .limit(1);

          if (existingNextBill.length === 0) {
            const { v4: uuidv4 } = require('uuid');
            await tx.insert(tenantBilling).values({
              id: uuidv4(),
              tenantId: currentBill[0].tenantId,
              billingMonth: nextMonthStr,
              amountDue: "2500.00",
              dueDate: nextDueDate,
              status: "pending"
            });
          }
        }
      }
    });

    return NextResponse.json({ success: true, status: newStatus });
  } catch (error) {
    console.error("Error updating tenant billing:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
