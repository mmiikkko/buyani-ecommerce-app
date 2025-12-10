"use client";

import { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import clsx from "clsx";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "fade-up" | "fade-in" | "fade-left" | "fade-right";
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = "fade-up",
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation({
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
    triggerOnce: false,
  });

  const directionClasses = {
    "fade-up": "translate-y-8",
    "fade-in": "",
    "fade-left": "-translate-x-8",
    "fade-right": "translate-x-8",
  };

  return (
    <section
      ref={ref}
      className={clsx(
        "transition-all duration-700 ease-out",
        isVisible
          ? "opacity-100 translate-y-0 translate-x-0"
          : `opacity-0 ${directionClasses[direction]}`,
        className
      )}
      style={{
        transitionDelay: isVisible ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </section>
  );
}

