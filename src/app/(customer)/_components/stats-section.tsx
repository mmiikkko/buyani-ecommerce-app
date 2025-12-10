"use client";

import { AnimatedSection } from "@/components/animated-section";
import { ShoppingBag, Store, Users, Star } from "lucide-react";
import { useEffect, useState } from "react";

const stats = [
  {
    icon: ShoppingBag,
    value: "500+",
    label: "Products Available",
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    icon: Store,
    value: "50+",
    label: "Active Shops",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Users,
    value: "1000+",
    label: "Happy Customers",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Star,
    value: "4.8",
    label: "Average Rating",
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-50",
  },
];

export function StatsSection() {
  const [counts, setCounts] = useState({ products: 0, shops: 0 });

  useEffect(() => {
    // Fetch real counts
    Promise.all([
      fetch("/api/products").then(res => res.json()).then(data => Array.isArray(data) ? data.length : 0).catch(() => 0),
      fetch("/api/shops").then(res => res.json()).then(data => Array.isArray(data) ? data.length : 0).catch(() => 0),
    ]).then(([products, shops]) => {
      setCounts({ products, shops });
    });
  }, []);

  const displayStats = [
    {
      ...stats[0],
      value: counts.products > 0 ? `${counts.products}+` : stats[0].value,
    },
    {
      ...stats[1],
      value: counts.shops > 0 ? `${counts.shops}+` : stats[1].value,
    },
    stats[2],
    stats[3],
  ];

  return (
    <AnimatedSection className="relative py-16 bg-transparent" direction="fade-up">
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2">
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Marketplace at a glance
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Quick stats
          </h2>
          <p className="text-sm text-slate-600">
            Products available, active shops, happy customers, and our average rating.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {displayStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <AnimatedSection
                key={stat.label}
                direction="fade-up"
                delay={index * 100}
                className="group"
              >
                <div className="relative text-center p-6 rounded-2xl border-2 border-white/50 bg-gradient-to-br from-white to-white/80 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300 hover:-translate-y-1">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg mb-4 mx-auto`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-800 shadow-inner">
          Want to connect and be one of BuyAni? Contact us — we’d love to partner with you.
        </div>
      </div>
    </AnimatedSection>
  );
}

