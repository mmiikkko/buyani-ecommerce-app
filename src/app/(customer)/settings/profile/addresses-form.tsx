"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/loading-button";
import { MapPin, Plus, Edit, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Address = {
  id: string;
  receipientName: string;
  street: string | null;
  baranggay: string | null;
  city: string | null;
  province: string | null;
  region: string | null;
  zipcode: string | null;
  remarks: string | null;
  addedAt: Date | null;
};

type AddressFormData = {
  receipientName: string;
  street: string;
  baranggay: string;
  city: string;
  province: string;
  region: string;
  zipcode: string;
  remarks: string;
};

export function AddressesForm() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteAddressId, setDeleteAddressId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddressFormData>({
    receipientName: "",
    street: "",
    baranggay: "",
    city: "",
    province: "",
    region: "",
    zipcode: "",
    remarks: "",
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch("/api/addresses");
      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        receipientName: address.receipientName || "",
        street: address.street || "",
        baranggay: address.baranggay || "",
        city: address.city || "",
        province: address.province || "",
        region: address.region || "",
        zipcode: address.zipcode || "",
        remarks: address.remarks || "",
      });
    } else {
      setEditingAddress(null);
      setFormData({
        receipientName: "",
        street: "",
        baranggay: "",
        city: "",
        province: "",
        region: "",
        zipcode: "",
        remarks: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAddress(null);
    setFormData({
      receipientName: "",
      street: "",
      baranggay: "",
      city: "",
      province: "",
      region: "",
      zipcode: "",
      remarks: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.receipientName || !formData.street || !formData.city || !formData.province || !formData.zipcode) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const url = editingAddress
        ? `/api/addresses?id=${editingAddress.id}`
        : "/api/addresses";
      const method = editingAddress ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || "Failed to save address";
        console.error("API Error:", errorData);
        throw new Error(errorMessage);
      }

      toast.success(editingAddress ? "Address updated" : "Address added");
      handleCloseDialog();
      fetchAddresses();
    } catch (error) {
      console.error("Error saving address:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save address";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async () => {
    if (!deleteAddressId) return;

    try {
      const response = await fetch(`/api/addresses?id=${deleteAddressId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete address");
      }

      toast.success("Address deleted");
      setDeleteAddressId(null);
      fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    }
  };


  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading addresses...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Addresses</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your delivery addresses
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </DialogTitle>
                <DialogDescription>
                  {editingAddress
                    ? "Update your address information"
                    : "Add a new delivery address"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="receipientName">
                    Recipient Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="receipientName"
                    value={formData.receipientName}
                    onChange={(e) =>
                      setFormData({ ...formData, receipientName: e.target.value })
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
                      setFormData({ ...formData, street: e.target.value })
                    }
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="baranggay">Baranggay</Label>
                  <Input
                    id="baranggay"
                    value={formData.baranggay}
                    onChange={(e) =>
                      setFormData({ ...formData, baranggay: e.target.value })
                    }
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
                        setFormData({ ...formData, city: e.target.value })
                      }
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="province">
                      Province <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="province"
                      value={formData.province}
                      onChange={(e) =>
                        setFormData({ ...formData, province: e.target.value })
                      }
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="region">Region</Label>
                    <Input
                      id="region"
                      value={formData.region}
                      onChange={(e) =>
                        setFormData({ ...formData, region: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="zipcode">
                      ZIP Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="zipcode"
                      value={formData.zipcode}
                      onChange={(e) =>
                        setFormData({ ...formData, zipcode: e.target.value })
                      }
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="remarks">Remarks / Delivery Notes</Label>
                  <Textarea
                    id="remarks"
                    value={formData.remarks}
                    onChange={(e) =>
                      setFormData({ ...formData, remarks: e.target.value })
                    }
                    placeholder="e.g. Leave at the front desk, Call upon arrival"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseDialog}
                  >
                    Cancel
                  </Button>
                  <LoadingButton type="submit" loading={false}>
                      {editingAddress ? "Update" : "Add"} Address
                  </LoadingButton>

                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              No addresses saved yet
            </p>
            <Button onClick={() => handleOpenDialog()} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Address
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="border rounded-lg p-4 space-y-2"
              >
                <div>
                  <h3 className="font-semibold">{address.receipientName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {address.street}
                    {address.baranggay && `, ${address.baranggay}`}
                    {address.city && `, ${address.city}`}
                    {address.province && `, ${address.province}`}
                    {address.region && `, ${address.region}`}
                    {address.zipcode && ` ${address.zipcode}`}
                  </p>
                  {address.remarks && (
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="font-medium">Notes:</span> {address.remarks}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(address)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteAddressId(address.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <AlertDialog
        open={deleteAddressId !== null}
        onOpenChange={(open) => !open && setDeleteAddressId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

