"use client";

import { AnimatedSection } from "@/components/animated-section";
import { Sparkles, ShoppingBag, Shield, Package } from "lucide-react";

const steps = [
  {
    title: "Browse & discover",
    description: "Find popular picks, categories, and trusted shops.",
    icon: Sparkles,
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    title: "Add to cart",
    description: "Choose your favorites and set quantity in a few taps.",
    icon: ShoppingBag,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    title: "Pick up or get delivered",
    description: "Pre-order and grab between classes or have it delivered.",
    icon: Package,
    gradient: "from-amber-500 to-amber-600",
  },
];

export function HowItWorksSection() {
  return (
    <AnimatedSection className="relative py-16 bg-transparent" direction="fade-up" delay={80}>
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 shadow-lg shadow-blue-500/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
              How it works
            </p>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Shop in three easy steps
          </h2>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            A simple flow from browsing to pickup—perfect for busy students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <AnimatedSection key={step.title} direction="fade-up" delay={idx * 100}>
                <div className="h-full rounded-2xl border-2 border-white/50 bg-white/90 p-6 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300 hover:-translate-y-1">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} text-white shadow-lg mb-4`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}

