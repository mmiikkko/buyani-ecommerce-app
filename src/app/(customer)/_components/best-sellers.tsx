"use client";

import { useEffect, useState } from "react";
import { ArrowRight, TrendingUp, Star, Sparkles } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "./product-card";
import type { Product } from "@/types/products";
import { AnimatedSection } from "@/components/animated-section";
import { AnimatedProductCard } from "./animated-product-card";

const MAX_BEST_SELLERS = 10;

export function BestSellersSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) {
          // Handle error gracefully without throwing
          console.warn(`Failed to fetch products: HTTP ${res.status}`);
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
          setProducts([]);
          return;
        }
        // Sort by itemsSold or rating, take top MAX_BEST_SELLERS
        const sorted = data
          .sort((a: Product, b: Product) => {
            const aSold = a.itemsSold ?? 0;
            const bSold = b.itemsSold ?? 0;
            if (bSold !== aSold) return bSold - aSold;
            const aRating = Number(a.rating ?? 0);
            const bRating = Number(b.rating ?? 0);
            return bRating - aRating;
          })
          .slice(0, MAX_BEST_SELLERS);
        setProducts(sorted);
      })
      .catch((err) => {
        // Silently handle errors - don't log to console to avoid cluttering
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AnimatedSection className="relative pt-12 pb-16 bg-transparent" direction="fade-up">
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500 animate-pulse" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                  Crowd favorites
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-emerald-800 to-slate-900 bg-clip-text text-transparent">
                <span className="inline-flex items-center gap-2">
                  <Star className="w-7 h-7 text-amber-500 fill-amber-500" />
                  Best sellers this week
                </span>
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <div className="h-1 w-16 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full"></div>
                <p className="text-base text-slate-700 font-medium">
                  Simple, popular picks students keep coming back for.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-200 bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-200 hover:-translate-y-0.5"
          >
            View all products
            <ArrowRight className="size-4" />
          </Link>
        </header>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-500">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((product, index) => (
              <AnimatedProductCard key={product.id} product={product} delay={index * 50} />
            ))}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}