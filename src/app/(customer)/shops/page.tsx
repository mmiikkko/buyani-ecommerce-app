"use client";

import { useEffect, useState } from "react";
import { ShopCard } from "../_components/shop-card";
import type { Shop } from "@/types/shops";

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/shops")
      .then((res) => res.json())
      .then((data) => {
        setShops(data);
      })
      .catch((err) => {
        console.error("Error fetching shops:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="relative min-h-screen">
      <section className="py-12 bg-slate-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-2">
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-500">
                All Shops
              </p>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                Browse all available shops
              </h2>
              <p className="text-sm text-slate-600">
                Curated stalls from students and local makers with the best
                reviews.
              </p>
            </div>
          </header>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-500">Loading shops...</p>
            </div>
          ) : shops.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">No shops available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {shops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

