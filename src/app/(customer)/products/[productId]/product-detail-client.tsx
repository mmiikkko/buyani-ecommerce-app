"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/queries/cart";
import type { Product } from "@/types/products";
import {
  ArrowLeft, CheckCircle2, Home, Loader2, MessageCircle, Minus,
  Plus, Shield, ShoppingCart,
  Star, Send, AlertCircle
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { RatingOverlay } from "../../_components/rating-overlay";
import { AddToCartModal } from "../../_components/add-to-cart-modal";
import { AnimatedSection } from "@/components/animated-section";

type ProductDetailClientProps = {
  product: Product;
  userId?: string;
};

type Variation = {
  id: string;
  variationName: string;
  variationType: string;
  variationValue: string;
  price: string;
  SKU: string;
  quantityInStock?: number; // Fetched via API logic
};

// Helper to parse variation value (JSON or String)
const parseVariationValue = (val: string) => {
  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
};

const getCategoryStyles = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes("fresh") || name.includes("veg") || name.includes("fruit"))
    return "bg-emerald-100 text-emerald-700 hover:bg-emerald-200";
  if (name.includes("meat") || name.includes("poultry"))
    return "bg-rose-100 text-rose-700 hover:bg-rose-200";
  if (name.includes("sea") || name.includes("fish"))
    return "bg-cyan-100 text-cyan-700 hover:bg-cyan-200";
  if (name.includes("grain") || name.includes("rice") || name.includes("bake"))
    return "bg-amber-100 text-amber-700 hover:bg-amber-200";
  if (name.includes("collect") || name.includes("toy") || name.includes("hobby"))
    return "bg-purple-100 text-purple-700 hover:bg-purple-200";
  if (name.includes("electro") || name.includes("tech") || name.includes("gadget"))
    return "bg-indigo-100 text-indigo-700 hover:bg-indigo-200";

  return "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"; // Default
};

export function ProductDetailClient({ product, userId }: ProductDetailClientProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Auto-refresh product data every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      startTransition(() => {
        router.refresh();
      });
    }, 10000);

    // Refresh on focus
    const onFocus = () => {
      startTransition(() => {
        router.refresh();
      });
    };
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
    };
  }, [router]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [hasExistingReview, setHasExistingReview] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const [showAllReviews, setShowAllReviews] = useState(false);
  const [existingReviewForOrder, setExistingReviewForOrder] = useState<any>(null);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [availableVariations, setAvailableVariations] = useState<Variation[]>([]);
  const [currentVariation, setCurrentVariation] = useState<Variation | null>(null);

  // Initialize variations
  useEffect(() => {
    if (product.variations) {
      // Cast or assume ANY for now as product type might not match exact API response yet
      // The API returns 'variations' as array of DB objects.
      const vars = product.variations as unknown as Variation[];
      setAvailableVariations(vars);

      // Auto-select if only 1 - REMOVED per user request to force click
      /* if (vars.length === 1) {
        setCurrentVariation(vars[0]);
      } */
    }
  }, [product.variations]);

  // Determine available candidates based on current selections
  const candidates = useMemo(() => {
    if (availableVariations.length === 0) return [];

    return availableVariations.filter(v => {
      const val = parseVariationValue(v.variationValue);

      if (typeof val === 'string') {
        const selectedForType = selectedOptions[v.variationType || "Variation"];
        return !selectedForType || selectedForType === val;
      }

      if (typeof val === 'object' && val !== null) {
        return Object.entries(val).every(([k, v]) => {
          const userSelection = selectedOptions[k];
          return !userSelection || userSelection === String(v);
        });
      }

      return true;
    });
  }, [availableVariations, selectedOptions]);

  // Set current variation only if we have narrowed it down effectively
  // or if there's only one selection possible.
  useEffect(() => {
    if (candidates.length === 1) {
      setCurrentVariation(candidates[0]);
    } else if (Object.keys(selectedOptions).length === 0 && availableVariations.length > 0) {
      // If nothing selected, don't pin to a specific one for display purposes,
      // but keep a fallback for 'Add to Cart' if they don't care (optional choice)
      // Actually, let's keep it null until they pick if multiple exist.
      setCurrentVariation(null);
    } else {
      // Multiple candidates or no match (shouldn't happen with valid UI)
      setCurrentVariation(null);
    }
  }, [candidates, selectedOptions, availableVariations]);

  // Compute Attributes Map from Variations
  const attributes = useMemo(() => {
    if (!product.variations) return {};
    const attrs: Record<string, Set<string>> = {};

    (product.variations as unknown as Variation[]).forEach(v => {
      const val = parseVariationValue(v.variationValue);
      if (typeof val === 'object' && val !== null) {
        Object.entries(val).forEach(([k, v]) => {
          if (!attrs[k]) attrs[k] = new Set();
          attrs[k].add(String(v));
        });
      } else if (typeof val === 'string') {
        // Handle simple string values - use variationType as category or "Variation"
        const type = v.variationType || "Variation";
        if (!attrs[type]) attrs[type] = new Set();
        attrs[type].add(val);
      }
    });

    return attrs;
  }, [product.variations]);

  const displayPrice = useMemo(() => {
    if (currentVariation) {
      return `₱${Number(currentVariation.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    const activePrices = candidates.length > 0 ? candidates : availableVariations;
    if (activePrices.length > 0) {
      const prices = activePrices.map(v => Number(v.price)).filter(p => !isNaN(p));
      const min = Math.min(...prices);
      const max = Math.max(...prices);

      if (min === max) {
        return `₱${min.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
      return `₱${min.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - ₱${max.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    return `₱${Number(product.price ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [currentVariation, candidates, availableVariations, product.price]);

  const displayStock = useMemo(() => {
    if (currentVariation) {
      return (currentVariation as any).quantityInStock || 0;
    }

    // If multiple candidates, show aggregate of those candidates
    if (candidates.length > 0) {
      return candidates.reduce((sum, v) => sum + ((v as any).quantityInStock || 0), 0);
    }

    return product.stock ?? 0;
  }, [currentVariation, candidates, product.stock]);


  const productPrice = currentVariation ? Number(currentVariation.price) : Number(product.price ?? 0);
  const productStock = displayStock;

  const isVariationSelected = availableVariations.length > 0 && currentVariation !== null;

  const canAddToCart = (!product.variations?.length) || isVariationSelected;
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

  const checkExistingReview = (orderId: string) => {
    const existing = reviews.find((r) => r.orderId === orderId);
    setExistingReviewForOrder(existing ?? null);
    setHasExistingReview(!!existing);
  };


  const handleAddToCart = async () => {
    if (!ensureAuthenticated(`/products/${product.id}`)) return;

    try {
      setIsAddingToCart(true);

      // Determine Variation ID
      let variationId = currentVariation?.id;
      if (!variationId && (!product.variations || product.variations.length === 0)) {
        // Should not happen if data is consistent, but if simple product with no vars (legacy?), 
        // we can't add to cart without variationId as per new schema.
        // Effectively this item is unsaleable until migrated.
        toast.error("Product configuration error. Cannot add to cart.");
        setIsAddingToCart(false);
        return;
      }

      if (!variationId) {
        toast.error("Please click on a variation option (e.g., Size, Color) to select it.");
        setIsAddingToCart(false);
        return;
      }

      const result = await addToCart(userId!, variationId!, quantity);
      if (result.success) {
        toast.success("Added to cart!");
      } else {
        toast.error(result.error ?? "Failed to add to cart.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart.");
    } finally {
      setIsAddingToCart(false);
    }
  };


  const handleBuyNow = async () => {
    if (!ensureAuthenticated(`/products/${product.id}`)) {
      return;
    }

    try {
      setIsBuying(true);

      let variationId = currentVariation?.id;
      if (!variationId) {
        toast.error("Please select options.");
        setIsBuying(false);
        return;
      }

      const result = await addToCart(userId!, variationId, quantity);
      if (!result.success) {
        toast.error(result.error ?? "Failed to add item to cart.");
        setIsBuying(false);
        return;
      }
      // Keep loading state until redirect completes
      router.push(`/checkout?productId=${product.id}&quantity=${quantity}`);
      // Loading state will be reset when component unmounts on navigation
    } catch (error) {
      console.error(error);
      toast.error("Failed to start checkout.");
      setIsBuying(false);
    }
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newQuantity = Math.max(1, Math.min(prev + delta, productStock));
      return newQuantity;
    });
  };

  const handleQuantityInput = (value: string) => {
    const num = Number(value);

    if (Number.isNaN(num)) return;

    if (num < 1) {
      setQuantity(1);
    } else if (num > productStock) {
      setQuantity(productStock);
    } else {
      setQuantity(num);
    }
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

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!userId) {
      toast.error("Please sign in to submit a review");
      return;
    }

    if (!selectedOrderId) {
      toast.error("Please select an order");
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrderId,
          rating,
          comment: comment.trim() || null,
        }),
      });

      if (response.ok) {
        toast.success("Review submitted successfully!");
        setShowReviewForm(false);
        // Refresh reviews
        const res = await fetch(`/api/reviews?productId=${product.id}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(Array.isArray(data) ? data : []);
        }
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    if (isBuying) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isBuying]);


  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-50 via-slate-50 to-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <AnimatedSection direction="fade-in" delay={0}>
          <Button
            variant="ghost"
            className="mb-6 cursor-pointer"
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
            <div className="space-y-6">
              {/* Main Image */}
              <div className="group relative aspect-square w-full overflow-hidden rounded-[2rem] bg-white p-2 shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
                <div className="relative h-full w-full overflow-hidden rounded-[1.8rem]">
                  {primaryImage ? (
                    <Image
                      src={primaryImage}
                      alt={product.productName}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      priority
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-slate-500">
                      No image available
                    </div>
                  )}
                  {/* Glassy Overlay for Image */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              </div>

              {/* Image Thumbnails */}
              {productImages.length > 1 && (
                <div className="flex items-center justify-center gap-3 overflow-x-auto py-2 scrollbar-hide">
                  {productImages.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-300 transform ${selectedImageIndex === index
                        ? "border-emerald-500 scale-110 shadow-lg ring-4 ring-emerald-500/20"
                        : "border-white bg-white hover:border-slate-300 hover:scale-105 shadow-sm"
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
          <AnimatedSection direction="fade-left" delay={200} className="lg:sticky lg:top-8 self-start">
            <div className="space-y-6 rounded-[2rem] border border-white/40 bg-white/60 p-7 shadow-xl backdrop-blur-xl transition-all duration-500 hover:shadow-2xl lg:p-8">
              <div className="space-y-4">
                {/* Category & Verified Badge */}
                <div className="flex items-center justify-between">
                  {product.categoryName && (
                    <Badge className={`${getCategoryStyles(product.categoryName)} transition-colors border-none px-4 py-1.5 text-xs font-bold uppercase tracking-widest shadow-sm`}>
                      {product.categoryName}
                    </Badge>
                  )}
                </div>

                {/* Product Name */}
                <div className="space-y-2">
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 lg:text-4xl leading-tight">
                    {product.productName}
                  </h1>

                  {/* Rating and Stock */}
                  <div className="flex flex-wrap items-center gap-6">
                    {rating > 0 && reviewCount > 0 && (
                      <div className="group flex items-center gap-2 cursor-pointer transition-transform hover:scale-105" onClick={() => setShowAllReviews(!showAllReviews)}>
                        <div className="flex items-center gap-1.5">
                          <Star className="h-6 w-6 fill-amber-400 text-amber-400 drop-shadow-sm transition-transform group-hover:rotate-12" />
                          <span className="text-2xl font-black text-slate-900">{rating.toFixed(1)}</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-500 border-b border-dotted border-slate-300">
                          {reviewCount} Reviews
                        </span>
                      </div>
                    )}
                    <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest shadow-sm transition-all duration-300 ${displayStock <= 0 ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-600"}`}>
                      <div className={`h-2 w-2 rounded-full animate-pulse ${displayStock <= 0 ? "bg-red-500" : "bg-emerald-500"}`} />
                      <span>{displayStock} Left in Stock</span>
                    </div>
                  </div>
                </div>

                {/* Out of Stock Alert - Top */}
                {isOutOfStock && (
                  <div className="flex items-center gap-3 rounded-2xl bg-red-50 border-2 border-red-100/50 p-5 text-red-800 shadow-inner animate-in fade-in zoom-in duration-500">
                    <AlertCircle className="h-6 w-6 shrink-0" />
                    <div>
                      <p className="text-sm font-black uppercase tracking-widest">Currently Unavailable</p>
                      <p className="text-xs font-medium opacity-80">We'll notify the community when this item restocks.</p>
                    </div>
                  </div>
                )}

                {/* Price Section */}
                <div className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-emerald-600 to-teal-700 p-6 shadow-2xl transition-all duration-500 hover:shadow-emerald-500/20">
                  <div className="relative z-10 flex items-baseline gap-1">
                    <span className="text-4xl font-black tracking-tighter text-white drop-shadow-md">
                      {displayPrice}
                    </span>
                  </div>
                  {/* Decorative Elements */}
                  <div className="absolute right-[-10%] top-[-20%] h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                  <div className="absolute bottom-[-20%] left-[-10%] h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl" />
                </div>

                {/* Variation Selectors */}
                {Object.keys(attributes).length > 0 && (
                  <div className="space-y-4">
                    {Object.entries(attributes).map(([attrName, values]) => (
                      <div key={attrName} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{attrName}</label>
                          {selectedOptions[attrName] && (
                            <button
                              onClick={() => {
                                const newOpts = { ...selectedOptions };
                                delete newOpts[attrName];
                                setSelectedOptions(newOpts);
                              }}
                              className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 underline transition-colors"
                            >
                              Unselect
                            </button>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {Array.from(values).map((value: any) => {
                            const isSelected = selectedOptions[attrName] === value;
                            return (
                              <button
                                key={value}
                                onClick={() => {
                                  if (isSelected) {
                                    const newOpts = { ...selectedOptions };
                                    delete newOpts[attrName];
                                    setSelectedOptions(newOpts);
                                  } else {
                                    setSelectedOptions(prev => ({ ...prev, [attrName]: value }));
                                  }
                                }}
                                className={`
                                relative min-w-[2.5rem] overflow-hidden px-4 py-2.5 rounded-xl text-xs font-bold border-2 transition-all duration-300 transform active:scale-95
                                ${isSelected
                                    ? "border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-500/40"
                                    : "border-slate-100 bg-slate-50 text-slate-600 hover:border-emerald-200 hover:bg-slate-100"}
                              `}
                              >
                                {value}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Description */}
                <div className="space-y-3 rounded-2xl bg-slate-50 p-6 transition-colors hover:bg-slate-100/80">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Product Description</h3>
                  <p className="text-sm font-medium leading-relaxed text-slate-600">
                    {product.description || "Every harvest tells a story. This carefully curated product represents the heart of our community's artisans, delivered with a commitment to local growth and exceptional quality."}
                  </p>
                </div>

                {/* Quantity and Actions Combined for Premium Feel */}
                <div className="space-y-6 pt-4">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Pick Quantity</label>
                      <div className="flex items-center h-14 w-fit overflow-hidden rounded-2xl border-2 border-slate-100 bg-white shadow-sm transition-all focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-full w-14 rounded-none hover:bg-slate-50 hover:text-emerald-600 transition-colors cursor-pointer"
                          onClick={() => handleQuantityChange(-1)}
                          disabled={quantity <= 1}
                        >
                          <Minus className="h-5 w-5" />
                        </Button>
                        <input
                          type="number"
                          min={1}
                          max={productStock}
                          value={quantity}
                          onChange={(e) => handleQuantityInput(e.target.value)}
                          className="w-14 bg-transparent text-center text-lg font-black text-slate-900 outline-none [appearance:none] [-moz-appearance:textfield]"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-full w-14 rounded-none hover:bg-slate-50 hover:text-emerald-600 transition-colors cursor-pointer"
                          onClick={() => handleQuantityChange(1)}
                          disabled={quantity >= (currentVariation ? (currentVariation as any).quantityInStock : productStock)}
                        >
                          <Plus className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      {/* Action Buttons with Dynamic States */}
                      <div className="flex flex-col gap-2 pt-2">
                        <Button
                          className="group relative h-14 w-full overflow-hidden rounded-xl bg-emerald-600 px-8 text-lg font-black text-white transition-all duration-500 hover:bg-emerald-700 hover:shadow-2xl hover:shadow-emerald-500/30 active:scale-95 disabled:opacity-50 cursor-pointer"
                          onClick={handleAddToCart}
                          disabled={!!isOutOfStock || !!isAddingToCart || !!(currentVariation && (currentVariation as any).quantityInStock <= 0)}
                        >
                          <span className="relative z-10 flex items-center justify-center gap-3">
                            {isAddingToCart ? (
                              <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                              <ShoppingCart className="h-6 w-6 transition-transform group-hover:-rotate-12" />
                            )}
                            {isAddingToCart ? "Securing..." : "Add to Cart"}
                          </span>
                          <div className="absolute inset-0 z-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </Button>

                        <Button
                          className="h-14 w-full rounded-xl bg-slate-100 px-8 text-lg font-black text-slate-800 transition-all duration-500 hover:bg-orange-500 hover:text-white hover:shadow-2xl hover:shadow-orange-500/30 active:scale-95 disabled:opacity-50 cursor-pointer"
                          onClick={handleBuyNow}
                          disabled={!!isBuying || !!isOutOfStock || !!(currentVariation && (currentVariation as any).quantityInStock <= 0)}
                        >
                          {isBuying ? "Preparing..." : "Express Checkout"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seller Information - Refined Glass Card */}
                {product.shopName && (
                  <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-white/60 bg-white/40 p-6 backdrop-blur-md transition-all duration-300 hover:bg-white/60 hover:shadow-lg">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-emerald-100 text-emerald-700 shadow-inner">
                          {product.shopImage ? (
                            <Image
                              src={product.shopImage}
                              alt={product.shopName || "Shop"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Home className="h-7 w-7" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-slate-900 tracking-tight">{product.shopName}</h3>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/shops/${product.shopId}`}>
                          <Button variant="outline" className="h-10 rounded-xl border-slate-200 bg-white px-4 text-xs font-bold transition-all hover:bg-slate-50 hover:scale-105 active:scale-95 cursor-pointer">
                            Profile
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          className="h-10 rounded-xl border-emerald-200 bg-emerald-50/50 px-4 text-xs font-bold text-emerald-700 transition-all hover:bg-emerald-100 hover:scale-105 active:scale-95 cursor-pointer"
                          onClick={handleChatSeller}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
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
                    className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Write a Review
                  </Button>
                )}
              </div>


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
                              className={`h-4 w-4 ${i < review.rating
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

                  {isBuying && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                      <div className="flex flex-col items-center gap-4 rounded-xl bg-white px-8 py-6 shadow-xl">
                        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
                        <p className="text-sm font-medium text-slate-700">
                          Processing your order...
                        </p>
                      </div>
                    </div>
                  )}

                </div>


              )}
            </div>
          </div>
        </AnimatedSection >

        <RatingOverlay
          open={showReviewForm}
          onOpenChange={setShowReviewForm}
          onSubmit={handleSubmitReview}
          title={existingReviewForOrder ? "Edit Your Review" : "Write a Review"}
          description={`Share your experience with ${product.productName}.`}
          showCommentField
          placeholder="What did you like or dislike about this product?"
        >
          {/* Order Selection (if multiple orders) */}
          {userOrders.length > 1 && (
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Select Order to Review</label>
              <select
                value={selectedOrderId}
                onChange={(e) => {
                  setSelectedOrderId(e.target.value);
                  checkExistingReview(e.target.value);
                }}
                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                {userOrders.map((order) => {
                  const orderId = order.id || order.orderId;
                  const hasReview = reviews.some((r: any) => r.orderId === orderId);
                  return (
                    <option key={orderId} value={orderId}>
                      Order #{orderId.substring(0, 8)} - {new Date(order.createdAt).toLocaleDateString()}
                      {hasReview ? " (Already Reviewed)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {existingReviewForOrder && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Your current review:</p>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < existingReviewForOrder.rating
                      ? "fill-amber-400 text-amber-400"
                      : "fill-amber-200 text-amber-200"
                      }`}
                  />
                ))}
              </div>
              {existingReviewForOrder.comment && (
                <p className="text-sm text-amber-900 italic font-medium">"{existingReviewForOrder.comment}"</p>
              )}
            </div>
          )}
        </RatingOverlay>

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
    </div>
  );
}
