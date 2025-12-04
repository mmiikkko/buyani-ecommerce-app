"use client";
import { useEffect, useState } from "react";
import { CardActivity } from "./_components/cards-activity";
import { RecentOrders } from "./_components/cards-recentorders";
import { ChartAreaIcons } from "./_components/cards-chart";
import { FrequentBought } from "./_components/cards-frequentbought";

export default function SellerDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats
        const statsRes = await fetch("/api/sellers/stats");
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // Fetch recent orders
        const ordersRes = await fetch("/api/sellers/recent-orders");
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setRecentOrders(ordersData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="relative min-h-screen min-w-full overflow-hidden space-y-5 mt-18 mx-3">
      <h1 className="text-xl font-bold mb-1 text-[#2E7D32]">
        Welcome back
      </h1>
      <p> Here&apos;s what&apos;s happening with your store today. </p>

      {/* Activity*/}
      <section className="flex flex-wrap min-h-[50%] min-w-[90%] max-w-[100%] justify-center">
        {loading ? (
          <p>Loading stats...</p>
        ) : (
          <CardActivity
            totalSales={`₱${Number(stats.totalSales).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            totalOrders={stats.totalOrders}
            pendingOrders={stats.pendingOrders}
            totalProducts={stats.totalProducts}
          />
        )}
      </section>

      {/* Recent Orders*/}
      <section className="flex flex-wrap min-h-[50%] min-w-[90%] max-w-[100%] justify-center">
        <RecentOrders orders={recentOrders} />
      </section>

      {/* Charts and Stats*/}
      <section className="flex min-h-[50%] min-w-[90%] max-w-[100%] justify-center gap-5">
          <ChartAreaIcons />
          <FrequentBought />
      </section>
    </section>
  );
}
