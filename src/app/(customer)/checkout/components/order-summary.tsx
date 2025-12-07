"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  total: number;
}

export function OrderSummary({
  cartItems,
  subtotal,
  total,
}: OrderSummaryProps) {
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
        </div>

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

