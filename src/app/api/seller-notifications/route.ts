// app/api/seller-notifications/route.ts

import { db } from "@/server/drizzle";
import { sellerNotifications } from "@/server/schema/auth-schema";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from '@/server/session';
import { eq, desc } from "drizzle-orm";

// GET - Fetch notifications for the logged-in seller
export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get("sellerId");

    // If no sellerId provided, use current user's ID (for sellers viewing their own)
    const targetSellerId = sellerId || session.user.id;

    // Only allow sellers to view their own notifications, or admins to view any
    if (session.user.role !== "admin" && targetSellerId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Fetch notifications ordered by newest first
    const notifications = await db
      .select()
      .from(sellerNotifications)
      .where(eq(sellerNotifications.sellerId, targetSellerId))
      .orderBy(desc(sellerNotifications.createdAt));

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// POST - Create a new notification (Admin only)
export async function POST(request: Request) {
  try {
    // Get the admin user from session
    const session = await getServerSession();
    
    console.log("Session in POST:", session); // Debug log
    
    if (!session) {
      console.log("No session found"); // Debug log
      return NextResponse.json(
        { error: "Unauthorized - No session found" },
        { status: 401 }
      );
    }
    
    if (session.user.role !== "admin") {
      console.log("User is not admin:", session.user.role); // Debug log
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { sellerId, title, message, type } = body;

    console.log("Request body:", { sellerId, title, message, type }); // Debug log

    // Validate required fields
    if (!sellerId || !title || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert notification into database
    await db.insert(sellerNotifications).values({
      id: uuidv4(),
      sellerId,
      billingId: null, // Not tied to a specific billing record
      title,
      message,
      type: type || "payment_reminder",
      isRead: false,
      sentBy: session.user.id, // Admin who sent it
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating seller notification:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}

// PATCH - Mark notification as read
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { notificationId } = body;

    if (!notificationId) {
      return NextResponse.json(
        { error: "Notification ID required" },
        { status: 400 }
      );
    }

    // Update notification to mark as read
    await db
      .update(sellerNotifications)
      .set({
        isRead: true,
        readAt: new Date(),
      })
      .where(eq(sellerNotifications.id, notificationId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}