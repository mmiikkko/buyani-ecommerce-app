"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatedSection } from "@/components/animated-section";
import { AnimatedProductCard } from "../_components/animated-product-card";
import { AnimatedCategoryButton } from "../_components/animated-category-button";
import type { Product } from "@/types/products";
import { Tag, Sparkles, Grid3x3 } from "lucide-react";

interface Category {
  id: string;
  categoryName: string;
  productCount?: number;
}

const colorSchemes = [
  { nameClassName: "text-emerald-900", itemCountClassName: "bg-emerald-400" },
  { nameClassName: "text-amber-900", itemCountClassName: "bg-amber-400" },
  { nameClassName: "text-slate-900", itemCountClassName: "bg-slate-400" },
  { nameClassName: "text-emerald-900", itemCountClassName: "bg-emerald-400" },
  { nameClassName: "text-amber-900", itemCountClassName: "bg-amber-400" },
];

export default function CategoriesPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories?withCounts=true");
        if (!res.ok) return;

        const data = await res.json();
        setCategories(data);

        if (categoryId) {
          setSelectedCategoryId(categoryId);
          fetchProductsByCategory(categoryId);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, [categoryId]);

  const fetchProductsByCategory = async (id: string) => {
    setLoadingProducts(true);
    try {
      const res = await fetch(`/api/products?categoryId=${id}`);
      if (res.ok) {
        setProducts(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    fetchProductsByCategory(categoryId);
    window.history.pushState({}, "", `/categories?categoryId=${categoryId}`);
  };

  return (
    <main className="relative min-h-screen">
      <AnimatedSection
        className="relative py-16 bg-gradient-to-b from-emerald-50/70 via-white to-amber-50/40"
        direction="fade-up"
      >
        <div className="mx-auto max-w-7xl px-4 space-y-8">

          {/* HEADER */}
          <header className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-600 flex items-center justify-center">
                <Tag className="w-6 h-6 text-white" />
              </div>
              <Sparkles className="w-5 h-5 text-emerald-500" />
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                All Categories
              </p>
            </div>

            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Grid3x3 className="w-6 h-6 text-emerald-600" />
              Browse all available categories
            </h2>
          </header>

          {/* LOADING */}
          {loading && <p className="py-10 text-center">Loading categories...</p>}

          {/* CATEGORY LIST */}
          {!loading && (
            <div className="space-y-6">
              {categories.map((category, index) => {
                const isSelected = selectedCategoryId === category.id;
                const color = colorSchemes[index % colorSchemes.length];

                return (
                  <div key={category.id} className="space-y-4">
                    <AnimatedCategoryButton delay={index * 50}>
                      <button
                        onClick={() => handleCategoryClick(category.id)}
                        className={`w-full rounded-2xl text-left ${
                          isSelected ? "ring-2 ring-emerald-500" : ""
                        }`}
                      >
                        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow">
                          <p className={`font-semibold ${color.nameClassName}`}>
                            {category.categoryName}
                          </p>
                          <span className="text-sm text-slate-600">
                            {category.productCount || 0} items
                          </span>
                        </div>
                      </button>
                    </AnimatedCategoryButton>

                    {/* PRODUCTS UNDER CATEGORY */}
                    {isSelected && (
                      <AnimatedSection direction="fade-up" className="pl-6">
                        {loadingProducts ? (
                          <p className="py-6 text-slate-600">Loading products...</p>
                        ) : products.length === 0 ? (
                          <p className="py-6 text-slate-500">
                            No products in this category.
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {products.map((product, i) => (
                              <AnimatedProductCard
                                key={product.id}
                                product={product}
                                delay={i * 40}
                              />
                            ))}
                          </div>
                        )}
                      </AnimatedSection>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </AnimatedSection>
    </main>
  );
}
