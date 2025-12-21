"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { ShoppingCart, CheckCircle2, XCircle, Clock, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Order } from "@/types/orders";
import { useLanguage } from "@/lib/i18n/context";
import { OrderDetailsModal } from "./order-details-modal";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

function getShortOrderId(id: string) {
  if (!id) return "N/A";
  if (id.startsWith("HUB-")) return id;
  return `HUB-${id.substring(0, 4).toUpperCase()}`;
}

/**
 * Adapter: backend Order -> RecentOrder shape
 * This prevents Invalid Date / NaN issues
 */

type BackendOrder = {
  id: string;
  buyerId: string;
  addressId: string | null;
  total: number | null;
  createdAt: string | Date;
  status?: string;
  items: {
    product: {
      productName: string;
    } | null;
  }[];
};

function adaptOrdersToRecent(raw: any[]): Order[] {
  return raw.map((o) => ({
    orderId: String(o.id || o.orderId),
    id: String(o.id),
    buyerId: o.buyerId || "",
    buyerName: o.customer || o.buyerName || "",
    addressId: o.addressId ?? null,
    total: Number(o.total ?? o.amount ?? 0),
    createdAt: o.createdAt
      ? new Date(o.createdAt).toISOString()
      : new Date().toISOString(),
    shopName:
      o.shopName ||
      o.items?.[0]?.product?.productName ||
      "Your Shop",
    items: o.items || [],
    status: o.status?.toLowerCase() || "pending",
    type: o.type || "online",
  }));
}

type RecentOrdersProps = {
  orders: Order[];
};

export function RecentOrders({ orders }: RecentOrdersProps) {
  const { t } = useLanguage();
  const [recentOrders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const hasInitialFetched = useRef(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);


  const fetchOrders = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const res = await fetch("/api/sellers/orders");
      if (!res.ok) {
        // Handle different error statuses
        if (res.status === 401) {
          // Session expired or unauthorized - this is expected, not an error
          setOrders([]);
          if (showLoading) setLoading(false);
          setInitialLoading(false);
          return;
        }
        if (res.status === 503) {
          // Service unavailable - database connection issue
          // Silently handle this, user can retry later
          setOrders([]);
          if (showLoading) setLoading(false);
          setInitialLoading(false);
          return;
        }
        throw new Error(`Failed to fetch orders: ${res.status}`);
      }

      const data = await res.json();

      // Handle error response
      if (data.error) {
        console.error("API error:", data.error);
        setOrders([]);
        if (showLoading) setLoading(false);
        setInitialLoading(false);
        return;
      }

      // Normalize + only show latest 5
      const recent = adaptOrdersToRecent(data)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
        .slice(0, 5);

      setOrders(recent);
    } catch (error) {
      console.error("RecentOrders error:", error);
      setOrders([]); // Set empty array on error
    } finally {
      if (showLoading) setLoading(false);
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    // Use orders prop if available (from parent), otherwise fetch
    if (orders && orders.length > 0) {
      // Ensure orders have orderId property for consistency
      const normalizedOrders = orders.map(order => ({
        ...order,
        orderId: order.orderId || (order as any).id || "",
        items: order.items || [],
      }));
      const recent = normalizedOrders
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
        .slice(0, 5);
      setOrders(recent);
      setInitialLoading(false);
      hasInitialFetched.current = true;
    } else {
      // Only show loading on initial load
      const isInitial = !hasInitialFetched.current;
      if (isInitial) {
        hasInitialFetched.current = true;
      }
      fetchOrders(isInitial);
    }

    // Refresh orders silently every 10 seconds (less frequent for better performance)
    const interval = setInterval(() => {
      if (!orders || orders.length === 0) {
        fetchOrders(false);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchOrders, orders]);

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-row justify-between items-center pb-4">
        <div>
          <h1 className="text-xl font-bold text-[#2E7D32]">
            {t("recent-orders")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("latest-orders-shop")}
          </p>
        </div>
        <Link
          href="/seller/orders"
          className="text-sm font-medium text-[#2E7D32] hover:text-[#2E7D32]/80 hover:underline transition-colors"
        >
          {t("view-all")} →
        </Link>
      </CardHeader>

      <CardContent className="space-y-3 pb-6">
        {initialLoading && (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">
              {t("loading-recent-orders")}
            </p>
          </div>
        )}

        {!initialLoading && recentOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              {t("no-recent-orders")}
            </p>
          </div>
        )}

        {recentOrders.map((order, index) => {
          const status = order.status?.toLowerCase() || "pending";
          const isAccepted = status === "confirmed" || status === "accepted";
          const isRejected = status === "rejected";
          const isShipped = status === "shipped";
          const isCompleted = status === "completed" || status === "complete";
          const isDelivered = status === "delivered";

          // Determine status display
          let statusLabel = t("order-status-pending");
          let statusIcon = Clock;
          let statusColor = "bg-amber-100 text-amber-700 border-amber-300";
          let bgColor = "bg-gradient-to-r from-amber-50/50 to-transparent border-amber-100 hover:border-amber-200";
          let textColor = "text-amber-600";

          if (isRejected) {
            statusLabel = t("rejected");
            statusIcon = XCircle;
            statusColor = "bg-red-100 text-red-700 border-red-300";
            bgColor = "bg-gradient-to-r from-red-50/50 to-transparent border-red-100 hover:border-red-200";
            textColor = "text-red-600";
          } else if (isDelivered || isCompleted) {
            statusLabel = isDelivered ? t("delivered") : t("completed");
            statusIcon = CheckCircle2;
            statusColor = "bg-emerald-100 text-emerald-700 border-emerald-300";
            bgColor = "bg-gradient-to-r from-emerald-50/50 to-transparent border-emerald-100 hover:border-emerald-200";
            textColor = "text-[#2E7D32]";
          } else if (isShipped) {
            statusLabel = t("shipped");
            statusIcon = Truck;
            statusColor = "bg-blue-100 text-blue-700 border-blue-300";
            bgColor = "bg-gradient-to-r from-blue-50/50 to-transparent border-blue-100 hover:border-blue-200";
            textColor = "text-blue-600";
          } else if (isAccepted) {
            statusColor = "bg-emerald-100 text-emerald-700 border-emerald-300";
            bgColor = "bg-gradient-to-r from-emerald-50/50 to-transparent border-emerald-100 hover:border-emerald-200";
            textColor = "text-[#2E7D32]";
          }

          if (order.type === "walk-in") {
            statusLabel = "Walk-in Transaction";
            statusColor = "bg-purple-100 text-purple-700 border-purple-300";
            bgColor = "bg-gradient-to-r from-purple-50/50 to-transparent border-purple-100 hover:border-purple-200";
            textColor = "text-purple-600";
          }

          const StatusIcon = statusIcon;

          const orderId = order.id || order.orderId || "";
          const firstImage = order.items?.[0]?.productImage;

          return (
            <div
              key={`${orderId}-${index}`}
              className={`flex items-center p-4 rounded-xl hover:shadow-md transition-all duration-200 border ${bgColor} gap-4`}
            >
              {/* Action Button - Left */}
              <div className="shrink-0 mr-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedOrder(order);
                    setDetailsOpen(true);
                  }}
                  className="text-[#2E7D32] border-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition-all font-medium min-w-[70px]"
                >
                  {t("view")}
                </Button>
              </div>

              {/* Product Image */}
              <div className="h-12 w-12 rounded-lg bg-white border border-slate-200 shrink-0 overflow-hidden relative shadow-sm">
                {firstImage ? (
                  <img
                    src={firstImage}
                    alt="Product"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-slate-50">
                    <ShoppingCart className="h-5 w-5 text-slate-300" />
                  </div>
                )}
              </div>

              {/* Order Info - Center */}
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-900 truncate">
                    #{getShortOrderId(orderId)}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] h-5 font-semibold px-2 ${statusColor} whitespace-nowrap`}
                  >
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusLabel}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate opacity-80">
                  {order.buyerName || t("unknown-customer")} • {new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric"
                  })}
                </p>
              </div>

              {/* Amount - Right */}
              <div className="text-right shrink-0 ml-2">
                <span className={`font-bold text-base ${textColor}`}>
                  ₱{(order.total ?? 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>

      <OrderDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        order={selectedOrder}
      />
    </Card >
  );
}
