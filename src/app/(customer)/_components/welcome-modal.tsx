"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Store,
  Heart,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Gift,
  Tag,
  Star,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { useRouter } from "next/navigation";

const WELCOME_STORAGE_KEY = "buyani-welcome-seen";
const PROMO_STORAGE_KEY = "buyani-promo-last-shown";

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 3;
  const { t } = useLanguage();

  useEffect(() => {
    // Only show to first-time visitors
    const hasWindow = typeof window !== "undefined";
    if (!hasWindow) return;

    const hasSeenWelcome = localStorage.getItem(WELCOME_STORAGE_KEY);
    if (hasSeenWelcome) return;

    // Small delay to ensure smooth page load
    const timer = setTimeout(() => setIsOpen(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(WELCOME_STORAGE_KEY, "true");
    }
    setIsOpen(false);
    setCurrentPage(0); // Reset to first page
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-emerald-600" />
            <DialogTitle className="text-2xl font-bold text-slate-900">
              {t("welcome-title")}
            </DialogTitle>
          </div>
          <DialogDescription className="text-base text-slate-600">
            {t("welcome-description")}
          </DialogDescription>
        </DialogHeader>

        {/* Page Content */}
        <div className="flex-1 overflow-hidden relative">
          <div 
            className="flex transition-transform duration-300 ease-in-out h-full"
            style={{ transform: `translateX(-${currentPage * 100}%)` }}
          >
            {/* Page 1: What is Buyani */}
            <div className="min-w-full px-1 py-4 flex flex-col justify-center">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900 text-center">
                  {t("what-is-buyani")}
                </h3>
                <p className="text-slate-600 leading-relaxed text-center px-4">
                  {t("what-is-buyani-desc")}
                </p>
                <div className="flex justify-center pt-4">
                  <Sparkles className="h-16 w-16 text-emerald-600 opacity-20" />
                </div>
              </div>
            </div>

            {/* Page 2: Features */}
            <div className="min-w-full px-1 py-4 flex flex-col justify-center">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900 text-center mb-4">
                  {t("what-you-can-do")}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex gap-3 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                    <ShoppingBag className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm mb-1">
                        {t("shop-products")}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {t("shop-products-desc")}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 rounded-lg bg-blue-50/50 border border-blue-100">
                    <Store className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm mb-1">
                        {t("explore-vendors")}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {t("explore-vendors-desc")}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 rounded-lg bg-rose-50/50 border border-rose-100">
                    <Heart className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm mb-1">
                        {t("easy-shopping")}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {t("easy-shopping-desc")}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 rounded-lg bg-amber-50/50 border border-amber-100">
                    <Sparkles className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm mb-1">
                        {t("campus-focused")}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {t("campus-focused-desc")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Page 3: Getting Started */}
            <div className="min-w-full px-1 py-4 flex flex-col justify-center">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900 text-center">
                  {t("getting-started")}
                </h3>
                <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200">
                  <ul className="space-y-3 text-slate-700 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{t("getting-started-1")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{t("getting-started-2")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{t("getting-started-3")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{t("getting-started-4")}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t">
          {/* Left Arrow */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            disabled={currentPage === 0}
            className="h-10 w-10 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Page Indicators */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  currentPage === index
                    ? "bg-emerald-600 w-8"
                    : "bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>

          {/* Right Arrow / Get Started Button */}
          {currentPage === totalPages - 1 ? (
            <Button
              onClick={handleClose}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
            >
              {t("get-started")}
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              className="h-10 w-10 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Promo / advertisement modal for returning visitors
export function PromoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    const hasWindow = typeof window !== "undefined";
    if (!hasWindow) return;

    const hasSeenWelcome = localStorage.getItem(WELCOME_STORAGE_KEY);
    if (!hasSeenWelcome) return; // only show to users who already saw onboarding

    const lastShown = localStorage.getItem(PROMO_STORAGE_KEY);
    const today = new Date().toDateString();
    if (lastShown === today) return; // show once per day max

    const timer = setTimeout(() => setIsOpen(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(PROMO_STORAGE_KEY, new Date().toDateString());
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl overflow-hidden border-0 bg-gradient-to-br from-emerald-50 via-white to-amber-50 shadow-[0_25px_90px_rgba(16,38,68,0.18)]">
        <DialogHeader className="space-y-2">
          <div className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Sparkles className="h-4 w-4" />
            {t("just-for-you")}
          </div>
          <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Gift className="h-6 w-6 text-amber-500" />
            {t("fresh-deals")}
          </DialogTitle>
          <DialogDescription className="text-base text-slate-600">
            {t("fresh-deals-desc")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 rounded-2xl border border-emerald-100 bg-white/80 p-4">
          <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-3">
            <Star className="h-5 w-5 text-emerald-600 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">{t("top-rated")}</p>
              <p className="text-sm text-slate-600">{t("top-rated-desc")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-3">
            <Tag className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">{t("limited-promos")}</p>
              <p className="text-sm text-slate-600">{t("limited-promos-desc")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-3">
            <ShoppingBag className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">{t("fast-pickup")}</p>
              <p className="text-sm text-slate-600">{t("fast-pickup-desc")}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5"
            onClick={() => {
              handleClose();
              // Redirect to products page filtered by best sellers (sorted by itemsSold)
              router.push("/products?sort=best-sellers");
            }}
          >
            {t("shop-best-sellers")}
          </Button>
          <Button 
            variant="outline" 
            className="border-slate-200 bg-white/90 text-slate-800 px-4" 
            onClick={() => {
              handleClose();
              // Redirect to products page with sort=new
              router.push("/products?sort=new");
            }}
          >
            {t("view-new-arrivals")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

