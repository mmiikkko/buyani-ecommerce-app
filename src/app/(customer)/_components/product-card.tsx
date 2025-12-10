"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Product } from "@/types/products";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // Safely extract image URL with multiple fallbacks
  // Optimized for performance with prefetching
  const getPrimaryImage = (): string | null => {
    try {
      const images = product.images;
      if (!images || images.length === 0) return null;
      
      const firstImage = images[0];
      if (!firstImage || !firstImage.image_url) return null;
      
      const imageUrlArray = firstImage.image_url;
      if (!Array.isArray(imageUrlArray) || imageUrlArray.length === 0) return null;
      
      const url = imageUrlArray[0];
      if (!url || typeof url !== "string") return null;
      
      const trimmed = url.trim();
      if (trimmed === "" || trimmed === "null" || trimmed === "undefined") return null;
      
      // Try to validate URL format - Next.js Image is strict about this
      // Allow: http://, https://, / (relative), data: (data URI)
      if (
        trimmed.startsWith("http://") ||
        trimmed.startsWith("https://") ||
        trimmed.startsWith("/") ||
        trimmed.startsWith("data:")
      ) {
        return trimmed;
      }
      
      // If it doesn't match known patterns, it might be invalid
      return null;
    } catch (error) {
      console.error("Error extracting image URL:", error);
      return null;
    }
  };
  
  const primaryImage = getPrimaryImage();
  const rating = product.rating ? Number(product.rating) : 0;
  const price = product.price ?? 0;

  return (
    <Link
      href={`/products/${product.id}`}
      prefetch={true}
      className="group flex h-full min-h-[360px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.productName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            unoptimized={primaryImage.startsWith("data:")}
            loading="lazy"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
            No image
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-base font-semibold text-slate-900 line-clamp-2 transition-colors group-hover:text-emerald-600">
          {product.productName}
        </h3>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.round(rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-slate-200 text-slate-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-slate-700">
              {rating.toFixed(1)}
            </span>
            {product.reviewCount !== undefined && product.reviewCount > 0 && (
              <span className="text-xs text-slate-500">
                ({product.reviewCount})
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-1 text-xl font-bold text-emerald-600">
          <span className="text-xl font-bold text-emerald-600">₱{price.toFixed(2)}</span>
        </div>

        {/* Shop Name */}
        {product.shopName && (
          <p className="mt-auto truncate text-xs text-slate-500">{product.shopName}</p>
        )}
      </div>
    </Link>
  );
}

