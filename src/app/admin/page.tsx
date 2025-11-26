"use client";
import { CardActivity } from "./_components/admin-activity";
import { PendingApprovals } from "./_components/admin-pending-approvals";
import { RecentActivity } from "./_components/admin-recent-activity";

export default function AdminDashboard() {
  return (
    <section className="relative min-h-screen min-w-full overflow-hidden space-y-5 mt-18 mx-3">
      <h1 className="text-xl font-bold mb-1 text-[#2E7D32]">
        Welcome back &#40;Hardcoded&#41;
      </h1>
      <p>Welcome back! Here&apos;s what&apos;s happening in Buyani Marketplace today! </p>

      {/* Activity*/}
      <section className="flex flex-wrap min-h-[50%] min-w-[90%] max-w-[100%] justify-center">
        <CardActivity />
      </section>

      {/* Pending Seller Approvals and Recent Activities */}
      <section className="flex min-h-[50%] min-w-[90%] max-w-[100%] justify-center gap-5">
        <PendingApprovals />
        <RecentActivity />
      </section>

    </section>
  );
}
