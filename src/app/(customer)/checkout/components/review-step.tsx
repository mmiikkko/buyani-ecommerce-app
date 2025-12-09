"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Wallet, ShoppingBag, ArrowLeft, Edit } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  productName: string | null;
  price: number | null;
  image: string | null;
};

type AddressData = {
  fullName: string;
  street: string;
  apartment: string;
  city: string;
  province: string;
  zipcode: string;
  country: string;
  contactNumber: string;
  deliveryNotes: string;
};

interface ReviewStepProps {
  address: AddressData | null;
  paymentMethod: "gcash" | "paymaya" | "cod" | null;
  cartItems: CartItem[];
  onBack: () => void;
  userId: string;
}

export function ReviewStep({
  address,
  paymentMethod,
  cartItems,
  onBack,
  userId,
}: ReviewStepProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = async () => {
    if (!address || !paymentMethod) {
      toast.error("Please complete all steps before placing order");
      return;
    }
    if (!cartItems || cartItems.length === 0) {
      toast.error("No items selected for checkout.");
      return;
    }

    setIsProcessing(true);
    try {
      // Create order
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          address,
          paymentMethod,
          cartItems,
        }),
      });

      let result: any = null;
      if (!response.ok) {
        // Try JSON first for a meaningful error
        try {
          const errorData = await response.json();
          const message = errorData?.error || errorData?.message || "Failed to place order";
          throw new Error(message);
        } catch {
          // Fallback to text if JSON parse fails
          const text = await response.text().catch(() => "");
          throw new Error(text || "Failed to place order");
        }
      }

      try {
        result = await response.json();
      } catch {
        throw new Error("Failed to place order");
      }

      if (!result?.orderId) {
        const fallbackMessage =
          result?.error || result?.message || "Failed to place order (no order id)";
        throw new Error(fallbackMessage);
      }

      // Handle GCash payment - redirect to PayMongo
      if (paymentMethod === "gcash") {
        toast.info("Redirecting to GCash payment...");
        
        const gcashResponse = await fetch("/api/payments/gcash", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: result.orderId,
            amount: Number(result.total ?? 0),
            description: `Buyani Order #${result.orderId}`,
          }),
        });

        if (!gcashResponse.ok) {
          const errorData = await gcashResponse.json();
          throw new Error(errorData.error || "Failed to create payment session");
        }

        const gcashResult = await gcashResponse.json();
        
        // Redirect to PayMongo checkout
        window.location.href = gcashResult.checkoutUrl;
        return;
      }

      // For COD and other payment methods
      toast.success("Order placed successfully!");
      router.push("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      const message = error instanceof Error ? error.message : "Failed to place order. Please try again.";
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentMethodName = (method: string | null) => {
    switch (method) {
      case "gcash":
        return "GCash";
      case "paymaya":
        return "PayMaya";
      case "cod":
        return "Cash on Delivery";
      default:
        return "Not selected";
    }
  };

  return (
    <div className="space-y-6">
      {/* Delivery Address */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              <CardTitle>Delivery Address</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onBack()}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {address ? (
            <div className="space-y-1 text-slate-700">
              <p className="font-semibold">{address.fullName}</p>
              <p>{address.street}</p>
              {address.apartment && <p>{address.apartment}</p>}
              <p>
                {address.city}, {address.province}
              </p>
              <p>{address.zipcode}</p>
              <p>{address.country}</p>
              <p className="mt-2">Contact: {address.contactNumber}</p>
              {address.deliveryNotes && (
                <p className="mt-2 text-sm text-slate-600">
                  Notes: {address.deliveryNotes}
                </p>
              )}
            </div>
          ) : (
            <p className="text-slate-500">No address provided</p>
          )}
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-emerald-600" />
              <CardTitle>Payment Method</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onBack()}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-xl">
              {paymentMethod === "gcash"
                ? "💙"
                : paymentMethod === "paymaya"
                ? "💚"
                : "💵"}
            </div>
            <p className="font-semibold text-slate-900">
              {getPaymentMethodName(paymentMethod)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-emerald-600" />
              <CardTitle>Order Items ({cartItems.length})</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={() => router.push("/cart")}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.productName || "Product"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900">
                    {item.productName || "Unnamed Product"}
                  </h3>
                  <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                  <p className="text-lg font-bold text-emerald-600 mt-1">
                    ₱{((item.price || 0) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
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
          onClick={handlePlaceOrder}
          disabled={isProcessing || !address || !paymentMethod}
          className={`flex-1 ${
            paymentMethod === "cod"
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {isProcessing
            ? "Processing..."
            : paymentMethod === "cod"
            ? "Place Order (Cash on Delivery)"
            : "Proceed to Payment"}
        </Button>
      </div>
    </div>
  );
}

