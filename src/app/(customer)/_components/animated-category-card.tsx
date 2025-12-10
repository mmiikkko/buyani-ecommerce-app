"use client";

import { ReactNode, useRef } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import clsx from "clsx";

interface AnimatedCategoryCardProps {
  children: ReactNode;
  delay?: number;
}

export function AnimatedCategoryCard({ children, delay = 0 }: AnimatedCategoryCardProps) {
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
      {children}
    </div>
  );
}

