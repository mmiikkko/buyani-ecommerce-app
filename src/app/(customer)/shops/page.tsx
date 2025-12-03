"use client";

import Link from "next/link";
import { FEATURED_VENDORS } from "../_components/featured-vendors";

export default function ShopsPage() {
  return (
    <main className="relative min-h-screen">
      <section className="py-12 bg-slate-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-2">
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-500">
                All Shops
              </p>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                Browse all available shops
              </h2>
              <p className="text-sm text-slate-600">
                Curated stalls from students and local makers with the best
                reviews.
              </p>
            </div>
          </header>

          {FEATURED_VENDORS.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">No shops available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Shops will be rendered here when available */}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

