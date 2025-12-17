"use client";

import { useState } from "react";
import clsx from "clsx";
import { ShopCard } from "./shop-card";
import type { Shop } from "@/types/shops";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Spinner } from "@/components/ui/spinner";

interface AnimatedShopCardProps {
  shop: Shop;
  delay?: number;
}

export function AnimatedShopCard({ shop, delay = 0 }: AnimatedShopCardProps) {
  const { ref, isVisible } = useScrollAnimation({
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
    triggerOnce: false,
  });

  const [loading, setLoading] = useState(false);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={clsx(
        "relative transition-all duration-500 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        loading && "pointer-events-none"
      )}
      style={{
        transitionDelay: isVisible ? `${delay}ms` : "0ms",
      }}
      onClick={() => {
        // Small delay avoids flicker on fast navigation
        setTimeout(() => setLoading(true), 100);
      }}
    >
      {/* Card content */}
      <div className={clsx(loading && "opacity-40 transition-opacity")}>
        <ShopCard shop={shop} />
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-sm">
          <Spinner className="size-5" />
        </div>
      )}
    </div>
  );
}
