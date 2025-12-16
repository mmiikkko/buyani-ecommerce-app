"use client";

import { ReactNode, useState } from "react";
import clsx from "clsx";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Spinner } from "@/components/ui/spinner";

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
      onClick={() => setTimeout(() => setLoading(true), 100)}
    >
      {/* Children content */}
      <div className={clsx(loading && "opacity-40 transition-opacity")}>
        {children}
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
