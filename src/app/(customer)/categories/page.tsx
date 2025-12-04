"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "../_components/product-card";
import type { Product } from "@/types/products";

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
      <section className="py-10 bg-gradient-to-b from-emerald-50/70 via-emerald-50/40 to-slate-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-2">
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-500">
                All Categories
              </p>
              <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                Browse all available categories
              </h2>
            </div>
          </header>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-500">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">No categories available.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4">
                {categories.map((category, index) => {
                  const colorScheme = colorSchemes[index % colorSchemes.length];
                  const isSelected = selectedCategory?.id === category.id;
                  return (
                    <button
                      key={category.id}
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
                  );
                })}
              </div>

              {/* Products Section */}
              {selectedCategory && (
                <div className="mt-8 space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">
                      {selectedCategory.categoryName}
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                      {products.length} {products.length === 1 ? "product" : "products"} available
                    </p>
                  </div>

                  {loadingProducts ? (
                    <div className="text-center py-12">
                      <p className="text-slate-500">Loading products...</p>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                      <p className="text-slate-500">No products available in this category.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
