"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function CheckoutCancelPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id");

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-slate-600">
            Your payment was cancelled. Your order has been saved and you can try again.
          </p>

          {orderId && (
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-500">Order ID</p>
              <p className="font-mono text-sm font-semibold text-slate-900 break-all">
                {orderId}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => router.push("/cart")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Cart
            </Button>
            <Button
              onClick={() => router.push("/checkout")}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
