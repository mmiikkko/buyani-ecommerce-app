"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Product } from "@/types/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { addToCart } from "@/lib/queries/cart";
import { AddToCartModal } from "../../_components/add-to-cart-modal";
import {
  ShoppingCart,
  Star,
  Minus,
  Plus,
  Home,
  MessageCircle,
  Shield,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

type ProductDetailClientProps = {
  product: Product;
  userId?: string;
};

type Review = {
  reviewId: string;
  orderId: string;
  buyerId: string;
  buyerName?: string | null;
  comment?: string | null;
  rating?: number | null;
  createdAt?: string | Date | null;
};

export function ProductDetailClient({ product, userId }: ProductDetailClientProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [shopRating, setShopRating] = useState(5);

  const productPrice = Number(product.price ?? 0);
  const productStock = product.stock ?? 0;
  const productImages = [...product.images]
  .sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
  .map(img => img.image_url);


  const primaryImage = productImages[selectedImageIndex] ?? "";
  const isOutOfStock = !product.isAvailable || productStock <= 0;
  
  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`/api/reviews?productId=${product.id}`);
        if (!res.ok) return;
        const data = await res.json();
        setReviews(
          Array.isArray(data)
            ? data.map((r) => ({
                reviewId: r.reviewId || r.id || crypto.randomUUID(),
                orderId: r.orderId,
                buyerId: r.buyerId,
                buyerName: r.buyerName || r.buyerEmail || "Customer",
                comment: r.comment,
                rating: r.rating,
                createdAt: r.createdAt,
              }))
            : []
        );
      } catch (error) {
        console.error("Failed to load reviews", error);
      }
    }
    fetchReviews();
  }, [product.id]);

  const rating = useMemo(() => {
    if (reviews.length === 0) return product.rating ? Number(product.rating) : 0;
    const total = reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0);
    return reviews.length ? total / reviews.length : 0;
  }, [reviews, product.rating]);

  const reviewCount = reviews.length || product.reviewCount || 0;

  const ensureAuthenticated = (redirectTo: string) => {
    if (!userId) {
      router.push(`/sign-in?redirect=${encodeURIComponent(redirectTo)}`);
      return false;
    }
    return true;
  };

  const handleAddToCart = () => { 
    if (!ensureAuthenticated(`/products/${product.id}`)) {
      return;
    }
    setModalOpen(true);
  };

  const handleBuyNow = async () => {
    if (!ensureAuthenticated(`/products/${product.id}`)) {
      return;
    }

    try {
      setIsBuying(true);
      const result = await addToCart(userId!, product.id, quantity);
      if (!result.success) {
        toast.error(result.error ?? "Failed to add item to cart.");
        return;
      }
      router.push("/cart?checkout=1");
    } catch (error) {
      console.error(error);
      toast.error("Failed to start checkout.");
    } finally {
      setIsBuying(false);
    }
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newQuantity = Math.max(1, Math.min(prev + delta, productStock));
      return newQuantity;
    });
  };

  const handleChatSeller = async () => {
    if (!ensureAuthenticated(`/products/${product.id}`)) {
      return;
    }

    try {
      // Get seller ID from shop
      const shopRes = await fetch(`/api/shops/${product.shopId}`);
      if (!shopRes.ok) {
        toast.error("Failed to get seller information");
        return;
      }

      const shopData = await shopRes.json();
      const sellerId = shopData.seller_id;

      if (!sellerId) {
        toast.error("Seller information not found");
        return;
      }

      // Create or get existing conversation
      const convRes = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId,
          productId: product.id,
        }),
      });

      if (convRes.ok) {
        const conversation = await convRes.json();
        // Open chat FAB widget with this conversation
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("chatfab:open", {
              detail: { conversationId: conversation.id },
            })
          );
        }
        toast.success("Chat opened");
      } else {
        const error = await convRes.json();
        toast.error(error.error || "Failed to start conversation");
      }
    } catch (error) {
      console.error("Error starting chat:", error);
      toast.error("Failed to start chat");
    }
  };

  const isVerifiedSeller = product.shopStatus === "approved";

  const handleSubmitReview = async () => {
    if (!ensureAuthenticated(`/products/${product.id}`)) return;
    if (!reviewText.trim()) {
      toast.error("Please add a short review.");
      return;
    }
    setIsSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          comment: reviewText.trim(),
          rating: reviewRating,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to submit review");
      }
      const data = await res.json();
      if (data?.review) {
        setReviews((prev) => [data.review, ...prev]);
        setReviewText("");
        setReviewRating(5);
        toast.success("Review submitted!");
      }
    } catch (error: any) {
      toast.error(error?.message || "Could not submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Side - Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 shadow-lg">
            {primaryImage ? (
              <Image 
                src={primaryImage} 
                alt={product.productName} 
                fill 
                className="object-cover" 
                priority 
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
                No image available
              </div>
            )}
          </div>

          {/* Image Thumbnails */}
          {productImages.length > 1 && (
            <div className="flex items-center justify-center gap-2">
              {productImages.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImageIndex === index
                      ? "border-emerald-500 ring-2 ring-emerald-200"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <Image src={url} alt={`${product.productName} ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side - Product Information */}
        <div className="flex flex-col space-y-6">
          {/* Category Badge */}
          {product.categoryName && (
            <div>
              <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                {product.categoryName}
              </Badge>
            </div>
          )}

          {/* Product Name */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 lg:text-4xl">
              {product.productName}
            </h1>
          </div>

          {/* Rating and Stock */}
          <div className="flex flex-wrap items-center gap-4">
            {rating > 0 && reviewCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="text-lg font-semibold text-slate-900">{rating.toFixed(1)}</span>
                </div>
                <span className="text-sm text-slate-500">
                  ({reviewCount} {reviewCount === 1 ? "Review" : "Reviews"})
                </span>
              </div>
            )}
            <div className="text-sm text-slate-600">
              <span className="font-medium">{productStock}</span> in stock
            </div>
          </div>

          {/* Price */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-6">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-emerald-700">₱{productPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">Product Description</h3>
            <p className="text-base leading-relaxed text-slate-600">
              {product.description || "High-quality product from a trusted local vendor. This item is carefully selected to ensure freshness and quality. We work directly with vendors to bring you the best products at competitive prices."}
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-900">Quantity</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-r-none hover:bg-slate-100"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-l-none hover:bg-slate-100"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= productStock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-slate-500">{productStock} available</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              className="flex-1 bg-emerald-600 px-6 py-6 text-base font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              className="flex-1 bg-orange-500 px-6 py-6 text-base font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
              onClick={handleBuyNow}
              disabled={isBuying || isOutOfStock}
            >
              {isBuying ? "Processing..." : "Buy Now"}
            </Button>
          </div>

          {isOutOfStock && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
              <p className="text-sm font-medium text-red-800">This product is currently unavailable.</p>
            </div>
          )}

          {/* Seller Information */}
          {product.shopName && (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-slate-600" />
                  <h3 className="font-semibold text-slate-900">{product.shopName}</h3>
                </div>
                <div className="text-sm text-slate-600">
                  <span>Philippines</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Link href={`/shops/${product.shopId}`}>
                  <Button variant="outline" className="border-slate-300 hover:bg-white">
                    Visit Store
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="border-slate-300 hover:bg-white"
                  onClick={handleChatSeller}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat
                </Button>
              </div>
            </div>
          )}

          {/* Guarantees/Badges */}
          <div className="flex flex-wrap gap-3">
            {isVerifiedSeller && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2">
                <Shield className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Verified Seller</span>
              </div>
            )}
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Quality Guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-14 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-600 font-semibold">Feedback</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">Customer Reviews</h3>
            <p className="text-sm text-slate-600">Hear from other buyers before you decide.</p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 shadow-sm">
            <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
            <div>
              <p className="text-2xl font-bold text-slate-900 leading-none">{rating.toFixed(1)}</p>
              <p className="text-xs text-slate-600">{reviewCount} {reviewCount === 1 ? "review" : "reviews"}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            {reviews.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600 text-center shadow-sm">
                No reviews yet. Be the first to share your thoughts!
              </div>
            )}

            {reviews.map((review, idx) => {
              const key =
                review.reviewId ||
                review.orderId ||
                `${review.buyerId || "buyer"}-${idx}`;
              return (
              <div
                key={key}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-slate-900">
                      {review.rating ?? 0}/5
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{review.comment || "No comment provided."}</p>
                <p className="text-xs text-slate-500 font-medium">
                  {review.buyerName || "Customer"}
                </p>
              </div>
            );
            })}
          </div>

          {/* Write Review */}
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
              <h4 className="text-lg font-semibold text-slate-900">Leave a review</h4>
            </div>
            <p className="text-sm text-slate-600">
              Share your experience with this product and the seller. Your feedback helps other buyers.
            </p>

            <div className="space-y-2">
              <p className="text-sm text-slate-700 font-medium">Product rating</p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setReviewRating(value)}
                    className="focus:outline-none transition-transform hover:scale-105"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        reviewRating >= value ? "fill-amber-400 text-amber-400" : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              className="w-full min-h-[120px] rounded-lg border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none transition-shadow"
              placeholder="Share your experience with this product"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitReview}
                disabled={isSubmittingReview}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AddToCartModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        userId={userId ?? ""}
        product={{
          id: product.id,
          name: product.productName,
          price: productPrice,
          image: primaryImage || undefined,
        }}
      />
    </div>
  );
}
