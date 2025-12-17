import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { 
  shop, 
  user, 
  sellerApplications, 
  applicatioDocuments 
} from "@/server/schema/auth-schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "@/server/session";
import { USER_ROLES } from "@/server/schema/auth-schema";

// GET /api/admin/seller-applications/[id] - Get seller application details with documents
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (!session.user.role.includes(USER_ROLES.ADMIN)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await Promise.resolve(params);
    if (!id) {
      return NextResponse.json({ error: "Shop ID is required" }, { status: 400 });
    }

    // Get shop details with seller info
    const shopData = await db
      .select({
        id: shop.id,
        sellerId: shop.sellerId,
        shopName: shop.shopName,
        shopRating: shop.shopRating,
        description: shop.description,
        imageURL: shop.imageURL,
        status: shop.status,
        createdAt: shop.createdAt,
        updatedAt: shop.updatedAt,
        ownerName: user.name,
        ownerFirstName: user.first_name,
        ownerLastName: user.last_name,
        ownerEmail: user.email,
      })
      .from(shop)
      .leftJoin(user, eq(shop.sellerId, user.id))
      .where(eq(shop.id, id))
      .limit(1);

    if (!shopData.length) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    const shopItem = shopData[0];

    // Get seller application
    const applicationData = await db
      .select()
      .from(sellerApplications)
      .where(eq(sellerApplications.sellerId, shopItem.sellerId))
      .orderBy(sellerApplications.submittedAt)
      .limit(1);

    let application = null;
    let documents = [];

    if (applicationData.length > 0) {
      application = applicationData[0];

      // Get application documents
      documents = await db
        .select()
        .from(applicatioDocuments)
        .where(eq(applicatioDocuments.applicationId, application.id));
    }

    return NextResponse.json({
      shop: {
        id: shopItem.id,
        sellerId: shopItem.sellerId,
        shopName: shopItem.shopName,
        shopRating: shopItem.shopRating,
        description: shopItem.description,
        imageURL: shopItem.imageURL,
        status: shopItem.status,
        createdAt: shopItem.createdAt,
        updatedAt: shopItem.updatedAt,
      },
      seller: {
        id: shopItem.sellerId,
        name: shopItem.ownerName || 
          `${shopItem.ownerFirstName || ""} ${shopItem.ownerLastName || ""}`.trim() ||
          "Unknown",
        email: shopItem.ownerEmail,
        firstName: shopItem.ownerFirstName,
        lastName: shopItem.ownerLastName,
      },
      application: application ? {
        id: application.id,
        status: application.status,
        submittedAt: application.submittedAt,
        reviewedAt: application.reviewedAt,
      } : null,
      documents: documents.map((doc) => ({
        id: doc.id,
        documentType: doc.documentType,
        documentURL: doc.documentURL,
        uploadedAt: doc.uploadedAt,
        verified: doc.verified,
      })),
    });
  } catch (error) {
    console.error("Error fetching seller application details:", error);
    return NextResponse.json(
      { error: "Failed to fetch application details" },
      { status: 500 }
    );
  }
}

