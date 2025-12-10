"use client";

import { ReactNode, useRef, useEffect, useState } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import clsx from "clsx";
import { ProductCard } from "./product-card";
import type { Product } from "@/types/products";

interface AnimatedProductCardProps {
  product: Product;
  delay?: number;
}

export function AnimatedProductCard({ product, delay = 0 }: AnimatedProductCardProps) {
  const { ref, isVisible } = useScrollAnimation({
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
    triggerOnce: false,
  });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={clsx(
        "transition-all duration-500 ease-out",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6"
      )}
      style={{
        transitionDelay: isVisible ? `${delay}ms` : "0ms",
      }}
    >
      <ProductCard product={product} />
    </div>
  );
}

