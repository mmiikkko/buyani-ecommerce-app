"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/queries/cart";
import type { Product } from "@/types/products";
import {
  ArrowLeft, CheckCircle2, Home, Loader2, MessageCircle, Minus,
  Plus, Shield, ShoppingCart,
  Star, Send
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { AddToCartModal } from "../../_components/add-to-cart-modal";
import { AnimatedSection } from "@/components/animated-section";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type ProductDetailClientProps = {
  product: Product;
  userId?: string;
};

export function ProductDetailClient({ product, userId }: ProductDetailClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [existingReviewForOrder, setExistingReviewForOrder] = useState<any>(null);

  const productPrice = Number(product.price ?? 0);
  const productStock = product.stock ?? 0;
  const productImages = [...product.images]
  .sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
  .map(img => img.image_url);


  const primaryImage = productImages[selectedImageIndex] ?? "";
  const isOutOfStock = !product.isAvailable || productStock <= 0;
  
  // Parse rating (assuming format like "4.8" or "4.8/5")
  const rating = product.rating ? Number(product.rating) : 0;
  const reviewCount = product.reviewCount ?? 0;

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
    setIsAddingToCart(true);
    // Small delay for visual feedback
    setTimeout(() => {
      setModalOpen(true);
      setIsAddingToCart(false);
    }, 50);
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
      startTransition(() => {
        router.push("/cart?checkout=1");
      });
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

  // Fetch reviews for this product
  useEffect(() => {
    async function fetchReviews() {
      setLoadingReviews(true);
      try {
        const response = await fetch(`/api/reviews?productId=${product.id}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoadingReviews(false);
      }
    }
    fetchReviews();
  }, [product.id]);

  // Fetch user orders that contain this product
  useEffect(() => {
    if (!userId) return;
    
    async function fetchUserOrders() {
      setLoadingOrders(true);
      try {
        const response = await fetch("/api/orders");
        if (response.ok) {
          const orders = await response.json();
          // Filter orders that contain this product
          const ordersWithProduct = orders.filter((order: any) => 
            order.items?.some((item: any) => item.productId === product.id)
          );
          setUserOrders(ordersWithProduct);
          if (ordersWithProduct.length > 0) {
            setSelectedOrderId(ordersWithProduct[0].id || ordersWithProduct[0].orderId);
          }
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    }
    fetchUserOrders();
  }, [userId, product.id]);

  const handleSubmitReview = async () => {
    if (!userId) {
      toast.error("Please sign in to submit a review");
      return;
    }

    if (!selectedOrderId) {
      toast.error("Please select an order");
      return;
    }

    if (reviewRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrderId,
          rating: reviewRating,
          comment: reviewComment.trim() || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit review");
      }

      const result = await response.json();
      toast.success(existingReviewForOrder ? "Review updated successfully!" : "Review submitted successfully!");
      setShowReviewForm(false);
      setReviewRating(0);
      setReviewComment("");
      setExistingReviewForOrder(null);
      
      // Refresh reviews after a short delay to ensure DB is updated
      setTimeout(async () => {
        try {
          const reviewsResponse = await fetch(`/api/reviews?productId=${product.id}`);
          if (reviewsResponse.ok) {
            const data = await reviewsResponse.json();
            setReviews(Array.isArray(data) ? data : []);
          } else {
            console.error("Failed to refresh reviews:", await reviewsResponse.text());
          }
        } catch (error) {
          console.error("Error refreshing reviews:", error);
        }
      }, 500);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <AnimatedSection direction="fade-in" delay={0}>
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => {
            startTransition(() => {
              router.back();
            });
          }}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <ArrowLeft className="h-4 w-4 mr-2" />
          )}
          Back
        </Button>
      </AnimatedSection>
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Side - Product Images */}
        <AnimatedSection direction="fade-right" delay={100}>
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
        </AnimatedSection>

        {/* Right Side - Product Information */}
        <AnimatedSection direction="fade-left" delay={200}>
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
              className="flex-1 bg-emerald-600 px-6 py-6 text-base font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition-all"
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAddingToCart}
            >
              {isAddingToCart ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </>
              )}
            </Button>
            <Button
              className="flex-1 bg-orange-500 px-6 py-6 text-base font-semibold text-white hover:bg-orange-600 disabled:opacity-50 transition-all"
              onClick={handleBuyNow}
              disabled={isBuying || isOutOfStock}
            >
              {isBuying ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Buy Now"
              )}
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
        </AnimatedSection>
      </div>

      {/* Reviews Section */}
      <AnimatedSection direction="fade-up" delay={300}>
        <div className="mt-12 space-y-6">
          <div className="border-t border-slate-200 pt-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Customer Reviews</h2>
                {reviewCount > 0 && (
                  <p className="text-sm text-slate-600 mt-1">
                    {reviewCount} {reviewCount === 1 ? "review" : "reviews"} • Average rating: {rating.toFixed(1)}
                  </p>
                )}
              </div>
              {userId && userOrders.length > 0 && !showReviewForm && (
                <Button
                  onClick={() => setShowReviewForm(true)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Star className="mr-2 h-4 w-4" />
                  Write a Review
                </Button>
              )}
            </div>

            {/* Review Submission Form */}
            {showReviewForm && userId && userOrders.length > 0 && (
              <div className="mb-8 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {existingReviewForOrder ? "Edit Your Review" : "Write a Review"}
                  </h3>
                  {existingReviewForOrder && (
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                      Editing existing review
                    </span>
                  )}
                </div>
                
                {existingReviewForOrder && (
                  <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-600 mb-1">Your current review:</p>
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < existingReviewForOrder.rating
                              ? "fill-amber-400 text-amber-400"
                              : "fill-slate-200 text-slate-200"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-slate-600 ml-1">
                        {existingReviewForOrder.rating}/5
                      </span>
                    </div>
                    {existingReviewForOrder.comment && (
                      <p className="text-xs text-slate-700 italic">"{existingReviewForOrder.comment}"</p>
                    )}
                  </div>
                )}
                
                <div className="space-y-4">
                  {/* Order Selection */}
                  {userOrders.length > 1 && (
                    <div className="space-y-2">
                      <Label htmlFor="order-select">Select Order</Label>
                      <select
                        id="order-select"
                        value={selectedOrderId}
                        onChange={(e) => {
                          setSelectedOrderId(e.target.value);
                          checkExistingReview(e.target.value);
                        }}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {userOrders.map((order) => {
                          const orderId = order.id || order.orderId;
                          const hasReview = reviews.some((r: any) => r.orderId === orderId);
                          return (
                            <option key={orderId} value={orderId}>
                              Order #{orderId} - {new Date(order.createdAt).toLocaleDateString()}
                              {hasReview ? " (Reviewed)" : ""}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}

                  {/* Rating Selection */}
                  <div className="space-y-2">
                    <Label>Rating *</Label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= reviewRating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-slate-200 text-slate-200"
                            }`}
                          />
                        </button>
                      ))}
                      {reviewRating > 0 && (
                        <span className="ml-2 text-sm font-medium text-slate-700">
                          {reviewRating} out of 5
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="space-y-2">
                    <Label htmlFor="review-comment">Your Review (Optional)</Label>
                    <Textarea
                      id="review-comment"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience with this product..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      onClick={handleSubmitReview}
                      disabled={submittingReview || reviewRating === 0}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {submittingReview ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit Review
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowReviewForm(false);
                        setReviewRating(0);
                        setReviewComment("");
                      }}
                      disabled={submittingReview}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {!userId && (
              <div className="mb-6 bg-slate-50 rounded-xl border border-slate-200 p-4 text-center">
                <p className="text-sm text-slate-600">
                  <Link href={`/sign-in?redirect=${encodeURIComponent(`/products/${product.id}`)}`} className="text-emerald-600 hover:underline">
                    Sign in
                  </Link>{" "}
                  to write a review
                </p>
              </div>
            )}

            {userId && userOrders.length === 0 && !loadingOrders && (
              <div className="mb-6 bg-slate-50 rounded-xl border border-slate-200 p-4 text-center">
                <p className="text-sm text-slate-600">
                  Purchase this product to write a review
                </p>
              </div>
            )}

            {loadingReviews ? (
              <div className="text-center py-12">
                <p className="text-slate-500">Loading reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <Star className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {(showAllReviews ? reviews : reviews.slice(0, 5)).map((review) => (
                  <div
                    key={review.reviewId}
                    className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-slate-900">{review.buyerName || "Anonymous"}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {review.buyerEmail}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-slate-200 text-slate-200"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm font-medium text-slate-700">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-slate-700 leading-relaxed mt-3">{review.comment}</p>
                    )}
                    {review.createdAt && (
                      <p className="text-xs text-slate-500 mt-3">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                ))}
                
                {/* View All Reviews Button */}
                {reviews.length > 5 && (
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowAllReviews(!showAllReviews)}
                      className="border-slate-300 hover:bg-slate-50"
                    >
                      {showAllReviews ? (
                        <>
                          Show Less Reviews
                        </>
                      ) : (
                        <>
                          View All Reviews ({reviews.length})
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </AnimatedSection>

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
