"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { authClient } from "@/server/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export function ChatFab({ className }: { className?: string }) {
  const session = authClient.useSession();
  const user = session.data?.user;
  const isAuthenticated = !!user;

  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageContent, setMessageContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const currentUserId = user?.id ?? null;

  const fetchConversations = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
        if (!selectedConversation && data.length > 0) {
          setSelectedConversation(data[0].id);
        }
      } else if (res.status === 401) {
        toast.error("Please sign in to chat");
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, selectedConversation]);

  const fetchMessages = useCallback(
    async (convId: string) => {
      if (!isAuthenticated) return;
      try {
        const res = await fetch(`/api/conversations/${convId}/messages`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    },
    [isAuthenticated]
  );

  useEffect(() => {
    if (!open || !selectedConversation) return;
    fetchMessages(selectedConversation);
    const interval = setInterval(() => {
      fetchMessages(selectedConversation);
    }, 3000);
    return () => clearInterval(interval);
  }, [open, selectedConversation, fetchMessages]);

  useEffect(() => {
    if (!open) return;
    fetchConversations();
  }, [open, fetchConversations]);

  // Listen for external open requests (e.g., product page chat button)
  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ conversationId?: string }>;
      setOpen(true);
      if (custom.detail?.conversationId) {
        setSelectedConversation(custom.detail.conversationId);
      }
    };
    window.addEventListener("chatfab:open", handler);
    return () => window.removeEventListener("chatfab:open", handler);
  }, []);

  const sendMessage = useCallback(async () => {
    if (!selectedConversation || !messageContent.trim() || !isAuthenticated) {
      if (!isAuthenticated) {
        toast.error("Please sign in to chat");
      }
      return;
    }
    try {
      setSending(true);
      const res = await fetch(`/api/conversations/${selectedConversation}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: messageContent }),
      });

      if (res.ok) {
        const newMessage = await res.json();
        setMessages((prev) => [...prev, newMessage]);
        setMessageContent("");
        fetchConversations(); // refresh ordering
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
  }, [selectedConversation, messageContent, isAuthenticated, fetchConversations]);

  const openFab = useCallback(() => {
    if (!isAuthenticated) {
      toast.error("Please sign in to chat");
      return;
    }
    setOpen((prev) => !prev);
  }, [isAuthenticated]);

  const selectedConv = useMemo(
    () => conversations.find((c) => c.id === selectedConversation) ?? null,
    [conversations, selectedConversation]
  );

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2",
        className
      )}
    >
      {open && (
        <Card className="w-[440px] max-h-[620px] flex flex-col shadow-2xl border-emerald-100">
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <CardTitle className="text-base">Messages</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex flex-col flex-1">
            <div className="flex border-b">
              <div className="w-40 border-r max-h-64 overflow-y-auto">
                {loading ? (
                  <div className="p-3 text-sm text-muted-foreground">Loading...</div>
                ) : conversations.length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground">No conversations yet.</div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm hover:bg-emerald-50",
                        selectedConversation === conv.id && "bg-emerald-50"
                      )}
                    >
                      <div className="font-semibold">
                        {currentUserId === conv.customerId ? conv.sellerName : conv.customerName}
                      </div>
                      {conv.productName && (
                        <div className="text-xs text-muted-foreground truncate">{conv.productName}</div>
                      )}
                    </button>
                  ))
                )}
              </div>
              <div className="flex-1 flex flex-col">
                <div className="h-64 overflow-y-auto px-3 py-2 space-y-2">
                  {selectedConv ? (
                    messages.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No messages yet.</div>
                    ) : (
                      messages.map((msg) => {
                        const isOwn = msg.senderId === currentUserId;
                        return (
                          <div
                            key={msg.id}
                            className={cn("flex", isOwn ? "justify-end" : "justify-start")}
                          >
                            <div
                              className={cn(
                                "rounded-lg px-3 py-2 text-sm",
                                isOwn ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-900"
                              )}
                            >
                              {msg.content}
                            </div>
                          </div>
                        );
                      })
                    )
                  ) : (
                    <div className="text-sm text-muted-foreground">Select a conversation.</div>
                  )}
                </div>
                <div className="border-t p-2">
                  <div className="flex gap-2">
                    <Input
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Type your message..."
                      disabled={!selectedConversation || sending}
                    />
                    <Button
                      size="icon"
                      onClick={sendMessage}
                      disabled={!selectedConversation || !messageContent.trim() || sending}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        onClick={openFab}
        className="group inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-4 text-base font-semibold text-white shadow-xl shadow-emerald-600/30 transition hover:translate-y-[-1px] hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      >
        <MessageCircle className="h-7 w-7" />
        <span>{open ? "Close" : "Messages"}</span>
      </Button>
    </div>
  );
}

