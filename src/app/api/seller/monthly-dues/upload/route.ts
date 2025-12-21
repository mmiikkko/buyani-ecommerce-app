import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { tenantBilling, tenantPayments } from "@/server/schema/auth-schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "@/server/session";
import { USER_ROLES } from "@/server/schema/auth-schema";
import { v4 as uuidv4 } from "uuid";

// Helper function to convert file to base64
async function fileToBase64(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return `data:${file.type};base64,${buffer.toString("base64")}`;
}

// POST /api/seller/monthly-dues/upload - Upload payment receipt
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is seller
    if (!session.user.role.includes(USER_ROLES.SELLER)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const sellerId = session.user.id;

    // Parse FormData
    const formData = await req.formData();
    const billingId = formData.get("billingId") as string;
    const receiptFile = formData.get("receipt") as File;
    const receiptNumber = formData.get("receiptNumber") as string;
    const amountPaid = formData.get("amountPaid") as string;

    if (!billingId || !receiptFile || !receiptNumber || !amountPaid) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify billing belongs to this seller
    const billing = await db
      .select()
      .from(tenantBilling)
      .where(eq(tenantBilling.id, billingId))
      .limit(1);

    if (!billing.length) {
      return NextResponse.json({ error: "Billing not found" }, { status: 404 });
    }

    if (billing[0].tenantId !== sellerId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Convert receipt file to base64
    const receiptBase64 = await fileToBase64(receiptFile);

    // Generate payment ID
    const paymentId = uuidv4();

    // Create payment record
    await db.insert(tenantPayments).values({
      id: paymentId,
      tenantId: sellerId,
      billingId: billingId,
      receiptNumber: receiptNumber,
      amountPaid: amountPaid,
      receiptUrl: receiptBase64,
      paymentDate: new Date(),
      verificationStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Update billing status to pending_verification
    await db
      .update(tenantBilling)
      .set({
        status: "pending_verification",
        updatedAt: new Date(),
      })
      .where(eq(tenantBilling.id, billingId));

    return NextResponse.json({
      success: true,
      message: "Payment receipt uploaded successfully. Awaiting verification.",
      paymentId: paymentId,
    });
  } catch (error) {
    console.error("Error uploading payment receipt:", error);
    return NextResponse.json(
      { error: "Failed to upload payment receipt" },
      { status: 500 }
    );
  }
}

