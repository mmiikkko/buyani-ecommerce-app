import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { getServerSession } from "@/server/session";
import { messages, conversations } from "@/server/schema/auth-schema";
import { eq, and, asc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// GET /api/conversations/[conversationId]/messages - Get messages for a conversation
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId } = await params;
    const userId = session.user.id;

    // Verify user is part of this conversation
    const conversation = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    if (conversation.length === 0) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const conv = conversation[0];
    if (conv.customerId !== userId && conv.sellerId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Get all messages for this conversation
    const messagesList = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt));

    // Mark messages as read if they're from the other user
    const unreadMessages = messagesList.filter(
      (msg) => msg.senderId !== userId && !msg.isRead
    );

    if (unreadMessages.length > 0) {
      await db
        .update(messages)
        .set({ isRead: true })
        .where(
          and(
            eq(messages.conversationId, conversationId),
            eq(messages.senderId, conv.customerId === userId ? conv.sellerId : conv.customerId)
          )
        );
    }

    return NextResponse.json(messagesList);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST /api/conversations/[conversationId]/messages - Send a message
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId } = await params;
    const { content } = await req.json();
    const senderId = session.user.id;

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // Verify user is part of this conversation
    const conversation = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    if (conversation.length === 0) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const conv = conversation[0];
    if (conv.customerId !== senderId && conv.sellerId !== senderId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Create message
    const messageId = uuidv4();
    await db.insert(messages).values({
      id: messageId,
      conversationId,
      senderId,
      content: content.trim(),
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Update conversation's lastMessageAt
    await db
      .update(conversations)
      .set({
        lastMessageAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(conversations.id, conversationId));

    const newMessage = await db
      .select()
      .from(messages)
      .where(eq(messages.id, messageId))
      .limit(1);

    return NextResponse.json(newMessage[0], { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

