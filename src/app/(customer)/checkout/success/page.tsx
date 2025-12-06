"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  const orderId = searchParams.get("order_id");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderId || !sessionId) {
        setStatus("error");
        setMessage("Missing order information");
        return;
      }

      try {
        // Verify payment and update status
        const response = await fetch(`/api/payments/verify?session_id=${sessionId}&order_id=${orderId}`);
        
        if (!response.ok) {
          throw new Error("Failed to verify payment");
        }

        const result = await response.json();
        
        if (result.success) {
          setStatus("success");
          setMessage("Your payment has been confirmed!");
        } else {
          setStatus("error");
          setMessage(result.message || "Payment verification failed");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        // Even if verification fails, the payment might still be successful
        // The webhook or manual check will update it later
        setStatus("success");
        setMessage("Your order has been placed! Payment confirmation is being processed.");
      }
    };

    verifyPayment();
  }, [orderId, sessionId]);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mb-4" />
            <p className="text-lg text-slate-600">Verifying your payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl">
            {status === "success" ? "Payment Successful!" : "Order Placed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-slate-600">{message}</p>
          
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
              onClick={() => router.push("/settings/orders")}
              className="flex items-center gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              View My Orders
            </Button>
            <Button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
