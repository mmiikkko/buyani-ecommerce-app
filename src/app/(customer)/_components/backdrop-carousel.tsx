"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

interface CarouselImage {
  id: string;
  imageDescription: string | null;
  imageURL: string;
  addedAt: string;
}

export function BackdropCarousel() {
  const [isMounted, setIsMounted] = useState(false);
  const [items, setItems] = useState<CarouselImage[]>([]);
  const plugin = useRef<ReturnType<typeof Autoplay> | null>(null);

  // Fetch images dynamically
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/carousel");
        const json = await res.json();
        setItems(json.data || []);
      } catch (error) {
        console.error("Failed to fetch carousel images:", error);
      }
    };

    fetchImages();
  }, []);

  // Initialize autoplay
  useEffect(() => {
    setIsMounted(true);
    plugin.current = Autoplay({ delay: 5000, stopOnInteraction: false });
  }, []);

  return (
    <section className="relative w-full bg-gradient-to-b from-emerald-50/70 via-white to-amber-50/40">
      <div className="pointer-events-none absolute inset-x-0 top-6 mx-auto h-40 w-[80%] rounded-full bg-emerald-200/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-[620px] max-w-[1400px] items-center px-4 pt-14 pb-14 sm:min-h-[660px] sm:px-6 lg:px-10 lg:pt-16">
        <div className="flex w-full flex-col gap-12 rounded-3xl border border-emerald-100/80 bg-white/85 p-6 shadow-[0_25px_80px_rgba(16,38,68,0.08)] backdrop-blur lg:p-10 md:flex-row md:items-center">

          {/* Hero copy */}
          <div className="relative z-10 max-w-3xl space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-3.5 py-1.5 text-[12px] font-semibold text-emerald-700 shadow-xs backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Quality snacks & essentials from CNSC students and local producers
            </span>

            <h1 className="text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[3.2rem]">
              Discover fresh picks from{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">
                campus sellers & local makers
              </span>
            </h1>

            <p className="max-w-3xl text-lg leading-relaxed text-slate-600 sm:text-[16px]">
              Explore curated goods crafted by CNSC students and trusted local producers.
              Simple, clean shopping designed for everyday cravings and useful essentials.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button className="h-10 rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
                Shop popular picks
              </Button>

              <Button
                variant="outline"
                className="h-10 rounded-full border-slate-200 bg-white/90 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Explore all categories
              </Button>

              <p className="w-full text-[12px] text-slate-500 sm:w-auto">
                Bringing campus and community together
              </p>
            </div>
          </div>

          {/* Dynamic carousel */}
          <div className="relative z-10 w-full max-w-3xl md:ml-auto">
            <div className="absolute -inset-8 rounded-[28px] bg-white/60 shadow-[0_28px_90px_rgba(15,23,42,0.14)] backdrop-blur-2xl" />

            {isMounted && items.length > 0 && (
              <Carousel
                opts={{ loop: true }}
                plugins={plugin.current ? [plugin.current] : []}
                className="relative rounded-2xl"
              >
                <CarouselContent>
                {items.map((item) => (
                <CarouselItem key={item.id} className="basis-full">
                  <div className="relative h-[26rem] sm:h-[28rem] overflow-hidden rounded-2xl border border-emerald-50">
                    {item.imageURL.startsWith("data:") ? (
                      <Image
                        src={item.imageURL}
                        alt={item.imageDescription || "Carousel Image"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        src={item.imageURL}
                        alt={item.imageDescription || "Carousel Image"}
                        fill
                        className="object-cover"
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-900/15 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 px-5 pb-5">
                      <span className="inline-flex w-fit items-center gap-1 rounded-full bg-slate-950/70 px-2 py-1 text-[10px] font-medium text-slate-50">
                        {item.imageDescription || "Featured Item"}
                      </span>
                    </div>
                  </div>
                </CarouselItem>
              ))}

                </CarouselContent>
              </Carousel>
            )}

            {/* If no images in DB */}
            {isMounted && items.length === 0 && (
              <div className="h-[20rem] rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500 text-sm">No carousel images found.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
