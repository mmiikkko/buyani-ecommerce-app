"use client";

import { useEffect, useState } from "react";
import { ShopCard } from "../_components/shop-card";
import type { Shop } from "@/types/shops";
import { AnimatedSection } from "@/components/animated-section";
import { AnimatedShopCard } from "../_components/animated-shop-card";

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadShops = async () => {
      try {
        const res = await fetch("/api/shops", { cache: "no-store" });
        if (!res.ok) {
          // Try to read error details from the response
          let message = `Failed to load shops (status ${res.status})`;
          try {
            const data = await res.json();
            if (data?.error) {
              message = data.error;
            }
          } catch {
            // ignore parse errors, keep default message
          }
          throw new Error(message);
        }

        const data = await res.json();
        if (!Array.isArray(data)) {
          setError("Unexpected response from server.");
          setShops([]);
          return;
        }
        setShops(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching shops:", err);
        setError(err instanceof Error ? err.message : "Failed to load shops.");
        setShops([]);
      } finally {
        setLoading(false);
      }
    };

    loadShops();
  }, []);

  return (
    <main className="relative min-h-screen">
      <AnimatedSection className="py-12 bg-slate-50" direction="fade-up">
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
          ) : error ? (
            <div className="text-center py-12 space-y-2">
              <p className="text-red-600 font-semibold">Could not load shops.</p>
              <p className="text-slate-500 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-emerald-600 hover:underline"
              >
                Retry
              </button>
            </div>
          ) : shops.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">No shops available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {shops.map((shop, index) => (
                <AnimatedShopCard key={shop.id} shop={shop} delay={index * 100} />
              ))}
            </div>
          )}
        </div>
      </AnimatedSection>
    </main>
  );
}

