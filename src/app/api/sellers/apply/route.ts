import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import {
  shop,
  user,
  USER_ROLES,
  sellerApplications,
  applicationDocuments,
} from "@/server/schema/auth-schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "@/server/session";
import { v4 as uuidv4 } from "uuid";

// Corrected alias removed as we now import correctly

// helper: convert File → base64 data URL
async function fileToBase64(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return `data:${file.type};base64,${buffer.toString("base64")}`;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // ✅ FIX: parse FormData
    const formData = await req.formData();

    const shopName = formData.get("shopName") as string;
    const description = formData.get("shopDescription") as string;
    const notarizedFile = formData.get("notarizedAgreement") as File;
    const validIdFile = formData.get("validId") as File;

    if (!shopName || !description || !notarizedFile || !validIdFile) {
      return NextResponse.json(
        { error: "Missing required fields or documents" },
        { status: 400 }
      );
    }

    // Check existing shop
    const existingShop = await db
      .select()
      .from(shop)
      .where(eq(shop.sellerId, userId))
      .limit(1);

    if (existingShop.length > 0) {
      return NextResponse.json(
        { error: "You already have a shop registered" },
        { status: 400 }
      );
    }

    // Check shop name uniqueness
    const shopNameExists = await db
      .select()
      .from(shop)
      .where(eq(shop.shopName, shopName))
      .limit(1);

    if (shopNameExists.length > 0) {
      return NextResponse.json(
        { error: "Shop name is already taken" },
        { status: 400 }
      );
    }

    // Convert files
    const notarizedBase64 = await fileToBase64(notarizedFile);
    const validIdBase64 = await fileToBase64(validIdFile);

    // Create shop
    const shopId = uuidv4();
    await db.insert(shop).values({
      id: shopId,
      sellerId: userId,
      shopName,
      description,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create seller application
    const applicationId = uuidv4();
    await db.insert(sellerApplications).values({
      id: applicationId,
      sellerId: userId,
      status: "pending",
      submittedAt: new Date(),
    });


    // Store documents
    await db.insert(applicationDocuments).values([
      {
        id: uuidv4(),
        applicationId,
        documentType: "notarized_agreement",
        documentURL: notarizedBase64,
        verified: false,
      },
      {
        id: uuidv4(),
        applicationId,
        documentType: "valid_id",
        documentURL: validIdBase64,
        verified: false,
      },
    ]);


    // Update user role
    await db
      .update(user)
      .set({ role: USER_ROLES.PENDING_SELLER })
      .where(eq(user.id, userId));

    return NextResponse.json({
      success: true,
      message: "Shop application submitted. Awaiting admin approval.",
    });
  } catch (error) {
    console.error("Seller apply error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
