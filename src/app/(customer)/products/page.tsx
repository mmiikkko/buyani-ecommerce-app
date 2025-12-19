"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "../_components/product-card";
import type { Product } from "@/types/products";
import { AnimatedSection } from "@/components/animated-section";
import { AnimatedProductCard } from "../_components/animated-product-card";
import { Sparkles, ShoppingBag, TrendingUp, Star, SlidersHorizontal } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

interface Category {
  id: string;
  categoryName: string;
  productCount?: number;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const sortParam = searchParams.get("sort") || "";
  const { t } = useLanguage();
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<"default" | "rating" | "new" | "old" | "best-sellers">(
    (sortParam === "new" ? "new" : sortParam === "best-sellers" ? "best-sellers" : "default") as "default" | "rating" | "new" | "old" | "best-sellers"
  );

  // Update sort option when URL param changes
  useEffect(() => {
    if (sortParam === "new") {
      setSortOption("new");
    } else if (sortParam === "best-sellers") {
      setSortOption("best-sellers");
    }
  }, [sortParam]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch products and categories in parallel
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories?withCounts=true")
        ]);

        // Handle products
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          if (Array.isArray(productsData)) {
            // Debug: Check if categoryName exists
            if (productsData.length > 0) {
              const sample = productsData[0];
              console.log('Sample product:', {
                name: sample.productName,
                categoryName: sample.categoryName,
                categoryId: sample.categoryId,
                hasCategoryName: !!sample.categoryName
              });
              // Log all unique category names found
              const uniqueCategories = [...new Set(productsData.map((p: Product) => p.categoryName).filter(Boolean))];
              console.log('Unique category names in products:', uniqueCategories);
            }
            setAllProducts(productsData);
          } else {
            console.error("Expected array but got:", productsData);
            setAllProducts([]);
          }
        } else {
          console.error("Failed to fetch products");
          setAllProducts([]);
        }

        // Handle categories - show ALL categories
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          console.log('Categories fetched:', categoriesData.map((c: Category) => c.categoryName));
          setCategories(categoriesData);
        } else {
          console.error("Failed to fetch categories");
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setAllProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const categoryOptions = useMemo(() => {
    // Use all categories from API, sorted alphabetically
    return categories.map(cat => ({
      id: cat.id,
      name: cat.categoryName
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);

  // Create a map of categoryId to categoryName for filtering
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach(cat => {
      map.set(cat.id, cat.categoryName);
    });
    return map;
  }, [categories]);

  // Filter + sort products
  const products = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    const filtered = allProducts.filter((product) => {
      const matchesSearch =
        !query ||
        product.productName?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.shopName?.toLowerCase().includes(query);

      let matchesCategory = true;
      if (selectedCategory !== "all" && selectedCategoryId) {
        // Filter by categoryId for more reliable matching
        matchesCategory = product.categoryId === selectedCategoryId;
        
        // Fallback: also check categoryName if categoryId doesn't match
        if (!matchesCategory && product.categoryName) {
          const selectedCategoryName = selectedCategory.toLowerCase().trim();
          const productCategoryName = product.categoryName.toLowerCase().trim();
          matchesCategory = productCategoryName === selectedCategoryName;
        }
      }

      return matchesSearch && matchesCategory;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortOption === "rating") {
        const ra = Number(a.rating || 0);
        const rb = Number(b.rating || 0);
        if (rb !== ra) return rb - ra;
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      }

      if (sortOption === "best-sellers") {
        const aSold = a.itemsSold ?? 0;
        const bSold = b.itemsSold ?? 0;
        if (bSold !== aSold) return bSold - aSold;
        const ra = Number(a.rating || 0);
        const rb = Number(b.rating || 0);
        return rb - ra;
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
                    {searchQuery ? t("search-results") : t("all-products")}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-emerald-800 to-slate-900 bg-clip-text text-transparent">
                  {searchQuery ? (
                    <>
                      <span className="inline-flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-emerald-600" />
                        {t("search-results-for")} &quot;{searchQuery}&quot;
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="inline-flex items-center gap-2">
                        <Star className="w-7 h-7 text-amber-500 fill-amber-500" />
                        {t("browse-all-products")}
                      </span>
                    </>
                  )}
                </h2>
                <div className="flex items-center gap-3">
                  <div className="h-1 w-16 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full"></div>
                  <p className="text-base text-slate-700 font-medium">
                    {searchQuery
                      ? `${t("found-products")} ${products.length} ${products.length === 1 ? t("item") : t("items")} ${t("products-matching")}`
                      : t("discover-variety")}
                  </p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-emerald-100 bg-white/80 p-3 shadow-sm backdrop-blur">
              <div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold">
                <SlidersHorizontal className="h-4 w-4" />
                {t("filters")}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="text-xs font-medium text-slate-600">{t("category")}</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedCategory(value);
                    if (value === "all") {
                      setSelectedCategoryId(null);
                    } else {
                      const selectedCat = categoryOptions.find(cat => cat.name === value);
                      setSelectedCategoryId(selectedCat?.id || null);
                    }
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-xs focus:border-emerald-500 focus:outline-none"
                >
                  <option value="all">{t("all")}</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="text-xs font-medium text-slate-600">{t("sort")}</label>
                <select
                  value={sortOption}
                  onChange={(e) =>
                    setSortOption(e.target.value as "default" | "rating" | "new" | "old" | "best-sellers")
                  }
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-xs focus:border-emerald-500 focus:outline-none"
                >
                  <option value="default">{t("default")}</option>
                  <option value="best-sellers">{t("best-sellers") || "Best Sellers"}</option>
                  <option value="rating">{t("high-ratings")}</option>
                  <option value="new">{t("new")}</option>
                  <option value="old">{t("old")}</option>
                </select>
              </div>
            </div>
          </header>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-lg border border-emerald-100">
                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-700 font-medium">{t("loading-products")}</p>
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
                    ? `${t("no-products-found")} "${searchQuery}". ${t("try-different-search")}`
                    : t("no-products-available")}
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

