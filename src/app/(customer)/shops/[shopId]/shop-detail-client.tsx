"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Store, User, Star, Loader2, Sparkles, Award, ShoppingBag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/animated-section";
import { AnimatedProductCard } from "../../_components/animated-product-card";

import type { Shop } from "@/types/shops";
import type { Product } from "@/types/products";

type ShopDetailClientProps = {
  shop: Shop;
  shopId: string;
};

export function ShopDetailClient({ shop, shopId }: ShopDetailClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(`/api/shops/${shopId}/products`, { cache: "no-store" });

        if (!res.ok) {
          throw new Error(`Failed to load products (status: ${res.status})`);
        }

        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching shop products:", err);
        setError(err instanceof Error ? err.message : "Failed to load products.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [shopId]);

  const rating = shop.shop_rating ? Number(shop.shop_rating) : 0;
  const shopImage = shop.image || "/placeholder-shop.png";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <AnimatedSection direction="fade-in" delay={0}>
        <Button 
          variant="ghost" 
          className="mb-6 hover:bg-white/80 backdrop-blur-sm" 
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </AnimatedSection>

      {/* Shop Header */}
      <AnimatedSection direction="fade-up" delay={100}>
        <div className="relative rounded-3xl border-2 border-white/50 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 p-8 shadow-2xl shadow-blue-500/10 mb-10 backdrop-blur-sm overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-200/20 to-blue-200/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative flex flex-col md:flex-row gap-8">
            {/* Shop Image */}
            <div className="relative w-full md:w-56 h-56 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex-shrink-0 shadow-lg ring-4 ring-white/50">
              <Image
                src={shopImage}
                alt={shop.shop_name}
                fill
                className="object-cover"
                unoptimized={shopImage.startsWith("data:")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Shop Info */}
            <div className="flex-1 space-y-5">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                    <Store className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                    {shop.shop_name}
                  </h1>
                </div>

                {shop.description && (
                  <p className="text-slate-700 leading-relaxed text-lg max-w-2xl">{shop.description}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                {/* Rating */}
                {rating > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 shadow-sm">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-900">{rating.toFixed(1)}</span>
                    <span className="text-xs text-slate-600">rating</span>
                  </div>
                )}

                {/* Owner */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-sm">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">{shop.owner_name || "Unknown"}</span>
                </div>

                {/* Product Count */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 shadow-sm">
                  <ShoppingBag className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium text-slate-700">
                    {products.length} {products.length === 1 ? "product" : "products"}
                  </span>
                </div>

                {/* Status Badge */}
                {shop.status && (
                  <Badge
                    className="px-4 py-2 text-sm font-semibold shadow-sm"
                    variant={
                      shop.status === "approved"
                        ? "default"
                        : shop.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    <Award className="h-3 w-3 mr-1" />
                    {shop.status}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Products */}
      <AnimatedSection direction="fade-up" delay={200}>
        <div className="space-y-8">
          {/* Products Header */}
          <div className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-10 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
                  <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                    Products from {shop.shop_name}
                  </h2>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  <p className="text-sm text-slate-600 font-medium">
                    {products.length} {products.length === 1 ? "item" : "items"} available
                  </p>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-flex flex-col items-center gap-4 px-8 py-6 bg-white rounded-2xl shadow-lg border border-blue-100">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="text-slate-700 font-medium">Loading products...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="inline-flex flex-col items-center gap-4 px-8 py-10 bg-white rounded-2xl shadow-lg border-2 border-red-200 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <Store className="h-8 w-8 text-red-500" />
                </div>
                <div className="space-y-2">
                  <p className="text-red-600 font-semibold text-lg">Could not load products.</p>
                  <p className="text-slate-500 text-sm">{error}</p>
                </div>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex flex-col items-center gap-4 px-8 py-10 bg-white rounded-2xl shadow-lg border-2 border-dashed border-slate-200 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <Store className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium">No products available from this shop yet.</p>
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
    </div>
  );
}
