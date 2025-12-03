"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface FeaturedVendor {
  id: string;
  name: string;
  category: string;
  categoryColor: string;
  rating: number;
  products: number;
  followers: number;
  isVerified: boolean;
  image: string;
  href: string;
}

export const FEATURED_VENDORS: FeaturedVendor[] = [];

export function FeaturedVendorsSection() {
  return (
    <section className="py-12 bg-slate-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-500">
              Trusted campus sellers
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Featured vendors
            </h2>
            <p className="text-base text-slate-600">
              Curated stalls from students and local makers with the best
              reviews.
            </p>
          </div>

          <Link
            href="/customer/vendors"
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50"
          >
            View all vendors
            <ArrowRight className="size-3" />
          </Link>
        </header>

        {FEATURED_VENDORS.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No featured vendors available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Vendors will be rendered here when available */}
          </div>
        )}
      </div>
    </section>
  );
}