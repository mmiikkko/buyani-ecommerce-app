"use client";

import Image from "next/image";
import Backdrop from "@/assets/backdrop.png";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ShopByCategorySection } from "./_components/shop-by-category";
import { BestSellersSection } from "./_components/best-sellers";

export default function Home() {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  return (
    <main className="relative min-h-screen space-y-12">
      <section className="relative mt-8 h-[80vh] w-full overflow-hidden">
        <Image
          src={Backdrop}
          alt="Backdrop"
          fill
          priority
          className="object-cover brightness-75"
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <Carousel
            opts={{ loop: true }}
            plugins={[plugin.current]}
            className="w-[90%] max-w-5xl"
          >
            <CarouselContent>
              {[1, 2, 3, 4, 5].map((i) => (
                <CarouselItem key={i} className="basis-full p-4">
                  <div
                    className="bg-white bg-opacity-90 rounded-2xl h-125 shadow-1xl w-[90%] 
                    mx-auto flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105 "
                  >
                    <h3 className="text-lg font-semibold">Slide {i}</h3>
                    <p className="text-sm text-gray-600">HARDCODED :p</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="bg-gray-900/70 text-white hover:bg-gray-900 absolute left-2" />
            <CarouselNext className="bg-gray-900/70 text-white hover:bg-gray-900 absolute right-2" />
          </Carousel>
        </div>
      </section>

      <ShopByCategorySection />
      <BestSellersSection />
    </main>
  );
}
