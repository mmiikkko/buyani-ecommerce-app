"use client";

import { Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

interface CheckoutProgressProps {
  currentStep: 1 | 2 | 3;
}

export function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  const { t } = useLanguage();
  const steps = [
    { number: 1, label: t("delivery") },
    { number: 2, label: t("payment") },
    { number: 3, label: t("review") },
  ];

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                  currentStep > step.number
                    ? "border-emerald-500 bg-emerald-500"
                    : currentStep === step.number
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-slate-300 bg-white"
                }`}
              >
                {currentStep > step.number ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  <span
                    className={`text-sm font-semibold ${
                      currentStep >= step.number ? "text-white" : "text-slate-400"
                    }`}
                  >
                    {step.number}
                  </span>
                )}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  currentStep >= step.number ? "text-emerald-600" : "text-slate-500"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-4 h-0.5 w-16 ${
                  currentStep > step.number ? "bg-emerald-500" : "bg-slate-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

