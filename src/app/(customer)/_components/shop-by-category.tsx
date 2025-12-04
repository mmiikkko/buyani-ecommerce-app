"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  categoryName: string;
  productCount?: number;
}

// Color schemes for categories (rotating)
const colorSchemes = [
  { nameClassName: "text-emerald-900", itemCountClassName: "bg-emerald-400" },
  { nameClassName: "text-amber-900", itemCountClassName: "bg-amber-400" },
  { nameClassName: "text-slate-900", itemCountClassName: "bg-slate-400" },
  { nameClassName: "text-emerald-900", itemCountClassName: "bg-emerald-400" },
  { nameClassName: "text-amber-900", itemCountClassName: "bg-amber-400" },
  { nameClassName: "text-emerald-900", itemCountClassName: "bg-emerald-400" },
];

export function ShopByCategorySection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories?withCounts=true");
        if (response.ok) {
          const data = await response.json();
          // Only show categories that have products
          const categoriesWithProducts = data.filter((cat: Category) => (cat.productCount || 0) > 0);
          // Limit to 6 categories for the homepage
          setCategories(categoriesWithProducts.slice(0, 6));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);
  if (loading) {
    return (
      <section className="py-10 bg-gradient-to-b from-emerald-50/70 via-emerald-50/40 to-slate-50">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <p className="text-slate-500">Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

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
            href="/categories"
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            View all categories
            <ArrowRight className="size-3" />
          </Link>
        </header>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category, index) => {
            const colorScheme = colorSchemes[index % colorSchemes.length];
            return (
              <Link
                key={category.id}
                href={`/categories?categoryId=${category.id}`}
                className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/80 focus-visible:ring-offset-2"
              >
                <div
                  className="flex h-full flex-col justify-between gap-3 rounded-2xl border border-slate-100 bg-white/90 p-3 text-xs shadow-[0_8px_26px_rgba(15,23,42,0.03)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-emerald-200 group-hover:shadow-[0_14px_38px_rgba(15,23,42,0.08)]"
                >
                  <div>
                    <p
                      className={`text-sm font-semibold leading-snug ${colorScheme.nameClassName}`}
                    >
                      {category.categoryName}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${colorScheme.itemCountClassName}`}
                    />
                    <p className="text-[11px] font-medium text-slate-600">
                      {category.productCount || 0} {category.productCount === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
