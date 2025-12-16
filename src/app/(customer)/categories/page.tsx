"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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

  {categories.map((category, index) => {
    const colorScheme = colorSchemes[index % colorSchemes.length];
    const isSelected = selectedCategory?.id === category.id;
  
    return (
      <AnimatedCategoryButton key={category.id} delay={index * 50}>
        <div>
          <button
            onClick={() => handleCategoryClick(category)}
            className={`group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/80 focus-visible:ring-offset-2 text-left w-full ${
              isSelected ? "ring-2 ring-emerald-500" : ""
            }`}
          >
            <div className="flex h-full w-full flex-row items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white/90 p-4 text-xs shadow-[0_8px_26px_rgba(15,23,42,0.03)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-emerald-200 group-hover:shadow-[0_14px_38px_rgba(15,23,42,0.08)]">
              <div className="flex flex-1 items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-amber-50">
                  <span className={`h-3 w-3 rounded-full ${colorScheme.itemCountClassName}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-base font-semibold leading-snug ${colorScheme.nameClassName}`}>
                    {category.categoryName}
                  </p>
                </div>
              </div>
  
              <div className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${colorScheme.itemCountClassName}`} />
                <p className="text-sm font-medium text-slate-600">
                  {category.productCount || 0} {category.productCount === 1 ? "item" : "items"}
                </p>
              </div>
            </div>
          </button>
  
          {/* Products section for this category */}
          {isSelected && (
            <div className="mt-4 ml-6 border-l-2 border-emerald-200 pl-4">
              {loadingProducts ? (
                <div className="py-6 text-center">
                  <div className="inline-flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-lg border border-emerald-100">
                    <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-700 font-medium">Loading products...</p>
                  </div>
                </div>
              ) : products.length === 0 ? (
                <div className="py-6 text-center">
                  <div className="inline-flex flex-col items-center gap-4 px-8 py-10 bg-white rounded-2xl shadow-lg border-2 border-dashed border-slate-200 max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-600 font-medium">No products available in this category.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
                  {products.map((product, idx) => (
                    <AnimatedProductCard key={product.id} product={product} delay={idx * 50} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </AnimatedCategoryButton>
    );
  })}
  
}
