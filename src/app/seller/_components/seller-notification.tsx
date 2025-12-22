// app/seller/_components/seller-notifications-card.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, X, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

interface SellerNotification {
  id: string;
  sellerId: string;
  billingId: string | null;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  sentBy: string | null;
  createdAt: string;
  readAt: string | null;
}

export function SellerNotificationsCard() {
  const [notifications, setNotifications] = useState<SellerNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/seller-notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const res = await fetch("/api/seller-notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });

      if (res.ok) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId
              ? { ...notif, isRead: true, readAt: new Date().toISOString() }
              : notif
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const displayedNotifications = showAll
    ? notifications
    : notifications.slice(0, 3);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "payment_reminder":
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "info":
        return <Bell className="h-4 w-4 text-blue-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-6">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No notifications yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <ScrollArea className={showAll ? "h-[400px]" : "h-auto"}>
              {displayedNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-lg border mb-2 transition-all ${
                    notif.isRead
                      ? "bg-gray-50 border-gray-200"
                      : "bg-amber-50 border-amber-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1">
                      <div className="mt-0.5">
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-gray-900">
                            {notif.title}
                          </h4>
                          {!notif.isRead && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-amber-100 text-amber-700"
                            >
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {notif.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(notif.createdAt), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                    </div>
                    {!notif.isRead && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markAsRead(notif.id)}
                        className="h-8 w-8 p-0"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>

            {notifications.length > 3 && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Show Less" : `View All (${notifications.length})`}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}