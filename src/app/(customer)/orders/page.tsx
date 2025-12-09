"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RefreshCw,
  Package,
  CheckCircle2,
  Truck,
  Clock,
  XCircle,
  ShoppingBag,
  AlertCircle,
  X,
} from "lucide-react";
import Image from "next/image";
import type { Order } from "@/types/orders";
import { toast } from "sonner";

const STATUS_MAP: Record<string, { label: string; tone: string; icon: React.ElementType }> = {
  pending: { label: "Pending", tone: "bg-amber-100 text-amber-800", icon: Clock },
  accepted: { label: "Accepted", tone: "bg-emerald-100 text-emerald-800", icon: CheckCircle2 },
  confirmed: { label: "Accepted", tone: "bg-emerald-100 text-emerald-800", icon: CheckCircle2 },
  rejected: { label: "Rejected", tone: "bg-red-100 text-red-800", icon: XCircle },
  cancelled: { label: "Cancelled", tone: "bg-slate-100 text-slate-800", icon: XCircle },
  shipped: { label: "Shipped", tone: "bg-blue-100 text-blue-800", icon: Truck },
  delivered: { label: "Delivered", tone: "bg-emerald-100 text-emerald-800", icon: Package },
};

function StatusBadge({ status }: { status?: string }) {
  const key = (status || "pending").toLowerCase();
  const config = STATUS_MAP[key] ?? STATUS_MAP.pending;
  const Icon = config.icon;
  return (
    <Badge className={`${config.tone} gap-1`} variant="secondary">
      <Icon className="h-4 w-4" />
      {config.label}
    </Badge>
  );
}

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const STATUS_TABS = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "rejected", label: "Rejected" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const fetchOrders = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      else setRefreshing(true);

      const res = await fetch("/api/orders");
      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Please sign in to view orders");
          return;
        }
        throw new Error("Failed to fetch orders");
      }
      const data = await res.json();
      setOrders(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Unable to load orders");
      } else {
        toast.error("Unable to load orders");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders(true);
  }, []);

  const grouped = useMemo(() => {
    return orders
      .map((o) => ({
        ...o,
        status: (o.status || o.payment?.status || "pending")?.toLowerCase(),
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: grouped.length };
    grouped.forEach((o) => {
      const key = o.status || "pending";
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [grouped]);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return grouped;
    return grouped.filter((o) => {
      const status = o.status || "pending";
      if (statusFilter === "accepted") {
        return status === "accepted" || status === "confirmed";
      }
      return status === statusFilter;
    });
  }, [grouped, statusFilter]);

  const markAsReceived = async (orderId: string) => {
    try {
      setActionId(orderId);
      const res = await fetch(`/api/orders?id=${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "delivered" }),
      });
      if (!res.ok) {
        throw new Error("Failed to update order");
      }
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId || o.orderId === orderId ? { ...o, status: "delivered" } : o
        )
      );
      toast.success("Thanks for confirming! Order marked as received.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Unable to load orders");
      } else {
        toast.error("Unable to load orders");
      }
    } finally {
      setActionId(null);
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order? The items will be returned to stock.")) {
      return;
    }
    try {
      setActionId(orderId);
      const res = await fetch(`/api/orders?id=${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (!res.ok) {
        throw new Error("Failed to cancel order");
      }
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId || o.orderId === orderId ? { ...o, status: "cancelled" } : o
        )
      );
      toast.success("Order cancelled successfully. Stock has been restored.");
      fetchOrders(false);
    } catch (error: any) {
      toast.error(error?.message || "Could not cancel order");
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>
        <Card>
          <CardContent className="space-y-3 p-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <div className="overflow-hidden rounded-2xl border bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 text-white shadow-lg">
        <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.18em] text-white/80">Orders</p>
            <h1 className="text-2xl font-semibold">My Orders</h1>
            <p className="text-sm text-white/80">Track your packages and stay updated in real time.</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fetchOrders(false)}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter} className="space-y-4">
        <TabsList className="flex w-full flex-wrap gap-2 bg-white">
          {STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
              <span>{tab.label}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                {statusCounts[tab.value] ?? 0}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={statusFilter} className="space-y-4">
          {grouped.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <ShoppingBag className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-slate-900">No orders yet</p>
                  <p className="text-sm text-muted-foreground">
                    Your purchases will show up here once you place an order.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => fetchOrders(false)}>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Retry fetch
                </Button>
              </CardContent>
            </Card>
          ) : filtered.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-semibold text-slate-900">No orders in this status</p>
                  <p className="text-sm text-muted-foreground">Try another tab to view your other orders.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filtered.map((order) => (
                <Card
                  key={order.id || order.orderId}
                  className="border border-emerald-100/60 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardHeader className="flex flex-row items-start justify-between gap-2">
                    <div className="space-y-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                          <Package className="h-4 w-4" />
                        </span>
                        Order #{order.id || order.orderId}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        Placed on {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {order.items?.length ? (
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 rounded-lg border bg-slate-50/60 p-3"
                          >
                            {item.productImage ? (
                              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                                <Image
                                  src={item.productImage}
                                  alt={item.productName || "Product"}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              </div>
                            ) : (
                              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-100">
                                <Package className="h-6 w-6 text-slate-400" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">
                                {item.productName || "Item"}
                              </p>
                              <p className="text-xs text-slate-500">Quantity: {item.quantity}</p>
                              <p className="text-xs font-semibold text-emerald-700">
                                ₱{Number(item.subtotal || 0).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        No items listed.
                      </p>
                    )}
                    <div className="flex justify-between text-sm font-semibold text-slate-900 pt-1">
                      <span>Total</span>
                      <span>₱{Number(order.total || 0).toFixed(2)}</span>
                    </div>
                    {order.payment?.paymentMethod && (
                      <p className="text-xs text-muted-foreground">
                        Payment method:{" "}
                        <span className="font-medium text-slate-900">{order.payment.paymentMethod}</span>
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 pt-2 justify-end">
                      {order.status === "pending" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => cancelOrder(order.id || order.orderId)}
                          disabled={actionId === (order.id || order.orderId)}
                          className="flex items-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          {actionId === (order.id || order.orderId) ? "Cancelling..." : "Cancel Order"}
                        </Button>
                      )}
                      {["accepted", "confirmed", "shipped"].includes(order.status || "") && (
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => markAsReceived(order.id || order.orderId)}
                          disabled={actionId === (order.id || order.orderId)}
                        >
                          {actionId === (order.id || order.orderId) ? "Saving..." : "Mark as received"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}

