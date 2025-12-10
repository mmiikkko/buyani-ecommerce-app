"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "../_components/product-card";
import type { Product } from "@/types/products";
import { AnimatedSection } from "@/components/animated-section";
import { AnimatedProductCard } from "../_components/animated-product-card";
import { AnimatedCategoryButton } from "../_components/animated-category-button";
import { Tag, Sparkles, Grid3x3, ShoppingBag } from "lucide-react";

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

export default function CategoriesPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories?withCounts=true");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
          
          // If categoryId is in URL, find and select that category
          if (categoryId) {
            const category = data.find((cat: Category) => cat.id === categoryId);
            if (category) {
              setSelectedCategory(category);
              fetchProductsByCategory(categoryId);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, [categoryId]);

  const fetchProductsByCategory = async (catId: string) => {
    setLoadingProducts(true);
    try {
      const response = await fetch(`/api/products?categoryId=${catId}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    fetchProductsByCategory(category.id);
    // Update URL without page reload
    window.history.pushState({}, "", `/categories?categoryId=${category.id}`);
  };

  return (
    <main className="relative min-h-screen">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-orange-200/15 rounded-full blur-3xl"></div>
      </div>

      <AnimatedSection className="relative py-16 bg-gradient-to-b from-emerald-50/70 via-white to-amber-50/40" direction="fade-up">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-4">
            <div className="relative">
              {/* Decorative icon badges */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-600 shadow-lg shadow-emerald-500/30">
                  <Tag className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-500 animate-pulse" />
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                    All Categories
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-emerald-800 to-amber-800 bg-clip-text text-transparent">
                  <span className="inline-flex items-center gap-2">
                    <Grid3x3 className="w-7 h-7 text-emerald-600" />
                    Browse all available categories
                  </span>
                </h2>
                <div className="flex items-center gap-3">
                  <div className="h-1 w-16 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full"></div>
                  <p className="text-base text-slate-700 font-medium">
                    Explore products organized by category
                  </p>
                </div>
              </div>
            </div>
          </header>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-lg border border-emerald-100">
                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-700 font-medium">Loading categories...</p>
              </div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex flex-col items-center gap-4 px-8 py-10 bg-white rounded-2xl shadow-lg border-2 border-dashed border-slate-200 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                  <Tag className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium">No categories available.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4">
                {categories.map((category, index) => {
                  const colorScheme = colorSchemes[index % colorSchemes.length];
                  const isSelected = selectedCategory?.id === category.id;
                  return (
                    <AnimatedCategoryButton key={category.id} delay={index * 50}>
                      <button
                        onClick={() => handleCategoryClick(category)}
                        className={`group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/80 focus-visible:ring-offset-2 text-left w-full ${
                          isSelected ? "ring-2 ring-emerald-500" : ""
                        }`}
                      >
                        <div className="flex h-full w-full flex-row items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white/90 p-4 text-xs shadow-[0_8px_26px_rgba(15,23,42,0.03)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-emerald-200 group-hover:shadow-[0_14px_38px_rgba(15,23,42,0.08)]">
                          <div className="flex flex-1 items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-amber-50">
                              <span
                                className={`h-3 w-3 rounded-full ${colorScheme.itemCountClassName}`}
                              />
                            </div>
                            <div className="flex-1">
                              <p
                                className={`text-base font-semibold leading-snug ${colorScheme.nameClassName}`}
                              >
                                {category.categoryName}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${colorScheme.itemCountClassName}`}
                            />
                            <p className="text-sm font-medium text-slate-600">
                              {category.productCount || 0} {category.productCount === 1 ? "item" : "items"}
                            </p>
                          </div>
                        </div>
                      </button>
                    </AnimatedCategoryButton>
                  );
                })}
              </div>

              {/* Products Section */}
              {selectedCategory && (
                <AnimatedSection className="mt-10 space-y-6" direction="fade-up" delay={100}>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-amber-500 rounded-full"></div>
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                          {selectedCategory.categoryName}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <ShoppingBag className="w-4 h-4 text-emerald-600" />
                          <p className="text-sm text-slate-600 font-medium">
                            {products.length} {products.length === 1 ? "product" : "products"} available
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {loadingProducts ? (
                    <div className="text-center py-16">
                      <div className="inline-flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-lg border border-emerald-100">
                        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-700 font-medium">Loading products...</p>
                      </div>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="inline-flex flex-col items-center gap-4 px-8 py-10 bg-white rounded-2xl shadow-lg border-2 border-dashed border-slate-200 max-w-md mx-auto">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-600 font-medium">No products available in this category.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {products.map((product, index) => (
                        <AnimatedProductCard key={product.id} product={product} delay={index * 50} />
                      ))}
                    </div>
                  )}
                </AnimatedSection>
              )}
            </>
          )}
        </div>
      </AnimatedSection>
    </main>
  );
}
