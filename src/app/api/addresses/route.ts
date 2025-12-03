import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { addresses } from "@/server/schema/auth-schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "@/server/session";
import { v4 as uuidv4 } from "uuid";
import { sql } from "drizzle-orm";

// Helper function to get or create customer_profile
async function getOrCreateCustomerProfile(userId: string): Promise<string> {
  // First, try to get existing customer_profile
  const existingProfile = await db.execute(
    sql`SELECT id FROM customer_profile WHERE user_id = ${userId} LIMIT 1`
  );

  if (existingProfile && Array.isArray(existingProfile) && existingProfile.length > 0) {
    return (existingProfile[0] as any).id;
  }

  // Create new customer_profile if it doesn't exist
  const profileId = uuidv4();
  await db.execute(
    sql`INSERT INTO customer_profile (id, user_id, added_at) VALUES (${profileId}, ${userId}, NOW())`
  );

  return profileId;
}

// GET /api/addresses - Get addresses for the current user
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customerProfileId = await getOrCreateCustomerProfile(session.user.id);

    const userAddresses = await db
      .select()
      .from(addresses)
      .where(eq(addresses.customerProfileId, customerProfileId));

    return NextResponse.json(userAddresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

// POST /api/addresses - Create a new address
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      fullName,
      street,
      apartment,
      city,
      province,
      zipcode,
      country,
      contactNumber,
      deliveryNotes,
    } = body;

    // Validate required fields
    if (!fullName || !street || !city || !province || !zipcode || !country || !contactNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get or create customer_profile
    const customerProfileId = await getOrCreateCustomerProfile(session.user.id);

    // Combine street and apartment if apartment exists
    const fullStreet = apartment ? `${street}, ${apartment}` : street;

    const newAddress = {
      id: uuidv4(),
      customerProfileId: customerProfileId,
      street: fullStreet,
      city,
      province,
      zipcode,
      region: country, // Using region field for country
      remarks: deliveryNotes || null,
      baranggay: null, // Can be added later if needed
    };

    await db.insert(addresses).values(newAddress);

    return NextResponse.json({ success: true, address: newAddress });
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 }
    );
  }
}

// PUT /api/addresses?id=xxx - Update an address
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const addressId = searchParams.get("id");
    if (!addressId) {
      return NextResponse.json({ error: "Missing address ID" }, { status: 400 });
    }

    const body = await req.json();
    const {
      fullName,
      street,
      apartment,
      city,
      province,
      zipcode,
      country,
      contactNumber,
      deliveryNotes,
    } = body;

    // Get customer_profile for user
    const customerProfileId = await getOrCreateCustomerProfile(session.user.id);

    // Verify address belongs to user
    const existingAddress = await db
      .select()
      .from(addresses)
      .where(eq(addresses.id, addressId))
      .limit(1);

    if (!existingAddress.length || existingAddress[0].customerProfileId !== customerProfileId) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    // Combine street and apartment if apartment exists
    const fullStreet = apartment ? `${street}, ${apartment}` : street;

    const updates = {
      street: fullStreet,
      city,
      province,
      zipcode,
      region: country,
      remarks: deliveryNotes || null,
    };

    await db
      .update(addresses)
      .set(updates)
      .where(eq(addresses.id, addressId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

