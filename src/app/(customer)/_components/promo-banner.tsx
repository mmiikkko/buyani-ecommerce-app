"use client";

import Image from "next/image";
import Backdrop from "@/assets/customer/backdrop.png";

interface PromoImage {
  id: string;
  src: string;
  alt: string;
  bgColor: string;
  bgColorLight: string;
}

const PROMO_IMAGES: PromoImage[] = [
  {
    id: "1",
    src: "/api/placeholder/800/300",
    alt: "Promotional banner 1",
    bgColor: "bg-yellow-400",
    bgColorLight: "bg-yellow-300",
  },
  {
    id: "2",
    src: "/api/placeholder/800/300",
    alt: "Promotional banner 2",
    bgColor: "bg-emerald-400",
    bgColorLight: "bg-emerald-300",
  },
  {
    id: "3",
    src: "/api/placeholder/800/300",
    alt: "Promotional banner 3",
    bgColor: "bg-amber-400",
    bgColorLight: "bg-amber-300",
  },
];

// SVG pattern for decorative overlay
const PatternOverlay = () => (
  <svg
    className="absolute inset-0 h-full w-full opacity-5"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        id="dots"
        x="0"
        y="0"
        width="40"
        height="40"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="20" cy="20" r="2" fill="currentColor" />
      </pattern>
      <pattern
        id="lines"
        x="0"
        y="0"
        width="60"
        height="60"
        patternUnits="userSpaceOnUse"
      >
        <line
          x1="0"
          y1="30"
          x2="60"
          y2="30"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.3"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dots)" />
    <rect width="100%" height="100%" fill="url(#lines)" />
  </svg>
);

export function PromoBanner() {
  return (
    <div className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-5 pb-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PROMO_IMAGES.map((image, index) => (
            <div
              key={image.id}
              className={`group relative overflow-hidden rounded-xl ${image.bgColor} shadow-md transition-all duration-300 hover:shadow-lg`}
            >
              {/* Pattern overlay */}
              <PatternOverlay />
              
              {/* Subtle repeating pattern with illustrations */}
              <div 
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 2px,
                    rgba(0,0,0,0.1) 2px,
                    rgba(0,0,0,0.1) 4px
                  ),
                  repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 2px,
                    rgba(0,0,0,0.1) 2px,
                    rgba(0,0,0,0.1) 4px
                  )`,
                }}
              />

              {/* Image container */}
              <div className="relative aspect-[16/6] overflow-hidden">
                <Image
                  src={Backdrop}
                  alt={image.alt}
                  fill
                  className="object-cover mix-blend-multiply opacity-70"
                  priority={index === 0}
                />
                
                {/* Subtle overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

