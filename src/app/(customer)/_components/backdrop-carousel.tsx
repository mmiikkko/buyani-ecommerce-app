"use client";

import Image from "next/image";
import Backdrop from "@/assets/customer/backdrop.png";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function BackdropCarousel() {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  return (
    <main className="relative ">
      <section className="relative h-screen w-full overflow-hidden ">
        <Image
          src={Backdrop}
          alt="Backdrop"
          fill
          priority
          className="object-cover object-center brightness-75 pointer-events-none select-none w-full "
        />

        <div className="absolute inset-0 flex items-center justify-center ">
          <Carousel
            opts={{ loop: true }}
            plugins={[plugin.current]}
            className="relative w-[90%] max-w-6xl mx-auto mt-30 overflow-hidden rounded-2xl"
          >
            <CarouselContent>
              {[1, 2, 3, 4, 5].map((i) => (
                <CarouselItem key={i} className="basis-full">
                  <div className="relative h-[65vh] flex items-center justify-center rounded-2xl overflow-hidden">
                    <Image
                      src={Backdrop}
                      alt={`Slide ${i}`}
                      fill
                      className="object-cover brightness-75"
                    />
                    <div className="absolute inset-0 flex flex-col justify-center items-start p-16 text-white bg-gradient-to-r from-black/60 via-black/30 to-transparent">
                      <span className="px-3 py-1 text-xs font-medium bg-green-600/80 rounded-full mb-3">
                        ⚡ Locally Crafted
                      </span>
                      <h1 className="text-4xl font-bold leading-tight">
                        CRAVINGS, LOCALLY CRAFTED
                      </h1>
                      <p className="text-lg mb-4">From Our Kitchens to You</p>
                      <p className="max-w-lg text-sm opacity-90 mb-6">
                        Discover a curated selection of unique, handcrafted
                        snacks from the best local makers. From savory crisps to
                        sweet delicacies, find your next favorite treat and
                        support small businesses.
                      </p>
                      <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold shadow-md transition">
                        Shop Now
                      </button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Controller buttons (INSIDE & centered vertically) */}
            <CarouselPrevious
              className="
                absolute left-4 top-1/2 -translate-y-1/2 z-20 
                flex h-10 w-10 items-center justify-center
                rounded-full bg-white/70 hover:bg-white/90 text-gray-900 shadow-lg
                transition duration-200 backdrop-blur-sm cursor-pointer
              "
            />
            <CarouselNext
              className="
                absolute right-4 top-1/2 -translate-y-1/2 z-20 
                flex h-10 w-10 items-center justify-center
                rounded-full bg-white/70 hover:bg-white/90 text-gray-900 shadow-lg
                transition duration-200 backdrop-blur-sm cursor-pointer
              "
            />
          </Carousel>
        </div>
      </section>
    </main>
  );
}
