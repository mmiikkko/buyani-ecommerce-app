"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { ShoppingCart, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Order } from "@/types/orders";

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

function adaptOrdersToRecent(raw: BackendOrder[]): Order[] {
  return raw.map((o) => ({
    orderId: String(o.id),
    buyerId: o.buyerId,
    addressId: o.addressId ?? null,
    total: Number(o.total ?? 0),
    createdAt: o.createdAt
      ? new Date(o.createdAt).toISOString()
      : new Date().toISOString(),
    shopName:
      o.items?.[0]?.product?.productName ??
      "Your Shop",
    items: [],
    status: o.status?.toLowerCase() || "pending",
  }));
}

type RecentOrdersProps = {
  orders: Order[];
};

export function RecentOrders({ orders }: RecentOrdersProps)  {
  const [recentOrders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/sellers/orders");
        if (!res.ok) {
          // Handle different error statuses
          if (res.status === 401) {
            // Session expired or unauthorized - this is expected, not an error
            setOrders([]);
            setLoading(false);
            return;
          }
          if (res.status === 503) {
            // Service unavailable - database connection issue
            // Silently handle this, user can retry later
            setOrders([]);
            setLoading(false);
            return;
          }
          throw new Error(`Failed to fetch orders: ${res.status}`);
        }

        const data = await res.json();

        // Handle error response
        if (data.error) {
          console.error("API error:", data.error);
          setOrders([]);
          setLoading(false);
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
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-row justify-between items-center pb-4">
        <div>
          <h1 className="text-xl font-bold text-[#2E7D32]">
            Recent Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Latest orders from your shop
          </p>
        </div>
        <Link
          href="/seller/orders"
          className="text-sm font-medium text-[#2E7D32] hover:text-[#2E7D32]/80 hover:underline transition-colors"
        >
          View All →
        </Link>
      </CardHeader>

      <CardContent className="space-y-3 pb-6">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">
              Loading recent orders...
            </p>
          </div>
        )}

        {!loading && recentOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              No recent orders found.
            </p>
          </div>
        )}

        {recentOrders.map((order) => {
          const status = order.status?.toLowerCase() || "pending";
          const isAccepted = status === "confirmed" || status === "accepted";
          const isRejected = status === "rejected";
          const isPending = !isAccepted && !isRejected;

          return (
            <div
              key={order.orderId}
              className={`flex justify-between items-center p-4 rounded-xl hover:shadow-md transition-all duration-200 border ${
                isRejected
                  ? "bg-gradient-to-r from-red-50/50 to-transparent border-red-100 hover:border-red-200"
                  : isAccepted
                  ? "bg-gradient-to-r from-emerald-50/50 to-transparent border-emerald-100 hover:border-emerald-200"
                  : "bg-gradient-to-r from-amber-50/50 to-transparent border-amber-100 hover:border-amber-200"
              }`}
            >
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">
                    Order #{order.orderId.slice(0, 8)}...
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-xs font-semibold ${
                      isAccepted
                        ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                        : isRejected
                        ? "bg-red-100 text-red-700 border-red-300"
                        : "bg-amber-100 text-amber-700 border-amber-300"
                    }`}
                  >
                    {isAccepted ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Accepted
                      </>
                    ) : isRejected ? (
                      <>
                        <XCircle className="h-3 w-3 mr-1" />
                        Rejected
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </>
                    )}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {order.shopName} • {new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                </p>
              </div>

              <span className={`font-bold text-lg ${
                isRejected ? "text-red-600" : isAccepted ? "text-[#2E7D32]" : "text-amber-600"
              }`}>
                ₱{order.total.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
