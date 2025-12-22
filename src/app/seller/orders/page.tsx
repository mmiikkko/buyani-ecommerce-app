"use client";

import { SellerOrdersSearchbar } from "../_components/seller-orders-searchbar";
import { OrdersTabsTable } from "../_components/seller-orders-table";
import { useState, useEffect, useCallback, useMemo } from "react";
import type { Order } from "../../../types/orders";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/lib/i18n/context";

export default function Orders() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("date-desc");

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
          throw new Error(t("unauthorized-login"));
        }
        throw new Error(t("failed-fetch-orders"));
      }

      const data: Order[] = await res.json();
      setOrders(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t("unknown-error");
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

    const interval = setInterval(() => {
      fetchOrders(false);
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleOrderStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      // Update payment status (which determines order status)
      const res = await fetch(`/api/payments?orderId=${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error(t("failed-update-order"));
      }

      toast.success(t("order-status-success"));

      // Refetch orders to get the latest data
      await fetchOrders(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t("failed-update-order");
      toast.error(errorMessage);
    }
  };

  // Calculate order counts by status
  const orderCounts = useMemo(() => {
    const counts = {
      all: orders.length,
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      walkIn: 0,
    };

    orders.forEach((order) => {
      const status = order.status?.toLowerCase() || order.payment?.status?.toLowerCase() || "";

      if (order.type === "walk-in") {
        counts.walkIn++;
      } else if (status === "pending") {
        counts.pending++;
      } else if (status === "confirmed" || status === "accepted") {
        counts.confirmed++;
      } else if (status === "shipped") {
        counts.shipped++;
      } else if (status === "delivered" || status === "completed" || status === "complete") {
        counts.delivered++;
      } else if (status === "cancelled" || status === "rejected") {
        counts.cancelled++;
      }
    });

    return counts;
  }, [orders]);

  if (loading) {
    return (
      <section className="relative min-h-screen min-w-[80%] max-w-[100%] overflow-hidden space-y-5 mt-18 mx-3">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl mb-1 font-bold text-[#2E7D32]">{t("orders")}</h1>
            <p>{t("manage-orders")}</p>
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
            <p>Manage your online and walk-in orders</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600 mb-2">{t("error")}: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-blue-600 hover:underline"
            >
              {t("try-again")}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen min-w-[80%] max-w-[100%] overflow-hidden space-y-5 mx-3">
      <div className="flex flex-row justify-between items-start">
        <div className="flex flex-col">
          <h1 className="text-xl mb-1 font-bold text-[#2E7D32]">{t("orders")}</h1>
          <p>{t("manage-orders")}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchOrders(false)}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {t("refresh")}
        </Button>
      </div>

      <SellerOrdersSearchbar
        currentFilter={filter}
        onFilterChange={setFilter}
        currentSort={sort}
        onSortChange={setSort}
        onSearchChange={setSearch}
        orderCounts={orderCounts}
      />
      <OrdersTabsTable
        ordersData={orders}
        filter={filter}
        search={search}
        sort={sort}
        onStatusUpdate={handleOrderStatusUpdate}
        onRefresh={() => fetchOrders(false)}
      />
    </section>
  );
}
