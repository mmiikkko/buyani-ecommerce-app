"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "../_components/product-card";
import type { Product } from "@/types/products";
import { AnimatedSection } from "@/components/animated-section";
import { AnimatedProductCard } from "../_components/animated-product-card";
import { Sparkles, ShoppingBag, TrendingUp, Star, SlidersHorizontal } from "lucide-react";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortOption, setSortOption] = useState<"default" | "rating" | "new" | "old">("default");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          // Ensure data is an array
          if (Array.isArray(data)) {
            setAllProducts(data);
          } else {
            console.error("Expected array but got:", data);
            setAllProducts([]);
          }
        } else {
          console.error("Failed to fetch products");
          setAllProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const categoryOptions = useMemo(() => {
    const unique = new Set<string>();
    allProducts.forEach((p) => {
      if (p.categoryName) unique.add(p.categoryName);
    });
    return Array.from(unique);
  }, [allProducts]);

  // Filter + sort products
  const products = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    const filtered = allProducts.filter((product) => {
      const matchesSearch =
        !query ||
        product.productName?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.shopName?.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "all" ||
        (product.categoryName || "").toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortOption === "rating") {
        const ra = Number(a.rating || 0);
        const rb = Number(b.rating || 0);
        if (rb !== ra) return rb - ra;
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      }

      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      if (sortOption === "new") return dateB - dateA;
      if (sortOption === "old") return dateA - dateB;
      return 0;
    });

    return sorted;
  }, [allProducts, searchQuery, selectedCategory, sortOption]);

  return (
    <main className="relative min-h-screen">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl"></div>
      </div>

      <AnimatedSection className="relative py-16 bg-gradient-to-b from-emerald-50/50 via-white to-amber-50/30" direction="fade-up">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-4">
            <div className="relative">
              {/* Decorative icon badges */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-500 animate-pulse" />
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                    {searchQuery ? "Search Results" : "All Products"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-emerald-800 to-slate-900 bg-clip-text text-transparent">
                  {searchQuery ? (
                    <>
                      <span className="inline-flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-emerald-600" />
                        Search results for &quot;{searchQuery}&quot;
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="inline-flex items-center gap-2">
                        <Star className="w-7 h-7 text-amber-500 fill-amber-500" />
                        Browse all available products
                      </span>
                    </>
                  )}
                </h2>
                <div className="flex items-center gap-3">
                  <div className="h-1 w-16 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full"></div>
                  <p className="text-base text-slate-700 font-medium">
                    {searchQuery
                      ? `Found ${products.length} ${products.length === 1 ? "product" : "products"} matching your search`
                      : "Discover a wide variety of products from local sellers"}
                  </p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-emerald-100 bg-white/80 p-3 shadow-sm backdrop-blur">
              <div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="text-xs font-medium text-slate-600">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-xs focus:border-emerald-500 focus:outline-none"
                >
                  <option value="all">All</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="text-xs font-medium text-slate-600">Sort</label>
                <select
                  value={sortOption}
                  onChange={(e) =>
                    setSortOption(e.target.value as "default" | "rating" | "new" | "old")
                  }
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-xs focus:border-emerald-500 focus:outline-none"
                >
                  <option value="default">Default</option>
                  <option value="rating">High ratings</option>
                  <option value="new">New</option>
                  <option value="old">Old</option>
                </select>
              </div>
            </div>
          </header>

          {loading ? (
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
                <p className="text-slate-600 font-medium">
                  {searchQuery
                    ? `No products found matching "${searchQuery}". Try a different search term.`
                    : "No products available at the moment."}
                </p>
              </div>
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
    </main>
  );
}

