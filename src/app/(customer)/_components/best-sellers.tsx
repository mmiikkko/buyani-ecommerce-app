"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "./product-card";
import type { Product } from "@/types/products";

export function BestSellersSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        // Sort by itemsSold or rating, take top 10
        const sorted = data
          .sort((a: Product, b: Product) => {
            const aSold = a.itemsSold ?? 0;
            const bSold = b.itemsSold ?? 0;
            if (bSold !== aSold) return bSold - aSold;
            const aRating = Number(a.rating ?? 0);
            const bRating = Number(b.rating ?? 0);
            return bRating - aRating;
          })
          .slice(0, 10);
        setProducts(sorted);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="pt-6 pb-12 bg-gradient-to-b from-emerald-50/70 via-emerald-50/40 to-slate-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-500">
              Crowd favorites
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Best sellers this week
            </h2>
            <p className="text-base text-slate-600">
              Simple, popular picks students keep coming back for.
            </p>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            View all products
            <ArrowRight className="size-3" />
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
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}