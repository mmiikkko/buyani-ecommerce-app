"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Product } from "@/types/products";
import { useLanguage } from "@/lib/i18n/context";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useLanguage();
  // Safely extract image URL with multiple fallbacks
  // Optimized for performance with prefetching
  const getPrimaryImage = (): string | null => {
    try {
      const images = product.images;
      if (!images || images.length === 0) return null;

      const firstImage = images[0];
      if (!firstImage || !firstImage.image_url) return null;

      // Handle both string and array formats (some APIs return array, others return string)
      let url: string | null = null;
      if (Array.isArray(firstImage.image_url)) {
        url = firstImage.image_url[0];
      } else if (typeof firstImage.image_url === "string") {
        url = firstImage.image_url;
      }

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
  const isOutOfStock = !product.isAvailable || (product.stock ?? 0) <= 0;

  return (
    <Link
      href={`/products/${product.id}`}
      prefetch={true}
      className="group flex h-full min-h-[400px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100 flex-shrink-0">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.productName}
            fill
            className={`object-cover group-hover:scale-105 transition-transform duration-200 ${isOutOfStock ? "grayscale opacity-60" : ""
              }`}
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

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <Badge
              variant="destructive"
              className="px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-lg animate-in fade-in zoom-in duration-300"
            >
              {t("out-of-stock")}
            </Badge>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col gap-2 p-4 min-h-[140px]">
        <h3 className="text-base font-semibold text-slate-900 line-clamp-2 min-h-[3rem] transition-colors group-hover:text-emerald-600">
          {product.productName}
        </h3>

        {/* Rating - Always show */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${rating > 0 && i < Math.round(rating)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-slate-200 text-slate-200"
                  }`}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-slate-700">
            {rating > 0 ? rating.toFixed(1) : "0.0"}
          </span>
          {product.reviewCount !== undefined && product.reviewCount > 0 && (
            <span className="text-xs text-slate-500">
              ({product.reviewCount})
            </span>
          )}
          {(!product.reviewCount || product.reviewCount === 0) && (
            <span className="text-xs text-slate-500">
              (0)
            </span>
          )}
        </div>

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

