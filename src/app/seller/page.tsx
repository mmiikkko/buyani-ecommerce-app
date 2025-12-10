// app/seller/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { CardActivity } from "./_components/cards-activity";
import { RecentOrders } from "./_components/cards-recentorders";
import { ChartAreaIcons } from "./_components/cards-chart";
import { FrequentBought } from "./_components/cards-frequentbought";
import { Order } from "@/types/orders";
import { Store, Loader2 } from "lucide-react";

type DateRange = "7" | "30" | "90" | "365" | "all";

export default function SellerDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    activeProducts: 0,
    removedProducts: 0,
  });

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsDateRange, setStatsDateRange] = useState<DateRange>("all");

  const fetchStats = useCallback(async (range: DateRange) => {
    try {
      const params = new URLSearchParams();
      if (range !== "all") {
        params.append("days", range);
      }
      const statsRes = await fetch(`/api/sellers/stats?${params.toString()}`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch stats and recent orders in parallel for faster loading
        const [statsRes, ordersRes] = await Promise.all([
          fetch(`/api/sellers/stats?${statsDateRange !== "all" ? `days=${statsDateRange}` : ""}`),
          fetch("/api/sellers/recent-orders")
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (ordersRes.ok) {
          const ordersData: Order[] = await ordersRes.json();
          setRecentOrders(ordersData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [statsDateRange]);

  return (
    <div className="relative min-h-screen min-w-full overflow-hidden space-y-6 pt-17 px-6">
      {/* Enhanced Header */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#2E7D32]/10">
            <Store className="h-6 w-6 text-[#2E7D32]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#2E7D32]">
              Welcome back
            </h1>
            <p className="text-muted-foreground mt-1">
              Here&apos;s what&apos;s happening with your store today
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <section className="w-full">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p>Loading dashboard stats...</p>
            </div>
          </div>
        ) : (
          <CardActivity
            totalSales={`₱${Number(stats.totalSales).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            totalOrders={stats.totalOrders}
            pendingOrders={stats.pendingOrders}
            totalProducts={stats.totalProducts}
            removedProducts={stats.removedProducts}
            dateRange={statsDateRange}
            onDateRangeChange={(range) => {
              setStatsDateRange(range);
              fetchStats(range);
            }}
          />
        )}
      </section>

      {/* Recent Orders */}
      <section className="w-full">
        <RecentOrders orders={recentOrders} />
      </section>

      {/* Charts and Stats */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <ChartAreaIcons />
        <FrequentBought />
      </section>
    </div>
  );
}
