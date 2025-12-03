"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Store } from "lucide-react";
import type { Shop } from "@/types/shops";

interface ShopCardProps {
  shop: Shop;
}

export function ShopCard({ shop }: ShopCardProps) {
  const rating = shop.shop_rating ? parseFloat(shop.shop_rating) : 0;

  return (
    <Link
      href={`/shops/${shop.id}`}
      className="group block rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Shop Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        {shop.image ? (
          <Image
            src={shop.image}
            alt={shop.shop_name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-amber-50">
            <Store className="h-12 w-12 text-slate-400" />
          </div>
        )}
      </div>

      {/* Shop Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors">
          {shop.shop_name}
        </h3>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-slate-700">{rating.toFixed(1)}</span>
          </div>
        )}

        {/* Product Count */}
        <p className="text-sm text-slate-600">
          {shop.products || 0} {shop.products === 1 ? "product" : "products"}
        </p>

        {/* Owner */}
        {shop.owner_name && (
          <p className="text-xs text-slate-500 truncate">
            by {shop.owner_name}
          </p>
        )}
      </div>
    </Link>
  );
}

