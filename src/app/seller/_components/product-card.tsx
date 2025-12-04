"use client";

import Image from "next/image";
import { Star, PenLine, Trash2 } from "lucide-react";
import type { Product } from "@/types/products";

export function ProductCard({
  product,
  onDelete
}: {
  product: Product;
  onDelete?: (productId: string) => void;
}) {
  const firstImage = product.images?.[0]?.image_url ?? "";

  // Use only valid absolute URLs or public relative paths; otherwise use placeholder
  const safeSrc =
  firstImage &&
  (
    firstImage.startsWith("http") ||
    firstImage.startsWith("/") ||
    firstImage.startsWith("data:image/")
  )
    ? firstImage
    : "/placeholder.png";


  return (
    <div className="w-full max-w-sm shadow-md rounded-lg space-y-4 overflow-hidden bg-white">

      {/* IMAGE */}
      <div className="w-full h-40 bg-gray-200 overflow-hidden">
        {product.images?.length ? (
          <Image
            src={safeSrc}
            alt={product.productName}
            width={400}
            height={160}
            className="w-full h-full object-cover"
          />
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
        <button className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700 text-sm font-medium border rounded-md px-3 py-2 cursor-pointer">
          <Star size={18} />
          Feature
        </button>

        <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium border rounded-md px-3 py-2 cursor-pointer">
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
