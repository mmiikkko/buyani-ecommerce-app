"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface FeaturedCategory {
  id: string;
  name: string;
  tag: string;
  itemCount: number;
  href: string;
  nameClassName: string;
  itemCountClassName: string;
}

export const FEATURED_CATEGORIES: FeaturedCategory[] = [
  {
    id: "local-snacks",
    name: "Local snacks",
    tag: "Food & snacks",
    itemCount: 0,
    href: "/customer/view-all-categories?category=local-snacks",
    nameClassName: "text-emerald-900",
    itemCountClassName: "bg-emerald-400",
  },
  {
    id: "handmade",
    name: "Handmade goods",
    tag: "Arts & crafts",
    itemCount: 0,
    href: "/customer/view-all-categories?category=handmade",
    nameClassName: "text-amber-900",
    itemCountClassName: "bg-amber-400",
  },
  {
    id: "vegetables",
    name: "Fresh produce",
    tag: "Fresh & organic",
    itemCount: 0,
    href: "/customer/view-all-categories?category=vegetables",
    nameClassName: "text-emerald-900",
    itemCountClassName: "bg-emerald-400",
  },
  {
    id: "essentials",
    name: "Campus essentials",
    tag: "Daily picks",
    itemCount: 0,
    href: "/customer/view-all-categories?category=essentials",
    nameClassName: "text-slate-900",
    itemCountClassName: "bg-slate-400",
  },
  {
    id: "novelty-items",
    name: "Novelty items",
    tag: "Collections",
    itemCount: 0,
    href: "/customer/view-all-categories?category=novelty",
    nameClassName: "text-amber-900",
    itemCountClassName: "bg-amber-400",
  },
  {
    id: "souvenir",
    name: "Souvenirs",
    tag: "Memorabilia",
    itemCount: 0,
    href: "/customer/view-all-categories?category=souvenir",
    nameClassName: "text-emerald-900",
    itemCountClassName: "bg-emerald-400",
  },
];

export function ShopByCategorySection() {
  return (
    <section className="py-10 bg-gradient-to-b from-emerald-50/70 via-emerald-50/40 to-slate-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-500">
              Shop by category
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Browse from campus sellers and local makers
            </h2>
          </div>

          <Link
            href="/customer/view-all-categories"
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            View all categories
            <ArrowRight className="size-3" />
          </Link>
        </header>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {FEATURED_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/80 focus-visible:ring-offset-2"
            >
              <div
                className="flex h-full flex-col justify-between gap-3 rounded-2xl border border-slate-100 bg-white/90 p-3 text-xs shadow-[0_8px_26px_rgba(15,23,42,0.03)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-emerald-200 group-hover:shadow-[0_14px_38px_rgba(15,23,42,0.08)]"
              >
                <div>
                  <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
                    {category.tag}
                  </p>
                  <p
                    className={`text-sm font-semibold leading-snug ${category.nameClassName}`}
                  >
                    {category.name}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${category.itemCountClassName}`}
                  />
                  <p className="text-[11px] font-medium text-slate-600">
                    {category.itemCount} items
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
