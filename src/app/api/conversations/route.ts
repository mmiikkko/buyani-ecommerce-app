import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { getServerSession } from "@/server/session";
import { conversations, user, products, shop } from "@/server/schema/auth-schema";
import { eq, or, and, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// GET /api/conversations - Get all conversations for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get all conversations where user is either customer or seller
    const userConversations = await db
      .select({
        id: conversations.id,
        customerId: conversations.customerId,
        sellerId: conversations.sellerId,
        productId: conversations.productId,
        lastMessageAt: conversations.lastMessageAt,
        createdAt: conversations.createdAt,
        customerName: user.name,
        customerFirstName: user.first_name,
        customerLastName: user.last_name,
        productName: products.productName,
      })
      .from(conversations)
      .leftJoin(user, eq(conversations.customerId, user.id))
      .leftJoin(products, eq(conversations.productId, products.id))
      .where(
        or(
          eq(conversations.customerId, userId),
          eq(conversations.sellerId, userId)
        )
      )
      .orderBy(desc(conversations.lastMessageAt));

    // Get seller info for each conversation
    const conversationsWithSeller = await Promise.all(
      userConversations.map(async (conv) => {
        const seller = await db
          .select({
            id: user.id,
            name: user.name,
            firstName: user.first_name,
            lastName: user.last_name,
          })
          .from(user)
          .where(eq(user.id, conv.sellerId))
          .limit(1);

        return {
          id: conv.id,
          customerId: conv.customerId,
          sellerId: conv.sellerId,
          productId: conv.productId,
          lastMessageAt: conv.lastMessageAt,
          createdAt: conv.createdAt,
          customerName: conv.customerName || 
            (conv.customerFirstName && conv.customerLastName 
              ? `${conv.customerFirstName} ${conv.customerLastName}`.trim()
              : conv.customerFirstName || conv.customerLastName || "Unknown"),
          sellerName: seller[0]?.name || 
            (seller[0]?.firstName && seller[0]?.lastName 
              ? `${seller[0].firstName} ${seller[0].lastName}`.trim()
              : seller[0]?.firstName || seller[0]?.lastName || "Unknown"),
          productName: conv.productName || null,
        };
      })
    );

    return NextResponse.json(conversationsWithSeller);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

// POST /api/conversations - Create a new conversation
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sellerId, productId } = await req.json();

    if (!sellerId) {
      return NextResponse.json(
        { error: "Seller ID is required" },
        { status: 400 }
      );
    }

    const customerId = session.user.id;

    // Check if conversation already exists
    const existingConversation = await db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.customerId, customerId),
          eq(conversations.sellerId, sellerId),
          productId ? eq(conversations.productId, productId) : undefined
        )
      )
      .limit(1);

    if (existingConversation.length > 0) {
      return NextResponse.json(existingConversation[0]);
    }

    // Create new conversation
    const conversationId = uuidv4();
    await db.insert(conversations).values({
      id: conversationId,
      customerId,
      sellerId,
      productId: productId || null,
      lastMessageAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const newConversation = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    return NextResponse.json(newConversation[0], { status: 201 });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}

