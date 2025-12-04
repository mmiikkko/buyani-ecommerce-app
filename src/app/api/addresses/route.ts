import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { addresses } from "@/server/schema/auth-schema";
import { eq, and, ne, sql } from "drizzle-orm";
import { getServerSession } from "@/server/session";
import { v4 as uuidv4 } from "uuid";

// GET /api/addresses - Get addresses for the current user
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userAddresses = await db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, session.user.id));
    
    // Sort by added date (newest first)
    userAddresses.sort((a: any, b: any) => {
      return new Date(b.addedAt || 0).getTime() - new Date(a.addedAt || 0).getTime();
    });

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
      receipientName,
      street,
      baranggay,
      city,
      province,
      region,
      zipcode,
      remarks,
    } = body;

    // Validate required fields
    if (!receipientName || !street || !city || !province || !zipcode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newAddress = {
      id: uuidv4(),
      userId: session.user.id,
      receipientName,
      street,
      baranggay: baranggay || null,
      city,
      province,
      region: region || null,
      zipcode,
      remarks: remarks || null,
    };

    await db.insert(addresses).values(newAddress);

    return NextResponse.json({ success: true, address: newAddress });
  } catch (error: any) {
    console.error("Error creating address:", error);
    const errorMessage = error?.message || "Failed to create address";
    return NextResponse.json(
      { error: errorMessage, details: error?.code || "UNKNOWN_ERROR" },
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
      receipientName,
      street,
      baranggay,
      city,
      province,
      region,
      zipcode,
      remarks,
    } = body;

    // Verify address belongs to user
    const existingAddress = await db
      .select()
      .from(addresses)
      .where(and(eq(addresses.id, addressId), eq(addresses.userId, session.user.id)))
      .limit(1);

    if (!existingAddress.length) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    const updates: any = {};
    if (receipientName !== undefined) updates.receipientName = receipientName;
    if (street !== undefined) updates.street = street;
    if (baranggay !== undefined) updates.baranggay = baranggay;
    if (city !== undefined) updates.city = city;
    if (province !== undefined) updates.province = province;
    if (region !== undefined) updates.region = region;
    if (zipcode !== undefined) updates.zipcode = zipcode;
    if (remarks !== undefined) updates.remarks = remarks;

    await db
      .update(addresses)
      .set(updates)
      .where(eq(addresses.id, addressId));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating address:", error);
    const errorMessage = error?.message || "Failed to update address";
    return NextResponse.json(
      { error: errorMessage, details: error?.code || "UNKNOWN_ERROR" },
      { status: 500 }
    );
  }
}

// DELETE /api/addresses?id=xxx - Delete an address
export async function DELETE(req: NextRequest) {
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

    // Verify address belongs to user
    const existingAddress = await db
      .select()
      .from(addresses)
      .where(and(eq(addresses.id, addressId), eq(addresses.userId, session.user.id)))
      .limit(1);

    if (!existingAddress.length) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    await db
      .delete(addresses)
      .where(eq(addresses.id, addressId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}

