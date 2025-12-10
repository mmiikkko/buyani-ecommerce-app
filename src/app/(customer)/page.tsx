"use client";

import { ShopByCategorySection } from "./_components/shop-by-category";
import { BackdropCarousel } from "./_components/backdrop-carousel";
import { BestSellersSection } from "./_components/best-sellers";
import { FeaturedVendorsSection } from "./_components/featured-vendors";
import { WelcomeModal, PromoModal } from "./_components/welcome-modal";
import { AboutSection } from "./_components/about-section";
import { StatsSection } from "./_components/stats-section";
import { QuickActionsSection } from "./_components/quick-actions-section";
import { HowItWorksSection } from "./_components/how-it-works-section";
import { PromoBanner } from "./_components/promo-banner";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-emerald-50">
      <WelcomeModal />
      <PromoModal />
      <PromoBanner />
      <BackdropCarousel />
      <AboutSection /> {/* Your Campus Marketplace */}
      <HowItWorksSection />
      <QuickActionsSection />
      <BestSellersSection />
      <ShopByCategorySection />
      <FeaturedVendorsSection /> {/* Shops */}
      <StatsSection /> {/* 4 boxes: Products, Shops, Customers, Rating */}
    </main>
  );
}
