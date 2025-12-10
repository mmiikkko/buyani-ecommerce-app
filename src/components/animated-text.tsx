"use client";

import { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import clsx from "clsx";

interface AnimatedTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "fade-up" | "fade-in";
}

export function AnimatedText({
  children,
  className,
  delay = 0,
  direction = "fade-up",
}: AnimatedTextProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
    triggerOnce: true,
  });

  const directionClasses = {
    "fade-up": "translate-y-4",
    "fade-in": "",
  };

  return (
    <div
      ref={ref}
      className={clsx(
        "transition-all duration-600 ease-out",
        isVisible
          ? "opacity-100 translate-y-0"
          : `opacity-0 ${directionClasses[direction]}`,
        className
      )}
      style={{
        transitionDelay: isVisible ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}


