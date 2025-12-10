"use client";

import { AnimatedSection } from "@/components/animated-section";
import Link from "next/link";
import { ShoppingBag, Sparkles, Store, Tag, Clock } from "lucide-react";

const actions = [
  {
    title: "Shop popular picks",
    description: "Best sellers and trending treats",
    href: "/products",
    icon: ShoppingBag,
    gradient: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "Browse categories",
    description: "Find items by interests",
    href: "/categories",
    icon: Tag,
    gradient: "from-amber-500 to-amber-600",
    bg: "bg-amber-50",
  },
  {
    title: "Visit shops",
    description: "Meet campus sellers",
    href: "/shops",
    icon: Store,
    gradient: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Order again",
    description: "Reorder recent favorites",
    href: "/orders",
    icon: Clock,
    gradient: "from-purple-500 to-purple-600",
    bg: "bg-purple-50",
  },
];

export function QuickActionsSection() {
  return (
    <AnimatedSection className="relative py-12 bg-transparent" direction="fade-up" delay={50}>
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full inline-block">
              Quick actions
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Jump into what you need, fast
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <AnimatedSection key={action.title} direction="fade-up" delay={idx * 80}>
                <Link
                  href={action.href}
                  className="group block h-full rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]"
                >
                  <div
                    className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-lg mb-3`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {action.description}
                  </p>
                </Link>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}

