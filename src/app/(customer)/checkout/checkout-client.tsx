"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckoutProgress } from "./components/checkout-progress";
import { DeliveryStep } from "./components/delivery-step";
import { PaymentStep } from "./components/payment-step";
import { ReviewStep } from "./components/review-step";
import { OrderSummary } from "./components/order-summary";

type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  productName: string | null;
  price: number | null;
  image: string | null;
};

type User = {
  id: string;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
};

type Address = {
  id: string;
  street: string | null;
  city: string | null;
  province: string | null;
  zipcode: string | null;
  region: string | null;
  remarks: string | null;
};

type CheckoutData = {
  address: {
    fullName: string;
    street: string;
    apartment: string;
    city: string;
    province: string;
    zipcode: string;
    country: string;
    contactNumber: string;
    deliveryNotes: string;
  } | null;
  paymentMethod: "gcash" | "paymaya" | "cod" | null;
};

interface CheckoutClientProps {
  cartItems: CartItem[];
  userId: string;
  user: User;
}

export function CheckoutClient({ cartItems, userId, user }: CheckoutClientProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    address: null,
    paymentMethod: null,
  });
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch saved addresses
    fetch("/api/addresses")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSavedAddresses(data);
          // If user has a saved address, pre-fill it
          if (data.length > 0) {
            const addr = data[0];
            // Parse street to separate street and apartment if needed
            const streetParts = addr.street?.split(", ") || [];
            setCheckoutData((prev) => ({
              ...prev,
              address: {
                fullName: `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.name || "",
                street: streetParts[0] || "",
                apartment: streetParts.slice(1).join(", ") || "",
                city: addr.city || "",
                province: addr.province || "",
                zipcode: addr.zipcode || "",
                country: addr.region || "Philippines",
                contactNumber: "",
                deliveryNotes: addr.remarks || "",
              },
            }));
          }
        }
      })
      .catch((err) => console.error("Error fetching addresses:", err));
  }, [user]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );
  const shippingFee = subtotal >= 500 ? 0 : 50; // Free shipping over 500
  const total = subtotal + shippingFee;

  const handleAddressSubmit = async (addressData: CheckoutData["address"]) => {
    setLoading(true);
    try {
      // Save address to database
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        throw new Error("Failed to save address");
      }

      setCheckoutData((prev) => ({ ...prev, address: addressData }));
      setCurrentStep(2);
    } catch (error) {
      console.error("Error saving address:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSelect = (method: "gcash" | "paymaya" | "cod") => {
    setCheckoutData((prev) => ({ ...prev, paymentMethod: method }));
    setCurrentStep(3);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
    } else {
      router.push("/cart");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <CheckoutProgress currentStep={currentStep} />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {currentStep === 1 && (
            <DeliveryStep
              initialData={checkoutData.address}
              user={user}
              onSubmit={handleAddressSubmit}
              loading={loading}
            />
          )}
          {currentStep === 2 && (
            <PaymentStep
              selectedMethod={checkoutData.paymentMethod}
              onSelect={handlePaymentSelect}
              onBack={handleBack}
            />
          )}
          {currentStep === 3 && (
            <ReviewStep
              address={checkoutData.address}
              paymentMethod={checkoutData.paymentMethod}
              cartItems={cartItems}
              onBack={handleBack}
              userId={userId}
            />
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <OrderSummary
            cartItems={cartItems}
            subtotal={subtotal}
            shippingFee={shippingFee}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}

