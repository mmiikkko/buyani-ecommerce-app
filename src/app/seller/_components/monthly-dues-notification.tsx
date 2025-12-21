"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type DueNotification = {
    id: string;
    billingMonth: string;
    amountDue: number;
    dueDate: string;
    daysUntilDue: number;
    isOverdue: boolean;
    urgency: "overdue" | "urgent" | "upcoming";
    message: string;
};

type NotificationData = {
    notifications: DueNotification[];
    hasUpcomingDues: boolean;
    overdueCount: number;
};

export function MonthlyDuesNotification() {
    const [data, setData] = useState<NotificationData | null>(null);
    const [dismissed, setDismissed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await fetch("/api/seller/notifications/dues");
                if (res.ok) {
                    const notifData = await res.json();
                    setData(notifData);
                }
            } catch (error) {
                console.error("Error fetching due notifications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
        // Refresh every 5 minutes
        const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (loading || !data || !data.hasUpcomingDues || dismissed) {
        return null;
    }

    const mostUrgent = data.notifications[0];
    const variant = mostUrgent.isOverdue ? "destructive" : "default";

    return (
        <Alert variant={variant} className="mb-6 relative">
            <div className="flex items-start gap-3">
                {mostUrgent.isOverdue ? (
                    <AlertCircle className="h-5 w-5 mt-0.5" />
                ) : (
                    <Bell className="h-5 w-5 mt-0.5" />
                )}
                <div className="flex-1">
                    <AlertTitle className="font-bold text-lg mb-2">
                        {mostUrgent.isOverdue ? "⚠️ Overdue Payment" : "📅 Upcoming Payment Due"}
                    </AlertTitle>
                    <AlertDescription className="space-y-2">
                        <p className="font-medium">{mostUrgent.message}</p>
                        <p className="text-sm">
                            Amount: <span className="font-bold">₱{mostUrgent.amountDue.toFixed(2)}</span>
                        </p>
                        {data.notifications.length > 1 && (
                            <p className="text-sm opacity-90">
                                + {data.notifications.length - 1} more {data.notifications.length === 2 ? "bill" : "bills"} upcoming
                            </p>
                        )}
                        <Link href="/seller/monthly-dues">
                            <Button
                                variant={mostUrgent.isOverdue ? "secondary" : "outline"}
                                size="sm"
                                className="mt-2"
                            >
                                View All Dues →
                            </Button>
                        </Link>
                    </AlertDescription>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 absolute top-2 right-2"
                    onClick={() => setDismissed(true)}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </Alert>
    );
}
