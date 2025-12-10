"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Store, Award, Sparkles, Heart } from "lucide-react";
import Link from "next/link";
import { ShopCard } from "./shop-card";
import type { Shop } from "@/types/shops";
import { AnimatedSection } from "@/components/animated-section";
import { AnimatedShopCard } from "./animated-shop-card";

const MAX_FEATURED_SHOPS = 6;

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
        // Sort by rating or product count, take top MAX_FEATURED_SHOPS
        const sorted = data
          .sort((a: Shop, b: Shop) => {
            const aRating = a.shop_rating ? parseFloat(a.shop_rating) : 0;
            const bRating = b.shop_rating ? parseFloat(b.shop_rating) : 0;
            if (bRating !== aRating) return bRating - aRating;
            return (b.products || 0) - (a.products || 0);
          })
          .slice(0, MAX_FEATURED_SHOPS);
        setShops(sorted);
      })
      .catch((err) => {
        // Silently handle errors - don't log to console to avoid cluttering
        setShops([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AnimatedSection className="relative py-16 bg-transparent" direction="fade-up">
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  Trusted campus sellers
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                <span className="inline-flex items-center gap-2">
                  <Award className="w-7 h-7 text-amber-500 fill-amber-500" />
                  Featured vendors
                </span>
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <p className="text-base text-slate-700 font-medium">
                    Curated stalls from students and local makers with the best reviews.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/shops"
            className="inline-flex items-center gap-2 rounded-full border-2 border-blue-200 bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 hover:-translate-y-0.5"
          >
            View all shops
            <ArrowRight className="size-4" />
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
            {shops.map((shop, index) => (
              <AnimatedShopCard key={shop.id} shop={shop} delay={index * 100} />
            ))}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
