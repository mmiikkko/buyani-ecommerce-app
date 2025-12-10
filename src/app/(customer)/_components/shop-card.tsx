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
      prefetch={true}
      className="group flex h-full min-h-[360px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Shop Image */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        {shop.image ? (
          <Image
            src={shop.image}
            alt={shop.shop_name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-amber-50">
            <Store className="h-12 w-12 text-slate-400" />
          </div>
        )}
      </div>

      {/* Shop Info */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-emerald-600">
          {shop.shop_name}
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
          </div>
        )}

        {/* Product Count */}
        <p className="text-sm text-slate-600">
          {shop.products || 0} {shop.products === 1 ? "product" : "products"}
        </p>

        {/* Owner */}
        {shop.owner_name && (
          <p className="mt-auto truncate text-xs text-slate-500">
            by {shop.owner_name}
          </p>
        )}
      </div>
    </Link>
  );
}

