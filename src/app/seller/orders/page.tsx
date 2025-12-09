"use client";

import { SellerOrdersSearchbar } from "../_components/seller-orders-searchbar";
import { OrdersTabsTable } from "../_components/seller-orders-table";
import { useState, useEffect, useCallback } from "react";
import type { Order } from "../../../types/orders";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  // Fetch orders from API
  const fetchOrders = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setError(null);
      
      const res = await fetch("/api/sellers/orders");
      
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized. Please log in.");
        }
        throw new Error("Failed to fetch orders");
      }
      
      const data: Order[] = await res.json();
      setOrders(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      if (showLoading) {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(true);
  }, [fetchOrders]);

  // Handle order status update
  const handleOrderStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      // Update payment status (which determines order status)
      const res = await fetch(`/api/payments?orderId=${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update order status");
      }

      if (newStatus === "confirmed" || newStatus === "accepted") {
        toast.success("Order confirmed successfully");
      } else if (newStatus === "rejected") {
        toast.success("Order rejected successfully");
      } else if (newStatus === "shipped") {
        toast.success("Order marked as shipped");
      } else if (newStatus === "delivered") {
        toast.success("Order delivered successfully");
      } else {
        toast.success("Order updated successfully");
      }
      
      // Refetch orders to get the latest data
      await fetchOrders(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update order";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <section className="relative min-h-screen min-w-[80%] max-w-[100%] overflow-hidden space-y-5 mt-18 mx-3">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl mb-1 font-bold text-[#2E7D32]">Orders</h1>
            <p>Manage your online and in-store orders</p>
          </div>
        </div>
        <div className="w-full p-6 bg-green-50 min-h-screen space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative min-h-screen min-w-[80%] max-w-[100%] overflow-hidden space-y-5 mt-18 mx-3">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl mb-1 font-bold text-[#2E7D32]">Orders</h1>
            <p>Manage your online and in-store orders</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen min-w-[80%] max-w-[100%] overflow-hidden space-y-5 mt-18 mx-3">
      <div className="flex flex-row justify-between items-start">
        <div className="flex flex-col">
          <h1 className="text-xl mb-1 font-bold text-[#2E7D32]">Orders</h1>
          <p>Manage your online and in-store orders</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchOrders(false)}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
      
      <SellerOrdersSearchbar
        onFilterChange={setFilter}
        onSearchChange={setSearch}
      />
      <OrdersTabsTable 
        ordersData={orders}
        filter={filter}
        search={search}
        onStatusUpdate={handleOrderStatusUpdate}
        onRefresh={() => fetchOrders(false)}
      />
    </section>
  );
}
