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
    <div className="relative min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        <div className="rounded-2xl border border-emerald-100 bg-white/80 backdrop-blur-sm shadow-sm p-6">
          <h1 className="text-2xl font-bold text-emerald-700">Welcome back</h1>
          <p className="text-slate-600 mt-1">
            Here&apos;s what&apos;s happening in Buyani Marketplace today.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white/80 backdrop-blur-sm shadow-sm p-6">
          {loading ? (
            <p className="text-slate-600">Loading stats...</p>
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
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-emerald-100 bg-white/80 backdrop-blur-sm shadow-sm p-4">
            <PendingApprovals />
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white/80 backdrop-blur-sm shadow-sm p-4">
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
}
