"use client";

import Image from "next/image";
import { Star, PenLine, Trash2 } from "lucide-react";
import type { Product } from "@/types/products";

export function ProductCard({
  product,
  onDelete,
  onEdit
}: {
  product: Product;
  onDelete?: (productId: string) => void;
  onEdit?: (product: Product) => void;
}) {
  // Handle both string and array image_url formats
  const getImageUrl = (): string => {
    if (!product.images || product.images.length === 0) {
      return "";
    }
    
    const firstImage = product.images[0];
    if (!firstImage || !firstImage.image_url) {
      return "";
    }
    
    // Handle array format (customer API)
    if (Array.isArray(firstImage.image_url)) {
      const url = firstImage.image_url[0];
      return url && typeof url === "string" ? url : "";
    }
    
    // Handle string format (seller API) - this is the main format for seller products
    if (typeof firstImage.image_url === "string") {
      const url = firstImage.image_url.trim();
      // Validate the URL is not empty or invalid
      if (url && url !== "null" && url !== "undefined" && url.length > 0) {
        return url;
      }
    }
    
    return "";
  };

  const firstImageUrl = getImageUrl();

  // Use only valid absolute URLs or public relative paths; otherwise use placeholder
  const safeSrc =
  firstImageUrl &&
  (
    firstImageUrl.startsWith("http") ||
    firstImageUrl.startsWith("/") ||
    firstImageUrl.startsWith("data:image/")
  )
    ? firstImageUrl
    : "/placeholder.png";


  return (
    <div className="w-full max-w-sm shadow-md rounded-lg space-y-4 overflow-hidden bg-white">

      {/* IMAGE */}
      <div className="w-full h-40 bg-gray-200 overflow-hidden relative">
        {safeSrc && safeSrc !== "/placeholder.png" ? (
          safeSrc.startsWith("data:image/") ? (
            // Use regular img tag for data URLs to avoid Next.js Image issues
            <img
              src={safeSrc}
              alt={product.productName}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<span class="text-gray-400 text-sm flex items-center justify-center h-full">No Image</span>';
                }
              }}
            />
          ) : (
            <Image
              src={safeSrc}
              alt={product.productName}
              width={400}
              height={160}
              className="w-full h-full object-cover"
              unoptimized={true}
              onError={(e) => {
                // Fallback if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<span class="text-gray-400 text-sm flex items-center justify-center h-full">No Image</span>';
                }
              }}
            />
          )
        ) : (
          <span className="text-gray-400 text-sm flex items-center justify-center h-full">
            No Image
          </span>
        )}
      </div>

      {/* PRODUCT INFO */}
      <div className="px-5 space-y-1">
        <h1 className="font-semibold text-lg">{product.productName}</h1>
        <p className="text-green-700 font-bold">₱{product.price}</p>
        <p className="text-gray-600 text-sm">Stock: {product.stock}</p>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center justify-between px-5 pb-4 pt-3 border-t">
        <button 
          onClick={() => onEdit?.(product)}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium border rounded-md px-3 py-2 cursor-pointer"
        >
          <PenLine size={18} />
          Edit
        </button>

        <button
          onClick={() => onDelete?.(product.id)}
          className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium border rounded-md px-3 py-2 cursor-pointer"
        >
          <Trash2 size={18} />
          Remove
        </button>
      </div>
    </div>
  );
}
