"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ShopCard } from "./shop-card";
import type { Shop } from "@/types/shops";

export function FeaturedVendorsSection() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/shops")
      .then((res) => {
        if (!res.ok) {
          // Handle error gracefully without throwing
          console.warn(`Failed to fetch shops: HTTP ${res.status}`);
          return res.json().catch(() => ({})); // Try to parse error response, fallback to empty object
        }
        return res.json();
      })
      .then((data) => {
        // Ensure data is an array before sorting
        if (!Array.isArray(data)) {
          // If it's an error object, log it silently
          if (data && typeof data === 'object' && 'error' in data) {
            console.warn("API error:", data.error);
          }
          setShops([]);
          return;
        }
        // Sort by rating or product count, take top 6
        const sorted = data
          .sort((a: Shop, b: Shop) => {
            const aRating = a.shop_rating ? parseFloat(a.shop_rating) : 0;
            const bRating = b.shop_rating ? parseFloat(b.shop_rating) : 0;
            if (bRating !== aRating) return bRating - aRating;
            return (b.products || 0) - (a.products || 0);
          })
          .slice(0, 6);
        setShops(sorted);
      })
      .catch((err) => {
        // Silently handle errors - don't log to console to avoid cluttering
        setShops([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-12 bg-slate-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-500">
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
            href="/shops"
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50"
          >
            View all shops
            <ArrowRight className="size-3" />
          </Link>
        </header>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-500">Loading shops...</p>
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No shops available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
