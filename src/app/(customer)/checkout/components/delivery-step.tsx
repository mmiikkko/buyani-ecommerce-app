"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowRight, MapPin, Check, Plus } from "lucide-react";

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

type SavedAddress = {
  id: string;
  receipientName: string;
  street: string | null;
  baranggay: string | null;
  city: string | null;
  province: string | null;
  region: string | null;
  zipcode: string | null;
  remarks: string | null;
};

type User = {
  id: string;
  name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  image?: string | null;
  phone_number?: string | null;
};

interface DeliveryStepProps {
  initialData: AddressData | null;
  user: User;
  onSubmit: (data: AddressData) => void;
  loading: boolean;
}

export function DeliveryStep({ initialData, user, onSubmit, loading }: DeliveryStepProps) {
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | "new">("new");
  const [formData, setFormData] = useState<AddressData>({
    fullName: initialData?.fullName || `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.name || "",
    street: initialData?.street || "",
    apartment: initialData?.apartment || "",
    city: initialData?.city || "",
    province: initialData?.province || "",
    zipcode: initialData?.zipcode || "",
    country: initialData?.country || "Philippines",
    contactNumber: initialData?.contactNumber || "",
    deliveryNotes: initialData?.deliveryNotes || "",
  });

  useEffect(() => {
    // Fetch saved addresses
    fetch("/api/addresses")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSavedAddresses(data);
          // If addresses exist, select the first one
          if (data.length > 0) {
            handleSelectAddress(data[0].id);
          }
        }
      })
      .catch((err) => console.error("Error fetching addresses:", err));
  }, []);

  const handleSelectAddress = (addressId: string) => {
    if (addressId === "new") {
      setSelectedAddressId("new");
      setFormData({
        fullName: `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.name || "",
        street: "",
        apartment: "",
        city: "",
        province: "",
        zipcode: "",
        country: "Philippines",
        contactNumber: "",
        deliveryNotes: "",
      });
      return;
    }

    const address = savedAddresses.find((a) => a.id === addressId);
    if (!address) return;

    setSelectedAddressId(addressId);
    // Parse street to separate street and apartment if needed
    const streetParts = address.street?.split(", ") || [];
    setFormData({
      fullName: address.receipientName || "",
      street: streetParts[0] || "",
      apartment: streetParts.slice(1).join(", ") || "",
      city: address.city || "",
      province: address.province || "",
      zipcode: address.zipcode || "",
      country: address.region || "Philippines",
      contactNumber: "",
      deliveryNotes: address.remarks || "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If a new address is being entered, save it to the database
    if (selectedAddressId === "new") {
      try {
        const addressPayload = {
          receipientName: formData.fullName,
          street: formData.apartment ? `${formData.street}, ${formData.apartment}` : formData.street,
          baranggay: null,
          city: formData.city,
          province: formData.province,
          region: formData.country,
          zipcode: formData.zipcode,
          remarks: formData.deliveryNotes || null,
        };

        const response = await fetch("/api/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addressPayload),
        });

        if (!response.ok) {
          throw new Error("Failed to save address");
        }
      } catch (error) {
        console.error("Error saving address:", error);
        // Continue anyway - the address data is still valid for checkout
      }
    }
    
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-emerald-600" />
          <CardTitle>Delivery Address</CardTitle>
        </div>
        <p className="text-sm text-slate-600 mt-1">
          Where should we deliver your order?
        </p>
      </CardHeader>
      <CardContent>
        {savedAddresses.length > 0 && (
          <div className="mb-6">
            <Label className="text-base font-semibold mb-3 block">
              Select or Add Address
            </Label>
            <div className="space-y-3">
              {savedAddresses.map((address) => (
                <div
                  key={address.id}
                  className={`flex items-start space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedAddressId === address.id
                      ? "border-emerald-600 bg-emerald-50"
                      : "hover:bg-slate-50"
                  }`}
                  onClick={() => handleSelectAddress(address.id)}
                >
                  <div className={`mt-1 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                    selectedAddressId === address.id
                      ? "border-emerald-600 bg-emerald-600"
                      : "border-gray-300"
                  }`}>
                    {selectedAddressId === address.id && (
                      <div className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      <span className="font-semibold">{address.receipientName}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {address.street}
                      {address.baranggay && `, ${address.baranggay}`}
                      {address.city && `, ${address.city}`}
                      {address.province && `, ${address.province}`}
                      {address.region && `, ${address.region}`}
                      {address.zipcode && ` ${address.zipcode}`}
                    </p>
                  </div>
                </div>
              ))}
              <div
                className={`flex items-start space-x-3 border rounded-lg p-4 cursor-pointer transition-colors border-dashed ${
                  selectedAddressId === "new"
                    ? "border-emerald-600 bg-emerald-50"
                    : "hover:bg-slate-50"
                }`}
                onClick={() => handleSelectAddress("new")}
              >
                <div className={`mt-1 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                  selectedAddressId === "new"
                    ? "border-emerald-600 bg-emerald-600"
                    : "border-gray-300"
                }`}>
                  {selectedAddressId === "new" && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <Plus className="h-4 w-4 text-emerald-600" />
                  <span className="font-semibold">Add New Address</span>
                </div>
              </div>
            </div>

            {/* Continue button for saved address */}
            {selectedAddressId !== "new" && (
              <Button
                onClick={handleSubmit}
                className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-base font-semibold mt-4"
                disabled={loading}
              >
                {loading ? "Saving..." : (
                  <>
                    Continue to Payment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {/* Show form only when adding new address or no saved addresses exist */}
        {(savedAddresses.length === 0 || selectedAddressId === "new") && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">
                Recipient Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                }
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="street">
                Street Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, street: e.target.value }))
                }
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="apartment">
                Apartment, Suite, Unit, etc. (Optional)
              </Label>
              <Input
                id="apartment"
                value={formData.apartment}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, apartment: e.target.value }))
                }
                placeholder="Apartment, suite, unit, building, floor, etc."
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="city">
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, city: e.target.value }))
                  }
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="province">
                  State / Province <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="province"
                  value={formData.province}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, province: e.target.value }))
                  }
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="zipcode">
                  Postal / ZIP Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="zipcode"
                  value={formData.zipcode}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, zipcode: e.target.value }))
                  }
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="country">
                  Country <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, country: e.target.value }))
                  }
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="contactNumber">
                Contact Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contactNumber"
                type="tel"
                value={formData.contactNumber}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, contactNumber: e.target.value }))
                }
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="deliveryNotes">Delivery Notes (Optional)</Label>
              <Textarea
                id="deliveryNotes"
                value={formData.deliveryNotes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, deliveryNotes: e.target.value }))
                }
                placeholder="e.g. Leave at the front desk, Call upon arrival"
                className="mt-1"
                rows={3}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-base font-semibold"
              disabled={loading}
            >
              {loading ? "Saving..." : (
                <>
                  Continue to Payment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

