"use client";

import { useEffect, useState } from "react";
import { ArrowRight, TrendingUp, Star, Sparkles } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/types/products";
import { AnimatedSection } from "@/components/animated-section";
import { AnimatedProductCard } from "./animated-product-card";
import { PageLoader } from "@/components/loading-overlay";
import { useLanguage } from "@/lib/i18n/context";


const MAX_BEST_SELLERS = 10;

export function BestSellersSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchBestSellers = async (isSilent = false) => {
      if (!isSilent) setLoading(true);
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (Array.isArray(data)) {
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
        }
      } catch (err) {
        console.warn("Failed to fetch best sellers:", err);
      } finally {
        if (!isSilent) setLoading(false);
      }
    };

    fetchBestSellers();

    // Silent refresh every 10 seconds
    intervalId = setInterval(() => fetchBestSellers(true), 10000);

    // Refresh on focus
    const onFocus = () => fetchBestSellers(true);
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
    };
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
                  {t("crowd-favorites")}
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-emerald-800 to-slate-900 bg-clip-text text-transparent">
                <span className="inline-flex items-center gap-2">
                  <Star className="w-7 h-7 text-amber-500 fill-amber-500" />
                  {t("best-sellers-week")}
                </span>
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <div className="h-1 w-16 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full"></div>
                <p className="text-base text-slate-700 font-medium">
                  {t("best-sellers-desc")}
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-200 bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-200 hover:-translate-y-0.5"
          >
            {t("view-all-products")}
            <ArrowRight className="size-4" />
          </Link>
        </header>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-500">{t("loading-products")}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">{t("no-products-available")}</p>
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