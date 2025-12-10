"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Store, User, Star, Loader2 } from "lucide-react";
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
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </AnimatedSection>

      {/* Shop Header */}
      <AnimatedSection direction="fade-up" delay={100}>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-6">

            {/* Shop Image */}
            <div className="relative w-full md:w-48 h-48 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
              <Image
                src={shopImage}
                alt={shop.shop_name}
                fill
                className="object-cover"
                unoptimized={shopImage.startsWith("data:")}
              />
            </div>

            {/* Shop Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{shop.shop_name}</h1>

                {shop.description && (
                  <p className="text-slate-600 leading-relaxed">{shop.description}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4">

                {/* Rating */}
                {rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-slate-900">{rating.toFixed(1)}</span>
                  </div>
                )}

                {/* Owner */}
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{shop.owner_name || "Unknown"}</span>
                </div>

                {/* Product Count */}
                <div className="flex items-center gap-2 text-slate-600">
                  <Store className="h-4 w-4" />
                  <span className="text-sm">
                    {products.length} {products.length === 1 ? "product" : "products"}
                  </span>
                </div>

                {/* Status Badge */}
                {shop.status && (
                  <Badge
                    variant={
                      shop.status === "approved"
                        ? "default"
                        : shop.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                  >
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
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900">
            Products from {shop.shop_name}
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400 mb-2" />
              <p className="text-slate-500">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <p className="text-red-600 font-semibold mb-2">Could not load products.</p>
              <p className="text-slate-500 text-sm">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <Store className="h-12 w-12 mx-auto text-slate-400 mb-4" />
              <p className="text-slate-500">No products available from this shop yet.</p>
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
