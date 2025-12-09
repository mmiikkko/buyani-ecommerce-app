"use client";
import { useEffect, useState } from "react";
import { CardActivity } from "./_components/admin-activity";
import { PendingApprovals } from "./_components/admin-pending-approvals";
import { RecentActivity } from "./_components/admin-recent-activity";
import { Sparkles, Loader2 } from "lucide-react";

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
    <section className="relative min-h-screen min-w-full overflow-hidden space-y-6 pt-15">
      {/* Welcome Header Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-xl p-6 border border-emerald-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-600 rounded-lg shadow-md">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Welcome back
            </h1>
            <p className="text-sm text-gray-600">
              Here&apos;s what&apos;s happening in Buyani Marketplace today.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="rounded-xl border border-emerald-100 bg-white/80 backdrop-blur-sm shadow-md p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="inline-flex items-center gap-2 text-gray-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p>Loading dashboard statistics...</p>
            </div>
          </div>
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

      {/* Bottom Grid Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-emerald-100 bg-white/80 backdrop-blur-sm shadow-md p-6">
          <PendingApprovals />
        </div>
        <div className="rounded-xl border border-emerald-100 bg-white/80 backdrop-blur-sm shadow-md p-6">
          <RecentActivity />
        </div>
      </div>
    </section>
  );
}
