"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

type Order = {
  id: string;
  status: "pending" | "confirmed" | "delivered" | string;
  customer: string;
  date: string;
  amount: string | number;
};

export function RecentOrders({ orders = [] }: { orders?: Order[] }) {

  const statusColors: Record<string, string> = {
    pending: "bg-orange-100 text-orange-700",
    confirmed: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
  };

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

          {orders.map((order, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{order.id}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full capitalize ${
                      statusColors[order.status] ?? "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {order.customer} • {order.date}
                </p>
              </div>
              <span className="font-bold text-green-700">
                {typeof order.amount === "number" ? `₱${order.amount}` : order.amount}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
