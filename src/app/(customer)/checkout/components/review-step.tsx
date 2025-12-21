"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Wallet, ShoppingBag, ArrowLeft, Edit } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n/context";

type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  productName: string | null;
  price: number | null;
  image: string | null;
  shopId?: string | null;
  shopName?: string | null;
  productVariationId: string;
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
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = async () => {
    if (!address || !paymentMethod) {
      toast.error(t("complete-steps"));
      return;
    }
    if (!cartItems || cartItems.length === 0) {
      toast.error(t("no-items-selected"));
      return;
    }

    setIsProcessing(true);
    try {
      // Create order(s) - one per shop
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
        try {
          const errorData = await response.json();
          const message = errorData?.error || errorData?.message || "Failed to place order";
          throw new Error(message);
        } catch (err) {
          // If response is not JSON, fall back to text if available
          try {
            const text = await response.text();
            throw new Error(text || "Failed to place order");
          } catch {
            throw new Error("Failed to place order");
          }
        }
      } else {
        try {
          result = await response.json();
        } catch {
          throw new Error("Failed to place order");
        }
      }

      // Handle GCash payment - redirect to PayMongo
      // For multiple orders, we use the first order for the combined payment
      if (paymentMethod === "gcash") {
        toast.info(t("redirecting-gcash"));

        // For multiple shop orders, combine them into one payment description
        const orderCount = result.orders?.length || 1;
        const description = orderCount > 1
          ? `BuyAni Orders (${orderCount} shops) - Total: ₱${result.subtotal}`
          : `BuyAni Order #${result.orderId}`;

        const gcashResponse = await fetch("/api/payments/gcash", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: result.orderId,
            orderIds: result.orders?.map((o: any) => o.orderId) || [result.orderId],
            amount: result.subtotal,
            description,
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
      const orderCount = result.orders?.length || 1;
      if (orderCount > 1) {
        toast.success(`${orderCount} ${t("order-placed-success")}`);
      } else {
        toast.success(t("order-placed-success"));
      }
      router.push("/settings/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      const message = error instanceof Error ? error.message : t("failed-place-order");
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentMethodName = (method: string | null) => {
    switch (method) {
      case "gcash":
        return t("gcash");
      case "paymaya":
        return t("paymaya");
      case "cod":
        return t("cash-delivery");
      default:
        return t("not-selected");
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
              <CardTitle>{t("delivery-address")}</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onBack()}>
              <Edit className="h-4 w-4 mr-1" />
              {t("edit")}
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
              <p className="mt-2">{t("contact")}: {address.contactNumber}</p>
              {address.deliveryNotes && (
                <p className="mt-2 text-sm text-slate-600">
                  {t("notes")}: {address.deliveryNotes}
                </p>
              )}
            </div>
          ) : (
            <p className="text-slate-500">{t("no-address-provided")}</p>
          )}
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-emerald-600" />
              <CardTitle>{t("payment-method")}</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onBack()}>
              <Edit className="h-4 w-4 mr-1" />
              {t("edit")}
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
              <CardTitle>{t("order-items")} ({cartItems.length})</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={() => router.push("/cart")}>
              <Edit className="h-4 w-4 mr-1" />
              {t("edit")}
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
                      {t("no-image")}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900">
                    {item.productName || t("unnamed-product")}
                  </h3>
                  <p className="text-sm text-slate-600">{t("qty")}: {item.quantity}</p>
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
          {t("back")}
        </Button>
        <Button
          type="button"
          onClick={handlePlaceOrder}
          disabled={isProcessing || !address || !paymentMethod}
          className={`flex-1 ${paymentMethod === "cod"
            ? "bg-emerald-600 hover:bg-emerald-700"
            : "bg-orange-500 hover:bg-orange-600"
            }`}
        >
          {isProcessing
            ? t("processing")
            : paymentMethod === "cod"
              ? t("place-order-cod")
              : t("proceed-payment")}
        </Button>
      </div>
    </div>
  );
}

