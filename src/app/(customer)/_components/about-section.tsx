"use client";

import { AnimatedSection } from "@/components/animated-section";
import { Sparkles, ShoppingBag, Users, Heart, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: ShoppingBag,
    title: "Local Products",
    description: "Discover unique items from campus sellers and local makers",
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: Users,
    title: "Student Community",
    description: "Support your fellow students and campus entrepreneurs",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Heart,
    title: "Trusted Sellers",
    description: "Shop from verified vendors with great reviews",
    color: "from-rose-500 to-rose-600",
    bgColor: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description: "Every product is carefully curated for quality",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    description: "Quick pickup options between classes",
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    icon: Sparkles,
    title: "Campus Focused",
    description: "Products tailored for the campus community",
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
];

export function AboutSection() {
  return (
    <AnimatedSection className="relative py-20 bg-transparent" direction="fade-up">
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 shadow-lg shadow-emerald-500/30">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 bg-emerald-100 px-4 py-2 rounded-full">
              About BuyAni
            </p>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-emerald-800 to-blue-800 bg-clip-text text-transparent">
            Your Campus Marketplace
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"></div>
            <p className="text-lg text-slate-700 font-medium max-w-2xl">
              Connecting students with local vendors, student entrepreneurs, and makers. 
              Discover unique products, support your peers, and shop from trusted sellers all in one place.
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"></div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <AnimatedSection
                key={feature.title}
                direction="fade-up"
                delay={index * 100}
                className="group"
              >
                <div className="relative h-full rounded-2xl border-2 border-white/50 bg-gradient-to-br from-white to-white/80 p-6 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300 hover:-translate-y-1">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg mb-4`}>
                    <Icon className={`w-6 h-6 text-white`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}

