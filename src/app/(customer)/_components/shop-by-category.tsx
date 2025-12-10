"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Tag, Sparkles } from "lucide-react";
import Link from "next/link";
import { AnimatedSection } from "@/components/animated-section";
import { AnimatedCategoryCard } from "./animated-category-card";

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
    <AnimatedSection className="relative py-16 bg-transparent" direction="fade-up">
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-600 shadow-lg shadow-emerald-500/30">
                <Tag className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500 animate-pulse" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                  Shop by category
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-emerald-800 to-amber-800 bg-clip-text text-transparent">
                Browse from campus sellers and local makers
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <div className="h-1 w-16 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full"></div>
                <p className="text-base text-slate-700 font-medium">
                  Find exactly what you need, organized by category
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-200 bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-200 hover:-translate-y-0.5"
          >
            View all categories
            <ArrowRight className="size-4" />
          </Link>
        </header>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category, index) => {
            const colorScheme = colorSchemes[index % colorSchemes.length];
            return (
              <AnimatedCategoryCard key={category.id} delay={index * 50}>
                <Link
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
              </AnimatedCategoryCard>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
