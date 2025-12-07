"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
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
        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();

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
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return (
    <div className="min-w-[93%] max-w-[250%] flex justify-center mb-5">
      <Card className="w-full bg-white border-green-100 shadow-sm rounded-xl">
        <CardHeader className="flex flex-row justify-between items-center pb-2">
          <h1 className="font-semibold text-lg text-green-900">
            Recent Orders
          </h1>
          <Link
            href="/seller/orders"
            className="text-green-700 text-sm hover:underline"
          >
            View All
          </Link>
        </CardHeader>

        <CardContent className="space-y-3 pb-6">
          {loading && (
            <p className="text-sm text-gray-500 text-center">
              Loading recent orders...
            </p>
          )}

          {!loading && recentOrders.length === 0 && (
            <p className="text-sm text-gray-500 text-center">
              No recent orders found.
            </p>
          )}

          {recentOrders.map((recentOrders) => (
            <div
              key={recentOrders.orderId}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
            >
              <div className="flex flex-col">
                <span className="font-semibold">
                  Order #{recentOrders.orderId}
                </span>
                <p className="text-sm text-gray-600">
                  {recentOrders.shopName} •{" "}
                  {new Date(recentOrders.createdAt).toLocaleDateString()}
                </p>
              </div>

              <span className="font-bold text-green-700">
                ₱{recentOrders.total.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
