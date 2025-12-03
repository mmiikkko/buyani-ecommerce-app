"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowRight } from "lucide-react";

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

type User = {
  id: string;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
};

interface DeliveryStepProps {
  initialData: AddressData | null;
  user: User;
  onSubmit: (data: AddressData) => void;
  loading: boolean;
}

export function DeliveryStep({ initialData, user, onSubmit, loading }: DeliveryStepProps) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">
              Full Name <span className="text-red-500">*</span>
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
      </CardContent>
    </Card>
  );
}

