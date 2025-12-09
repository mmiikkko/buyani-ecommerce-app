"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  Store,
  MessageCircle,
  Shield,
  CheckCircle2,
  Package,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "../../_components/product-card";
import type { Shop } from "@/types/shops";
import type { Product } from "@/types/products";
import { toast } from "sonner";
import { authClient } from "@/server/auth-client";

interface ShopDetailClientProps {
  shop: Shop;
  shopId: string;
}

export function ShopDetailClient({ shop, shopId }: ShopDetailClientProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatting, setChatting] = useState(false);
  const session = authClient.useSession();
  const user = session.data?.user;
  const isAuthenticated = !!user;
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/shops/${shopId}/products`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, [shopId]);

  const rating = shop.shop_rating ? parseFloat(shop.shop_rating) : 0;

  const ensureAuthenticated = useCallback(() => {
    if (!isAuthenticated) {
      toast.error("Please sign in to chat");
      router.push(`/sign-in?redirect=${encodeURIComponent(`/shops/${shopId}`)}`);
      return false;
    }
    return true;
  }, [isAuthenticated, router, shopId]);

  const handleContactSeller = useCallback(async () => {
    if (!ensureAuthenticated()) return;
    try {
      setChatting(true);
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: shop.seller_id,
          productId: null,
        }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || "Failed to start conversation");
      }

      const conversation = await res.json();
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("chatfab:open", {
            detail: { conversationId: conversation.id },
          })
        );
      }
      toast.success("Chat opened");
    } catch (error: any) {
      toast.error(error?.message || "Failed to contact seller");
    } finally {
      setChatting(false);
    }
  }, [ensureAuthenticated, shop.seller_id]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Shop Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="md:flex">
          {/* Shop Image */}
          <div className="relative h-64 w-full md:w-80 md:h-80 bg-slate-100">
            {shop.image ? (
              <Image src={shop.image} alt={shop.shop_name} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-amber-50">
                <Store className="h-24 w-24 text-slate-400" />
              </div>
            )}
          </div>

          {/* Shop Info */}
          <div className="flex-1 p-6 md:p-8">
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{shop.shop_name}</h1>

                {rating > 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span className="text-lg font-semibold text-slate-700">{rating.toFixed(1)}</span>
                    <span className="text-sm text-slate-500">
                      ({shop.products || 0} {shop.products === 1 ? "product" : "products"})
                    </span>
                  </div>
                )}

                {shop.owner_name && (
                  <p className="text-sm text-slate-600">
                    by <span className="font-medium">{shop.owner_name}</span>
                  </p>
                )}
              </div>

              {shop.description && <p className="text-slate-700 leading-relaxed">{shop.description}</p>}

              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  variant="outline"
                  className="border-slate-300 hover:bg-white"
                  onClick={handleContactSeller}
                  disabled={chatting}
                >
                  <MessageCircle className="mr-2 h-4 w-4" /> Contact Seller
                </Button>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                {shop.status === "approved" && (
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2">
                    <Shield className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700">Verified Shop</span>
                  </div>
                )}
                <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">Quality Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Products</h2>
            <p className="text-sm text-slate-600 mt-1">
              {products.length} {products.length === 1 ? "product" : "products"} available
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-500">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">No products available from this shop at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
