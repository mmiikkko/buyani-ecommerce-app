"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Store, User, Star, Loader2, Sparkles, ShoppingBag, Send, Package, MessageCircle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AnimatedSection } from "@/components/animated-section";
import { AnimatedProductCard } from "../../_components/animated-product-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviewOverlay, setShowReviewOverlay] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [averageRating, setAverageRating] = useState(shop.shop_rating ? Number(shop.shop_rating) : 0);
  const [reviewCount, setReviewCount] = useState(0);

  // Category Filtering State
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const loadProducts = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const res = await fetch(`/api/shops/${shopId}/products`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load products (status: ${res.status})`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching shop products:", err);
      setError(err instanceof Error ? err.message : "Failed to load products.");
      setProducts([]);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  const loadReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await fetch(`/api/shops/${shopId}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
        setReviewCount(data.length);
      }
    } catch (err) {
      console.error("Error loading shop reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    loadProducts();
    loadReviews();
    intervalId = setInterval(() => {
      loadProducts(true);
      loadReviews();
    }, 10000);
    const onFocus = () => {
      loadProducts(true);
      loadReviews();
    };
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
    };
  }, [shopId]);

  // Extract unique categories from products
  const categoriesList = useMemo(() => {
    const cats = new Set<string>();
    cats.add("All");
    products.forEach((p) => {
      if ((p as any).categoryName) {
        cats.add((p as any).categoryName);
      }
    });
    return Array.from(cats);
  }, [products]);

  // Filtered products based on selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return products;
    return products.filter((p) => (p as any).categoryName === selectedCategory);
  }, [products, selectedCategory]);

  const handleSubmitReview = async () => {
    if (reviewRating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/shops/${shopId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: reviewRating, comment: "" }),
      });
      if (!res.ok) throw new Error("Failed to submit review");
      const data = await res.json();
      toast.success("Thank you for your rating!");
      setShowReviewOverlay(false);
      setReviewRating(0);
      setAverageRating(Number(data.averageRating));
      loadReviews();
    } catch (err) {
      toast.error("Could not submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const shopImage = shop.image || "/placeholder-shop.png";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* 1. Header & Navigation */}
      <div className="space-y-6">
        <AnimatedSection direction="fade-in" delay={0}>
          <Button
            variant="ghost"
            className="group hover:bg-white/80 backdrop-blur-sm rounded-xl transition-all"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>
        </AnimatedSection>

        {/* Shop Identity Card */}
        <AnimatedSection direction="fade-up" delay={100}>
          <div className="relative rounded-[2.5rem] border-2 border-white/50 bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 p-8 md:p-10 shadow-2xl shadow-blue-500/5 backdrop-blur-md overflow-hidden ring-1 ring-black/[0.02]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-300/10 to-purple-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-300/10 to-blue-300/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-10"></div>

            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-10">
              <div className="group relative w-48 h-48 md:w-56 md:h-56 flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl rotate-3 scale-105 opacity-20 group-hover:rotate-6 transition-transform"></div>
                <div className="relative h-full w-full rounded-2xl overflow-hidden bg-white shadow-xl ring-8 ring-white/80">
                  <Image
                    src={shopImage}
                    alt={shop.shop_name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized={shopImage.startsWith("data:")}
                  />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                      <Store className="w-6 h-6" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent tracking-tight">
                      {shop.shop_name}
                    </h1>
                  </div>
                  {shop.description && (
                    <p className="text-slate-600 text-lg leading-relaxed max-w-2xl font-medium">
                      {shop.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-50/50 border border-blue-100/50 text-blue-700 shadow-sm backdrop-blur-sm">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-bold">{shop.owner_name || "Merchant"}</span>
                  </div>
                  {/* Product Count Badge */}
                  <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-50/50 border border-emerald-100/50 text-emerald-700 shadow-sm backdrop-blur-sm font-bold text-sm">
                    <ShoppingBag className="h-4 w-4" />
                    <span>{products.length} Items</span>
                  </div>

                  {/* Rating Info & Quick Rate Trigger - Now Grouped with Items */}
                  {averageRating > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-50/50 border border-amber-200/50 text-amber-700 shadow-sm backdrop-blur-sm">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-extrabold text-sm">{averageRating.toFixed(1)}</span>
                    </div>
                  )}

                  <Button
                    onClick={() => setShowReviewOverlay(true)}
                    className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 px-6 font-bold h-[2.85rem]"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Rate Shop
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* 2. Product Catalog */}
      <AnimatedSection direction="fade-up" delay={200}>
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-12 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 rounded-full"></div>
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <Sparkles className="w-7 h-7 text-blue-500 animate-pulse" />
                    <h2 className="text-4xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-950 bg-clip-text text-transparent tracking-tight">
                      Products
                    </h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    <p className="text-base text-slate-600 font-bold">
                      {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"} available
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Filter Buttons */}
            {categoriesList.length > 1 && (
              <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                <div className="px-3 text-slate-400 flex items-center gap-2 border-r border-slate-200 mr-1">
                  <Filter className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Categories</span>
                </div>
                {categoriesList.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-xl px-4 font-bold text-xs transition-all ${selectedCategory === category
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                        : "text-slate-500 hover:bg-white hover:text-blue-600 shadow-sm"
                      }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-80 bg-slate-100 rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-red-50 rounded-[3rem] border-2 border-dashed border-red-200">
              <Store className="h-12 w-12 text-red-300 mx-auto mb-4" />
              <p className="text-red-900 font-bold">{error}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 font-bold text-lg">No products cataloged in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
              {filteredProducts.map((product, index) => (
                <AnimatedProductCard key={product.id} product={product} delay={index * 50} />
              ))}
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* 3. Community Feedback */}
      <AnimatedSection direction="fade-up" delay={300}>
        <div className="space-y-10 py-12 bg-slate-50/50 rounded-[3rem] border border-slate-100/50 px-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-slate-900 underline decoration-blue-500/30 decoration-6 underline-offset-8">Community Feedback</h2>
            <p className="text-slate-500 text-lg">What people love about {shop.shop_name}</p>
          </div>
          {loadingReviews ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center p-12 space-y-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                <MessageCircle className="h-10 w-10 text-slate-200" />
              </div>
              <p className="text-slate-500 font-medium italic">Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="group bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ring-1 ring-black/[0.01]">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 text-xl font-black">
                      {rev.buyerName?.charAt(0) || "B"}
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">{rev.buyerName || "Merchant Customer"}</p>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{new Date(rev.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < rev.rating ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200"}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* 4. Rating Overlay (Dialog) */}
      <Dialog open={showReviewOverlay} onOpenChange={setShowReviewOverlay}>
        <DialogContent className="sm:max-w-md rounded-[2rem] border-none bg-white p-0 overflow-hidden shadow-2xl">
          <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          <div className="p-8 space-y-8">
            <DialogHeader className="text-left space-y-2">
              <DialogTitle className="text-3xl font-black text-slate-900 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-blue-500" />
                Rate this Shop
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-lg font-medium">
                Your rating helps other buyers discover high-quality merchants.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-between gap-2 px-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className="group relative focus:outline-none transition-all hover:scale-110 active:scale-90"
                >
                  <Star
                    className={`h-12 w-12 transition-all duration-300 ${star <= reviewRating
                      ? "fill-amber-400 text-amber-400 drop-shadow-md"
                      : "fill-slate-100 text-slate-200 group-hover:text-amber-200"
                      }`}
                  />
                  {star === reviewRating && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 border-2 border-white rounded-full animate-ping"></div>
                  )}
                </button>
              ))}
            </div>

            {reviewRating > 0 && (
              <div className="text-center py-2 px-4 bg-blue-50 rounded-2xl animate-in zoom-in-95">
                <span className="text-blue-700 font-black text-xl">
                  {reviewRating === 5 ? "🌟 Excellent!" : reviewRating >= 4 ? "✨ Great" : reviewRating >= 3 ? "👍 Good" : "😊 Fair"}
                </span>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowReviewOverlay(false)}
                className="flex-1 rounded-2xl h-14 font-bold text-slate-600 border-slate-200 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReview}
                disabled={submittingReview || reviewRating === 0}
                className="flex-[2] rounded-2xl h-14 bg-slate-900 hover:bg-black text-white font-black shadow-xl shadow-slate-900/10 active:scale-95 transition-all"
              >
                {submittingReview ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-3" />
                    Submit Rating
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
