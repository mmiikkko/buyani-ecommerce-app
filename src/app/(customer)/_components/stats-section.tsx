"use client";

import { AnimatedSection } from "@/components/animated-section";
import { ShoppingBag, Store, Users, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/context";

export function   StatsSection() {
  const [counts, setCounts] = useState({ products: 0, shops: 0, users: 0, rating: 0 });
  const { t } = useLanguage();
  
  const fetchStats = async () => {
    try {
      const [statsRes, ratingRes] = await Promise.all([
        fetch("/api/stats/customer").then(res => res.json()).catch(() => ({ products: 0, shops: 0, users: 0 })),
        fetch("/api/ratings/average").then(res => res.json()).then(data => ({ average: data.average || 0 })).catch(() => ({ average: 0 })),
      ]);
      
      setCounts({
        products: statsRes.products || 0,
        shops: statsRes.shops || 0,
        users: statsRes.users || 0,
        rating: ratingRes.average || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchStats();
    
    // Silent refresh every 30 seconds
    const interval = setInterval(() => {
      fetchStats();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      icon: ShoppingBag,
      value: counts.products > 0 ? `${counts.products}+` : "500+",
      label: t("products-available"),
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      icon: Store,
      value: counts.shops > 0 ? `${counts.shops}+` : "50+",
      label: t("active-shops"),
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Users,
      value: counts.users > 0 ? `${counts.users}+` : "1000+",
      label: t("customers"),
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Star,
      value: counts.rating > 0 ? counts.rating.toFixed(1) : "4.8",
      label: t("average-rating"),
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <AnimatedSection className="relative py-16 bg-transparent" direction="fade-up">
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2">
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
            {t("marketplace-glance")}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {t("quick-stats")}
          </h2>
          <p className="text-sm text-slate-600">
            {t("stats-description")}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {stats.map((stat, index) => {
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
          {t("connect-partner")}
        </div>
      </div>
    </AnimatedSection>
  );
}

