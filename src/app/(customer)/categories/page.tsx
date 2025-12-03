"use client";

import Link from "next/link";
import { FEATURED_CATEGORIES } from "../_components/shop-by-category";

export default function CategoriesPage() {
  return (
    <main className="relative min-h-screen">
      <section className="py-10 bg-gradient-to-b from-emerald-50/70 via-emerald-50/40 to-slate-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-2">
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-500">
                All Categories
              </p>
              <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                Browse all available categories
              </h2>
            </div>
          </header>

          <div className="flex flex-col gap-4">
            {FEATURED_CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={category.href}
                className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/80 focus-visible:ring-offset-2"
              >
                <div className="flex h-full w-full flex-row items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white/90 p-4 text-xs shadow-[0_8px_26px_rgba(15,23,42,0.03)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-emerald-200 group-hover:shadow-[0_14px_38px_rgba(15,23,42,0.08)]">
                  <div className="flex flex-1 items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-amber-50">
                      <span
                        className={`h-3 w-3 rounded-full ${category.itemCountClassName}`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
                        {category.tag}
                      </p>
                      <p
                        className={`text-base font-semibold leading-snug ${category.nameClassName}`}
                      >
                        {category.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${category.itemCountClassName}`}
                    />
                    <p className="text-sm font-medium text-slate-600">
                      {category.itemCount} items
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
