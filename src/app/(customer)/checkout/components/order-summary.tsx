"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  productName: string | null;
  price: number | null;
  image: string | null;
};

interface OrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
}

export function OrderSummary({
  cartItems,
  subtotal,
  shippingFee,
  total,
}: OrderSummaryProps) {
  const freeShippingThreshold = 500;
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})</span>
            <span className="font-semibold">₱{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Shipping Fee</span>
            <span className="font-semibold">₱{shippingFee.toFixed(2)}</span>
          </div>
        </div>

        {shippingFee > 0 && amountNeeded > 0 && (
          <Alert className="bg-blue-50 border-blue-200 text-blue-800">
            <p className="text-sm">
              Add ₱{amountNeeded.toFixed(2)} more for free shipping!
            </p>
          </Alert>
        )}

        <div className="border-t pt-4">
          <div className="flex justify-between text-lg font-bold text-slate-900">
            <span>Total</span>
            <span className="text-emerald-600">₱{total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

