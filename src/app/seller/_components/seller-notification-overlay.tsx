"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell, X } from "lucide-react";

type Notification = {
    id: string;
    title: string;
    message: string;
    type: string;
    createdAt: string;
};

export function SellerNotificationOverlay() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchNotifications();
        // Check for new notifications every minute
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/seller/notifications");
            if (res.ok) {
                const data = await res.json();
                if (data.notifications && data.notifications.length > 0) {
                    setNotifications(data.notifications);
                    setOpen(true);
                }
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const markAsRead = async (notificationId: string) => {
        try {
            await fetch("/api/seller/notifications", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notificationId }),
            });
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const handleDismiss = async () => {
        const current = notifications[currentIndex];
        if (current) {
            await markAsRead(current.id);
        }

        // Show next notification or close
        if (currentIndex < notifications.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setOpen(false);
            setNotifications([]);
            setCurrentIndex(0);
        }
    };

    if (notifications.length === 0) {
        return null;
    }

    const currentNotification = notifications[currentIndex];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-orange-500" />
                        <DialogTitle>{currentNotification.title}</DialogTitle>
                    </div>
                    <DialogDescription className="text-xs text-gray-500">
                        {new Date(currentNotification.createdAt).toLocaleString()}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {currentNotification.message}
                    </p>
                </div>

                <DialogFooter className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                        {currentIndex + 1} of {notifications.length}
                    </span>
                    <Button onClick={handleDismiss} className="bg-green-600 hover:bg-green-700">
                        {currentIndex < notifications.length - 1 ? "Next" : "Got it"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
