"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "../_components/product-card";
import type { Product } from "@/types/products";
import { AnimatedSection } from "@/components/animated-section";
import { AnimatedProductCard } from "../_components/animated-product-card";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Filter products based on search query
  const products = useMemo(() => {
    if (!searchQuery.trim()) {
      return allProducts;
    }

    const query = searchQuery.toLowerCase().trim();
    return allProducts.filter((product) => {
      const productName = product.productName?.toLowerCase() || "";
      const description = product.description?.toLowerCase() || "";
      const shopName = product.shopName?.toLowerCase() || "";
      
      return (
        productName.includes(query) ||
        description.includes(query) ||
        shopName.includes(query)
      );
    });
  }, [allProducts, searchQuery]);

  return (
    <main className="relative min-h-screen">
      <AnimatedSection className="py-12 bg-slate-50" direction="fade-up">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-2">
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-500">
                {searchQuery ? "Search Results" : "All Products"}
              </p>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                {searchQuery ? (
                  <>
                    Search results for &quot;{searchQuery}&quot;
                  </>
                ) : (
                  "Browse all available products"
                )}
              </h2>
              <p className="text-sm text-slate-600">
                {searchQuery
                  ? `Found ${products.length} ${products.length === 1 ? "product" : "products"} matching your search`
                  : "Discover a wide variety of products from local sellers"}
              </p>
            </div>
          </header>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-500">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">
                {searchQuery
                  ? `No products found matching "${searchQuery}". Try a different search term.`
                  : "No products available at the moment."}
              </p>
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

