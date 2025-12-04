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
  const rating = product.rating ? parseFloat(product.rating) : 0;
  const price = product.price ?? 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.productName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
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
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-slate-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {product.productName}
        </h3>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-slate-700">{rating.toFixed(1)}</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-emerald-600">₱{price.toFixed(2)}</span>
        </div>

        {/* Shop Name */}
        {product.shopName && (
          <p className="text-xs text-slate-500 truncate">
            {product.shopName}
          </p>
        )}
      </div>
    </Link>
  );
}

