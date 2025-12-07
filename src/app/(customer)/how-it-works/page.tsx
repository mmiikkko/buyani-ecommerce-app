"use client";

import { Search, ShoppingCart, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authClient } from "@/server/auth-client";
import { USER_ROLES } from "@/server/schema/auth-schema";

const steps = [
  {
    icon: Search,
    title: "Browse & Search",
    description: "Explore our wide selection of products from local sellers. Use the search bar to find specific items or browse through categories and shops.",
    iconBg: "bg-emerald-100 border-emerald-200",
    iconColor: "text-emerald-600",
  },
  {
    icon: ShoppingCart,
    title: "Add to Cart",
    description: "Found something you like? Click on any product to view details, then add it to your cart. You can add multiple items and adjust quantities.",
    iconBg: "bg-amber-100 border-amber-200",
    iconColor: "text-amber-600",
  },
  {
    icon: CheckCircle,
    title: "Checkout & Order",
    description: "Review your cart, enter your delivery information, and complete your purchase securely. Track your order status in your account.",
    iconBg: "bg-emerald-100 border-emerald-200",
    iconColor: "text-emerald-600",
  },
];

export default function HowItWorksPage() {
  const session = authClient.useSession();
  const user = session.data?.user;
  const isSeller = user?.role?.includes(USER_ROLES.SELLER) ?? false;

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-emerald-50 via-slate-50 to-amber-50">
      <section className="py-12 pb-20 min-h-screen">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-2 text-center">
            <div className="space-y-2">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-500">
                Getting Started
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                How it works
              </h1>
              <p className="text-base text-slate-600 max-w-2xl mx-auto">
                Simple steps to start shopping on Buyani. Discover products, add to cart, and checkout securely.
              </p>
            </div>
          </header>

          <div className="grid gap-6 md:gap-8 lg:grid-cols-3 mt-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;
              
              return (
                <div key={index} className="relative">
                  <div className="relative h-full rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                    <div className="flex flex-col items-start gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${step.iconBg}`}>
                        <Icon className={`h-6 w-6 ${step.iconColor}`} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-400">Step {index + 1}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {step.title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {!isLast && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 z-10 -translate-y-1/2">
                      <ArrowRight className="h-6 w-6 text-slate-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-4 mt-8 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-600 text-center">
              Ready to start shopping?
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/products">Browse Products</Link>
              </Button>
              {!isSeller && (
                <Button asChild variant="outline">
                  <Link href="/become-seller">Become a Seller</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

