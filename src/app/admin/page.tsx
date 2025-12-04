"use client";
import { useEffect, useState } from "react";
import { CardActivity } from "./_components/admin-activity";
import { PendingApprovals } from "./_components/admin-pending-approvals";
import { RecentActivity } from "./_components/admin-recent-activity";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeUsers: 0,
    activeSellers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        setStats({
          totalRevenue: data.totalRevenue || 0,
          totalOrders: data.totalOrders || 0,
          activeUsers: data.activeUsers || 0,
          activeSellers: data.activeSellers || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="relative min-h-screen min-w-full overflow-hidden space-y-5 mt-18 mx-3">
      <h1 className="text-xl font-bold mb-1 text-[#2E7D32]">
        Welcome back
      </h1>
      <p>Welcome back! Here&apos;s what&apos;s happening in Buyani Marketplace today! </p>

      {/* Activity*/}
      <section className="flex flex-wrap min-h-[50%] min-w-[90%] max-w-[100%] justify-center">
        {loading ? (
          <p>Loading stats...</p>
        ) : (
          <CardActivity
            totalRevenue={`₱${Number(stats.totalRevenue).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            totalOrders={stats.totalOrders}
            activeUsers={stats.activeUsers}
            activeSellers={stats.activeSellers}
          />
        )}
      </section>

      {/* Pending Seller Approvals and Recent Activities */}
      <section className="flex min-h-[50%] min-w-[90%] max-w-[100%] justify-center items-center gap-8">
        <PendingApprovals />
        <RecentActivity />
      </section>

    </section>
  );
}
