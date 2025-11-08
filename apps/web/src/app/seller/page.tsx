"use client";
import { CardActivity } from "./_components/cards-activity";
import { RecentOrders } from "./_components/cards-recentorders";
import { ChartAreaIcons } from "./_components/cards-chart";
import { FrequentBought } from "./_components/cards-frequentbought";

export default function SellerDashboard() {
  return (
    <section className="relative min-h-screen min-w-full overflow-hidden space-y-5 mt-18 mx-3">
      <h1 className="text-xl font-bold mb-1 text-[#2E7D32]">
        Welcome back &#40;Hardcoded&#41;
      </h1>
      <p> Here&apos;s what&apos;s happening with your store today. </p>

      {/* Activity*/}
      <section className="flex flex-wrap min-h-[50%] justify-center">
        <CardActivity />
      </section>

      {/* Recent Orders*/}
      <section className="flex flex-wrap min-h-[50%] justify-center">
        <RecentOrders />
      </section>

      {/* Charts and Stats*/}
      <section className="flex min-h-[50%] justify-center gap-5">
        <ChartAreaIcons />
        <FrequentBought />
      </section>
    </section>
  );
}
