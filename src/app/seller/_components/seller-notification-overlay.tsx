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
import { Bell, CheckCircle2, Store, Calendar, CreditCard, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

    // Aesthetic Parse Logic
    // Expected Format from Backend:
    // Subject: {title}
    // Store: {shopName}
    // Due Date: {date}
    // Amount Due: {amount}
    //
    // Note from Admin:
    // {message}

    const isStructured = currentNotification.message.includes("Note from Admin:");
    let parsedData = {
        store: "",
        dueDate: "",
        amountDue: "",
        adminNote: currentNotification.message
    };

    if (isStructured) {
        const lines = currentNotification.message.split('\n');
        const storeLine = lines.find(l => l.startsWith("Store:"));
        const dateLine = lines.find(l => l.startsWith("Due Date:"));
        const amountLine = lines.find(l => l.startsWith("Amount Due:"));

        // Extract Admin Note (everything after "Note from Admin:")
        const noteIndex = lines.findIndex(l => l.includes("Note from Admin:"));
        const adminNote = noteIndex !== -1 ? lines.slice(noteIndex + 1).join('\n').trim() : "No message";

        parsedData = {
            store: storeLine ? storeLine.replace("Store:", "").trim() : "",
            dueDate: dateLine ? dateLine.replace("Due Date:", "").trim() : "",
            amountDue: amountLine ? amountLine.replace("Amount Due:", "").trim() : "",
            adminNote: adminNote
        };
    }

    return (
        <Dialog open={open} onOpenChange={(val) => !val && handleDismiss()}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 shadow-2xl rounded-2xl bg-white">
                {/* Decorative Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-green-500 p-6 text-white pb-8">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                                <Bell className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold tracking-tight">{currentNotification.title}</h2>
                                <p className="text-emerald-100 text-xs mt-0.5">
                                    {new Date(currentNotification.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="px-6 -mt-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
                        {isStructured ? (
                            <>
                                <div className="text-center py-2 border-b border-gray-50 pb-4">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount Due</span>
                                    <div className="text-4xl font-extrabold text-emerald-600 mt-1">
                                        {parsedData.amountDue}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                                            <Calendar className="w-3.5 h-3.5" /> Due Date
                                        </div>
                                        <span className="font-semibold text-gray-900">{parsedData.dueDate}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                                            <Store className="w-3.5 h-3.5" /> Store
                                        </div>
                                        <span className="font-semibold text-gray-900 truncate" title={parsedData.store}>
                                            {parsedData.store}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                        <AlertCircle className="w-4 h-4 text-orange-500" />
                                        Note from Admin
                                    </div>
                                    <div className="bg-orange-50/50 p-3 rounded-lg text-sm text-gray-600 border border-orange-100/50">
                                        {parsedData.adminNote || <span className="italic text-gray-400">No additional notes</span>}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="py-4">
                                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {currentNotification.message}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="p-6 bg-gray-50/50 flex flex-row items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground font-medium">
                        Notification {currentIndex + 1} of {notifications.length}
                    </span>
                    <Button
                        onClick={handleDismiss}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                    >
                        {currentIndex < notifications.length - 1 ? "Next Message" : "Acknowledge"}
                        <CheckCircle2 className="w-4 h-4 ml-2" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
