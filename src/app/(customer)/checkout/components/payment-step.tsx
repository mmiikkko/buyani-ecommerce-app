"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";

interface PaymentStepProps {
  selectedMethod: "gcash" | "paymaya" | "cod" | null;
  onSelect: (method: "gcash" | "paymaya" | "cod") => void;
  onBack: () => void;
}

export function PaymentStep({ selectedMethod, onSelect, onBack }: PaymentStepProps) {
  const paymentMethods = [
    {
      id: "gcash" as const,
      name: "GCash",
      description: "Pay securely with GCash e-wallet",
      icon: "💙",
      recommended: true,
    },
    {
      id: "paymaya" as const,
      name: "PayMaya",
      description: "Pay using your PayMaya account",
      icon: "💚",
      recommended: false,
    },
    {
      id: "cod" as const,
      name: "Cash on Delivery",
      description: "Pay with cash when you receive your order",
      icon: "💵",
      recommended: false,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-emerald-600" />
          <CardTitle>Payment Method</CardTitle>
        </div>
        <p className="text-sm text-slate-600 mt-1">
          Choose how you want to pay
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedMethod === method.id
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-2xl ${
                      method.id === "gcash"
                        ? "bg-blue-100"
                        : method.id === "paymaya"
                        ? "bg-green-100"
                        : "bg-orange-100"
                    }`}
                  >
                    {method.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{method.name}</h3>
                      {method.recommended && (
                        <Badge variant="secondary" className="text-xs">
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{method.description}</p>
                  </div>
                </div>
                <div
                  className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === method.id
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-slate-300"
                  }`}
                >
                  {selectedMethod === method.id && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (selectedMethod) {
                onSelect(selectedMethod);
              }
            }}
            disabled={!selectedMethod}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            Continue to Review
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

