"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

import type { Order } from "@/types/orders";

export function RecentOrders({ orders = [] }: { orders?: Order[] }) {
  return (
    <div className="min-w-[93%] max-w-[250%] flex flex-wrap gap-4 items-center justify-center mb-5">
      <Card className="min-w-[100%] max-w-[250%] flex flex-col bg-white border-green-100 shadow-sm rounded-xl">
        <CardHeader className="flex flex-row justify-between items-center pb-2">
          <h1 className="font-semibold text-lg text-green-900">
            Recent Orders
          </h1>
          <Link href="/seller/orders" className="text-green-700 text-sm hover:underline cursor-pointer">
            View All
          </Link>
        </CardHeader>

        <CardContent className="space-y-3 pb-6">
          {orders.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-4">
              No recent orders found.
            </p>
          )}

          {orders.map((order) => (
            <div
              key={order.orderId}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
            >
              <div className="flex flex-col">
                {/* Order ID + Shop Name */}
                <span className="font-semibold">{order.orderId}</span>
                <p className="text-sm text-gray-600">
                  {order.shopName} • {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Total Amount */}
              <span className="font-bold text-green-700">
                ₱{Number(order.total).toLocaleString("en-US", {
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
