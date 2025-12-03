"use client";

import Backdrop from "@/assets/customer/backdrop.png";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { SingleBanner } from "./single-banner";

export function BackdropCarousel() {
  const [isMounted, setIsMounted] = useState(false);
  const plugin = useRef<ReturnType<typeof Autoplay> | null>(null);

  useEffect(() => {
    setIsMounted(true);
    plugin.current = Autoplay({ delay: 5000, stopOnInteraction: false });
  }, []);

  return (
    <section className="relative w-full bg-emerald-50/40">

      {/* ✅ ADDED BANNER */}
      <div className="w-full bg-emerald-600 text-white text-center py-3 shadow-md shadow-emerald-900/10">
        ✨🌿 Shop campus favorites and locally crafted products — all in one place! 🌿✨
      </div>
      {/* END BANNER */}

      {/* Single Banner Image */}
      <SingleBanner />


      <div className="relative mx-auto flex min-h-[420px] max-w-7xl items-center px-4 pt-2 pb-6 sm:min-h-[460px] sm:px-6 lg:px-8 lg:pt-3">
        <div className="flex w-full flex-col gap-10 md:flex-row md:items-center">

          {/* Hero copy */}
<div className="relative z-10 max-w-xl space-y-5">
  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-3 py-1 text-[11px] font-medium text-emerald-700 shadow-xs backdrop-blur">
    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
    Quality snacks & essentials from CNSC students and local producers
  </span>

  <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.6rem]">
    Discover fresh picks from{" "}
    <span className="bg-gradient-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">
      campus sellers & local makers
    </span>
    
  </h1>

  <p className="max-w-lg text-sm leading-relaxed text-slate-600 sm:text-[15px]">
    Explore curated goods crafted by CNSC students and trusted local producers.
    Simple, clean shopping designed for everyday cravings and useful essentials.
  </p>

  <div className="flex flex-wrap items-center gap-3 pt-1">
    <Button className="h-9 rounded-full bg-emerald-600 px-4 text-xs font-medium text-white shadow-sm hover:bg-emerald-700">
      Shop popular picks
    </Button>

    <Button
      variant="outline"
      className="h-9 rounded-full border-slate-200 bg-white/90 px-4 text-xs font-medium text-slate-700 hover:bg-slate-50"
    >
      Explore all categories
    </Button>

    <p className="w-full text-[11px] text-slate-500 sm:w-auto">
      Bringing campus and community together
    </p>
  </div>
</div>


          {/* Soft carousel preview */}
          <div className="relative z-10 w-full max-w-2xl md:ml-auto">
            <div className="absolute -inset-6 rounded-xl bg-white/40 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl" />

            {isMounted && (
              <Carousel
                opts={{ loop: true }}
                plugins={plugin.current ? [plugin.current] : []}
                className="relative rounded-xl"
              >
              <CarouselContent>
                {[1, 2, 3].map((i) => (
                  <CarouselItem key={i} className="basis-full">
                    <div className="relative h-80 overflow-hidden rounded-xl border border-emerald-50">
                      <Image
                        src={Backdrop}
                        alt={`Campus goods ${i}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/5 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 px-4 pb-4">
                        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-slate-950/70 px-2 py-1 text-[10px] font-medium text-slate-50">
                          Campus best-seller
                        </span>
                        <p className="text-sm font-medium text-slate-50">
                          Late-night cravings, locally made.
                        </p>
                        <p className="text-[11px] text-slate-200/85">
                          Pre-order now and pick up between classes.
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
