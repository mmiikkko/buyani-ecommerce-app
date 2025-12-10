"use client";

import { Megaphone, Sparkles, ShoppingBag, Truck, ShieldCheck } from "lucide-react";

// Simplified, single-strip promo banner to avoid image placeholders
export function PromoBanner() {
  const badges = [
    { icon: ShoppingBag, text: "Campus best-sellers", color: "from-emerald-400 to-teal-500" },
    { icon: Truck, text: "Fast pickup & delivery", color: "from-sky-400 to-emerald-400" },
    { icon: ShieldCheck, text: "Trusted local sellers", color: "from-amber-400 to-rose-500" },
  ];

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 text-white shadow-md">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.18),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.12),transparent_40%)]" />
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:px-6 sm:flex-row sm:items-center sm:justify-between lg:px-8 relative">
        <div className="flex items-center gap-3 text-sm sm:text-base font-semibold drop-shadow-sm">
          <Megaphone className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>Shop campus favorites & locally crafted products — all in one place!</span>
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <span
                key={badge.text}
                className="inline-flex items-center gap-2 rounded-full bg-white/18 px-3.5 py-1.5 text-xs font-semibold shadow-sm backdrop-blur"
              >
                <span
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${badge.color} text-white`}
                >
                  <Icon className="w-4 h-4" />
                </span>
                {badge.text}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
