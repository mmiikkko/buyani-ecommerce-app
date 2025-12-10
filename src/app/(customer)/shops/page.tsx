"use client";

import { useEffect, useState } from "react";
import type { Shop } from "@/types/shops";
import { AnimatedSection } from "@/components/animated-section";
import { AnimatedShopCard } from "../_components/animated-shop-card";
import { Store, Sparkles, Heart, Award } from "lucide-react";

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
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-200/10 rounded-full blur-3xl"></div>
      </div>

      <AnimatedSection className="relative py-16 bg-gradient-to-b from-blue-50/50 via-white to-purple-50/30" direction="fade-up">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-4">
            <div className="relative">
              {/* Decorative icon badges */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                    All Shops
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  <span className="inline-flex items-center gap-2">
                    <Award className="w-7 h-7 text-amber-500 fill-amber-500" />
                    Browse all available shops
                  </span>
                </h2>
                <div className="flex items-center gap-3">
                  <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    <p className="text-base text-slate-700 font-medium">
                      Curated stalls from students and local makers with the best reviews.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-lg border border-blue-100">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-700 font-medium">Loading shops...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="inline-flex flex-col items-center gap-4 px-8 py-10 bg-white rounded-2xl shadow-lg border-2 border-red-200 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <Store className="w-8 h-8 text-red-500" />
                </div>
                <div className="space-y-2">
                  <p className="text-red-600 font-semibold text-lg">Could not load shops.</p>
                  <p className="text-slate-500 text-sm">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          ) : shops.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex flex-col items-center gap-4 px-8 py-10 bg-white rounded-2xl shadow-lg border-2 border-dashed border-slate-200 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                  <Store className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium">No shops available at the moment.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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

