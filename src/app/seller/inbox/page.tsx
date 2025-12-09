"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
};

type Conversation = {
  id: string;
  customerId: string;
  sellerId: string;
  productId: string | null;
  lastMessageAt: string;
  customerName: string;
  sellerName: string;
  productName: string | null;
};

export default function SellerInbox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationIdParam = searchParams.get("conversationId");
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    conversationIdParam || null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageContent, setMessageContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  useEffect(() => {
  fetchCurrentUser();
  }, []);

useEffect(() => {
  if (currentUserId) {
    fetchConversations();
  }
}, [currentUserId]);

  useEffect(() => {
    if (selectedConversation && currentUserId) {
      fetchMessages(selectedConversation);
      // Poll for new messages every 3 seconds
      const interval = setInterval(() => {
        fetchMessages(selectedConversation);
        fetchConversations(); // Also refresh conversation list
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation, currentUserId]);

  useEffect(() => {
    if (conversations.length > 0 && currentUserId) {
      fetchUnreadCounts();
    }
  }, [conversations, currentUserId]);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setCurrentUserId(data.id);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const fetchConversations = async () => {
    if (!currentUserId) return;
    
    try {
      setLoading(true);
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        // Filter to only show conversations where current user is the seller
        const sellerConversations = data.filter(
          (conv: Conversation) => conv.sellerId === currentUserId
        );
        setConversations(sellerConversations);
        if (sellerConversations.length > 0 && !selectedConversation) {
          setSelectedConversation(sellerConversations[0].id);
          router.push(`/seller/inbox?conversationId=${sellerConversations[0].id}`);
        }
      } else if (res.status === 401) {
        router.push("/sign-in?redirect=/seller/inbox");
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/conversations/${convId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        // Calculate unread count for this conversation
        const unread = data.filter(
          (m: Message) => m.senderId !== currentUserId && !m.isRead
        ).length;
        setUnreadCounts((prev) => ({ ...prev, [convId]: unread }));
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchUnreadCounts = async () => {
    if (!currentUserId) return;
    
    try {
      // Fetch unread counts for all conversations
      const counts: Record<string, number> = {};
      await Promise.all(
        conversations.map(async (conv) => {
          const res = await fetch(`/api/conversations/${conv.id}/messages`);
          if (res.ok) {
            const msgs = await res.json();
            const unread = msgs.filter(
              (m: Message) => m.senderId !== currentUserId && !m.isRead
            ).length;
            counts[conv.id] = unread;
          }
        })
      );
      setUnreadCounts(counts);
    } catch (error) {
      console.error("Error fetching unread counts:", error);
    }
  };

  const sendMessage = async () => {
    if (!selectedConversation || !messageContent.trim()) return;

    try {
      setSending(true);
      const res = await fetch(`/api/conversations/${selectedConversation}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: messageContent }),
      });

      if (res.ok) {
        const newMessage = await res.json();
        setMessages([...messages, newMessage]);
        setMessageContent("");
        fetchConversations(); // Refresh conversations to update lastMessageAt
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  return (
    <section className="relative min-h-screen min-w-full overflow-hidden space-y-5 mt-18 mx-3">
      <div className="mb-6">
        <h1 className="text-xl mb-1 font-bold text-[#2E7D32]">Inbox</h1>
        <p className="text-muted-foreground">Customer messages and conversations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Conversations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 text-center">
                <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-[#2E7D32]" />
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <MessageCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm">No conversations yet.</p>
                <p className="text-xs mt-1">Customers will appear here when they message you.</p>
              </div>
            ) : (
              <div className="divide-y">
                {conversations.map((conv) => {
                  const unreadCount = unreadCounts[conv.id] || 0;
                  
                  return (
                    <button
                      key={conv.id}
                      onClick={() => {
                        setSelectedConversation(conv.id);
                        router.push(`/seller/inbox?conversationId=${conv.id}`);
                      }}
                      className={`w-full text-left p-4 hover:bg-emerald-50 transition-colors ${
                        selectedConversation === conv.id ? "bg-emerald-50 border-l-4 border-[#2E7D32]" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900">
                            {conv.customerName}
                          </div>
                          {conv.productName && (
                            <div className="text-xs text-muted-foreground mt-1 truncate">
                              {conv.productName}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(conv.lastMessageAt).toLocaleDateString()}
                          </div>
                        </div>
                        {unreadCount > 0 && (
                          <span className="ml-2 bg-[#2E7D32] text-white text-xs font-semibold rounded-full px-2 py-1 min-w-[20px] text-center">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

{/* Chat Area */}
<Card className="lg:col-span-2 flex flex-col h-[600px]">
  {selectedConversation && selectedConv ? (
    <>
      {/* Header */}
      <CardHeader className="border-b bg-emerald-50">
        <CardTitle className="text-lg">{selectedConv.customerName}</CardTitle>
        {selectedConv.productName && (
          <p className="text-sm text-muted-foreground mt-1">
            About: {selectedConv.productName}
          </p>
        )}
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 flex flex-col p-0">
        <div
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{ overflowAnchor: "auto" }}
          ref={chatAreaRef} // Attach the ref to the chat area
        >
          {messages.map((message) => {
            const isOwnMessage = message.senderId === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] break-words rounded-lg p-3 ${
                    isOwnMessage
                      ? "bg-[#2E7D32] text-white"
                      : "bg-slate-200 text-slate-900"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwnMessage ? "text-emerald-100" : "text-slate-500"
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input */}
        <div className="border-t p-4 bg-white sticky bottom-0">
          <div className="flex gap-2">
            <Input
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type your message..."
              disabled={sending}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={!messageContent.trim() || sending}
              className="bg-[#2E7D32] hover:bg-[#2E7D32]/90"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  ) : (
    <CardContent className="flex items-center justify-center h-full">
      <div className="text-center">
        <MessageCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground">
          Select a conversation to start chatting
        </p>
      </div>
    </CardContent>
  )}
</Card>
      </div>
    </section>
  );
}
