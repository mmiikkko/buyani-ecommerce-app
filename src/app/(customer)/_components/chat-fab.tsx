"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { MessageCircle, Send, X, Search, User, Store, Trash2 } from "lucide-react";
import { authClient } from "@/server/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const messageInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageContent, setMessageContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  const currentUserId = user?.id ?? null;

  const fetchConversations = useCallback(async (showLoading = false) => {
    if (!isAuthenticated) return;
    try {
      if (showLoading) setLoading(true);
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
      if (showLoading) setLoading(false);
      setInitialLoading(false);
    }
  }, [isAuthenticated, selectedConversation]);

  const fetchMessages = useCallback(
    async (convId: string) => {
      if (!isAuthenticated) return;
      try {
        const res = await fetch(`/api/conversations/${convId}/messages`);
        if (res.ok) {
          const data = await res.json();
          // Deduplicate messages by ID to prevent duplicate keys
          const uniqueMessages = Array.from(
            new Map(data.map((msg: Message) => [msg.id, msg])).values()
          ) as Message[];
          setMessages(uniqueMessages);
          
          // Update unread count for this conversation (messages are marked as read when fetched)
          if (open && selectedConversation === convId) {
            setUnreadCounts((prev) => ({ ...prev, [convId]: 0 }));
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    },
    [isAuthenticated, open, selectedConversation]
  );

  // Fetch unread counts for all conversations
  const fetchUnreadCounts = useCallback(async (convs: Conversation[]) => {
    if (!isAuthenticated || !currentUserId || convs.length === 0) return;
    
    try {
      const counts: Record<string, number> = {};
      await Promise.all(
        convs.map(async (conv) => {
          try {
            const res = await fetch(`/api/conversations/${conv.id}/messages`);
            if (res.ok) {
              const msgs = await res.json();
              const unread = msgs.filter(
                (m: Message) => m.senderId !== currentUserId && !m.isRead
              ).length;
              counts[conv.id] = unread;
            }
          } catch (error) {
            console.error(`Error fetching unread count for conversation ${conv.id}:`, error);
          }
        })
      );
      setUnreadCounts(counts);
    } catch (error) {
      console.error("Error fetching unread counts:", error);
    }
  }, [isAuthenticated, currentUserId]);

  // Calculate total unread count
  const totalUnreadCount = useMemo(() => {
    return Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
  }, [unreadCounts]);

  useEffect(() => {
    if (!open || !selectedConversation) return;
    fetchMessages(selectedConversation);
    // Poll for new messages silently in the background
    const interval = setInterval(() => {
      fetchMessages(selectedConversation);
    }, 3000);
    return () => clearInterval(interval);
  }, [open, selectedConversation, fetchMessages]);

  useEffect(() => {
    if (!open) return;
    // Only show loading on initial open
    fetchConversations(initialLoading);
    // Refresh conversations silently every 5 seconds
    const interval = setInterval(() => {
      fetchConversations(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [open, fetchConversations, initialLoading]);

  // Fetch unread counts when conversations change or periodically
  useEffect(() => {
    if (!isAuthenticated || conversations.length === 0) return;
    fetchUnreadCounts(conversations);
    // Refresh unread counts every 5 seconds
    const interval = setInterval(() => {
      fetchUnreadCounts(conversations);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated, conversations, fetchUnreadCounts]);

  // Listen for external open requests (e.g., product page chat button)
  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ conversationId?: string }>;
      setOpen(true);
      if (custom.detail?.conversationId) {
        setSelectedConversation(custom.detail.conversationId);
        // Fetch messages immediately when opening with a conversation
        fetchMessages(custom.detail.conversationId);
        // Auto-focus message input after a short delay to ensure it's rendered
        setTimeout(() => {
          messageInputRef.current?.focus();
        }, 100);
      }
    };
    window.addEventListener("chatfab:open", handler);
    return () => window.removeEventListener("chatfab:open", handler);
  }, [fetchMessages]);

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
        setMessages((prev) => {
          // Check if message already exists to prevent duplicates
          const exists = prev.some((msg) => msg.id === newMessage.id);
          if (exists) return prev;
          return [...prev, newMessage];
        });
        setMessageContent("");
        // Refresh conversations silently in the background
        fetchConversations(false);
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

  const handleDeleteConversation = useCallback(async () => {
    if (!conversationToDelete || !isAuthenticated) return;

    try {
      setDeleting(true);
      const res = await fetch(`/api/conversations?id=${conversationToDelete}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Conversation deleted");
        // Remove from local state
        setConversations((prev) => prev.filter((c) => c.id !== conversationToDelete));
        
        // If deleted conversation was selected, clear selection
        if (selectedConversation === conversationToDelete) {
          setSelectedConversation(null);
          setMessages([]);
        }
        
        setConversationToDelete(null);
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to delete conversation");
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast.error("Failed to delete conversation");
    } finally {
      setDeleting(false);
    }
  }, [conversationToDelete, isAuthenticated, selectedConversation]);

  const selectedConv = useMemo(
    () => conversations.find((c) => c.id === selectedConversation) ?? null,
    [conversations, selectedConversation]
  );

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.toLowerCase();
    return conversations.filter(
      (conv) =>
        (currentUserId === conv.customerId ? conv.sellerName : conv.customerName)
          .toLowerCase()
          .includes(query) ||
        conv.productName?.toLowerCase().includes(query)
    );
  }, [conversations, searchQuery, currentUserId]);

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2",
        className
      )}
    >
      {open && (
        <Card className="w-[700px] h-[600px] flex flex-col shadow-2xl border-emerald-100 overflow-hidden">
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between py-4 px-6 bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-b border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 rounded-lg">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-lg font-bold text-gray-800">Messages</CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setOpen(false)}
              className="hover:bg-emerald-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>

          <CardContent className="p-0 flex flex-col flex-1 overflow-hidden">
            <div className="flex h-full">
              {/* Conversations List - Left Side */}
              <div className="w-[280px] border-r border-gray-200 flex flex-col bg-gray-50/50">
                {/* Search Bar */}
                <div className="p-3 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search conversations..."
                      className="pl-10 h-9 text-sm bg-white border-gray-200"
                    />
                  </div>
                </div>

                {/* Conversations */}
                <div className="flex-1 overflow-y-auto">
                  {initialLoading ? (
                    <div className="p-4 text-sm text-gray-500 text-center">Loading...</div>
                  ) : filteredConversations.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500 text-center">
                      {searchQuery ? "No conversations found." : "No conversations yet."}
                    </div>
                  ) : (
                    <div className="py-2">
                      {filteredConversations.map((conv) => {
                        const contactName = currentUserId === conv.customerId ? conv.sellerName : conv.customerName;
                        const isSelected = selectedConversation === conv.id;
                        const unreadCount = unreadCounts[conv.id] || 0;
                        return (
                          <div
                            key={conv.id}
                            className={cn(
                              "group relative w-full px-4 py-3 hover:bg-emerald-50 transition-colors border-l-4 border-transparent",
                              isSelected && "bg-emerald-50 border-emerald-600",
                              unreadCount > 0 && !isSelected && "bg-emerald-50/30"
                            )}
                          >
                            <button
                              onClick={() => setSelectedConversation(conv.id)}
                              className="w-full text-left"
                            >
                              <div className="flex items-start gap-3">
                                <div className={cn(
                                  "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold relative",
                                  isSelected ? "bg-emerald-600" : "bg-gray-400"
                                )}>
                                  {currentUserId === conv.customerId ? (
                                    <Store className="h-5 w-5" />
                                  ) : (
                                    <User className="h-5 w-5" />
                                  )}
                                  {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 border-2 border-white"></span>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className={cn(
                                      "font-semibold text-sm truncate",
                                      isSelected ? "text-emerald-700" : "text-gray-800",
                                      unreadCount > 0 && !isSelected && "font-bold"
                                    )}>
                                      {contactName}
                                    </div>
                                    {unreadCount > 0 && (
                                      <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-red-600 text-white text-xs font-bold">
                                        {unreadCount > 99 ? "99+" : unreadCount}
                                      </span>
                                    )}
                                  </div>
                                  {conv.productName && (
                                    <div className="text-xs text-gray-500 truncate mt-0.5">
                                      {conv.productName}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setConversationToDelete(conv.id);
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-red-100 text-red-600"
                              title="Delete conversation"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Area - Right Side */}
              <div className="flex-1 flex flex-col bg-white">
                {selectedConv ? (
                  <>
                    {/* Chat Header */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                          {currentUserId === selectedConv.customerId ? (
                            <Store className="h-5 w-5" />
                          ) : (
                            <User className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">
                            {currentUserId === selectedConv.customerId 
                              ? selectedConv.sellerName 
                              : selectedConv.customerName}
                          </div>
                          {selectedConv.productName && (
                            <div className="text-xs text-gray-500">{selectedConv.productName}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                      <div className="space-y-3">
                        {messages.length === 0 ? (
                          <div className="text-center text-gray-500 py-8">
                            <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">No messages yet. Start the conversation!</p>
                          </div>
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
                                    "rounded-2xl px-4 py-2 max-w-[70%] shadow-sm",
                                    isOwn 
                                      ? "bg-emerald-600 text-white rounded-br-md" 
                                      : "bg-gray-100 text-gray-900 rounded-bl-md"
                                  )}
                                >
                                  <p className="text-sm leading-relaxed">{msg.content}</p>
                                  <p className={cn(
                                    "text-xs mt-1",
                                    isOwn ? "text-emerald-100" : "text-gray-500"
                                  )}>
                                    {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Message Input */}
                    <div className="border-t border-gray-200 p-4 bg-gray-50/50">
                      <div className="flex gap-2">
                        <Input
                          ref={messageInputRef}
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
                          className="flex-1 bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                        <Button
                          size="icon"
                          onClick={sendMessage}
                          disabled={!selectedConversation || !messageContent.trim() || sending}
                          className="bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-md"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 font-medium">Select a conversation to start messaging</p>
                      <p className="text-sm text-gray-400 mt-2">Choose someone from the list to begin</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Floating Action Button */}
      <Button
        onClick={openFab}
        size="icon"
        className="group relative rounded-full bg-emerald-600 w-16 h-16 text-white shadow-xl shadow-emerald-600/30 transition-all hover:translate-y-[-2px] hover:bg-emerald-700 hover:shadow-2xl hover:shadow-emerald-600/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      >
        <MessageCircle className="h-9 w-9" />
        {totalUnreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-lg">
            {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
          </span>
        )}
      </Button>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!conversationToDelete} onOpenChange={(open) => !open && setConversationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone and all messages will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConversation}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

