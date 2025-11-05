"use client";

import { ShopByCategorySection } from "@/components/home/shop-by-category"
import { BackdropCarousel } from "@/components/home/backdrop-carousel";

export default function Home() {

  return (
    <main className="relative min-h-screen space-y-12">
      <BackdropCarousel/>
      <ShopByCategorySection />
    </main>
  )
}
