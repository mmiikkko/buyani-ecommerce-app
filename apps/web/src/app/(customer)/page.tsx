"use client";

import { ShopByCategorySection } from "./_components/shop-by-category";
import { BackdropCarousel } from "./_components/backdrop-carousel";
import { BestSellersSection } from "./_components/best-sellers";
import { FeaturedVendorsSection } from "./_components/featured-vendors";

export default function Home() {
  return (
    <main className="relative min-h-screen space-y-12">
      <BackdropCarousel />
      <BestSellersSection />
      <ShopByCategorySection />
      <FeaturedVendorsSection />
    </main>
  );
}
