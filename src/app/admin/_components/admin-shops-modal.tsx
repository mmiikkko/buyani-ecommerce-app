"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type ShopModalProps = {
  open: boolean;
  onClose: () => void;
  shop: {
    id: string;
    shop_name: string;
    owner_name?: string;
    seller_id: string;
    description?: string;
    image?: string;
    status: string;
    average_rating?: number;
    total_reviews?: number;
  }; // allow null
};

export function AdminShopModal({ open, onClose, shop }: ShopModalProps) {
  if (!shop) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {shop.shop_name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* SHOP IMAGE */}
          <div className="relative w-full h-64 rounded-lg overflow-hidden border">
            <Image
              src={shop.image || "/assets/placeholder.png"}
              alt={shop.shop_name}
              fill
              className="object-cover"
            />
          </div>

          {/* SHOP INFO */}
          <div className="space-y-3 text-sm">
            <p>
              <span className="font-semibold">Owner:</span>{" "}
              {shop.owner_name || shop.seller_id}
            </p>

            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={
                  shop.status === "approved"
                    ? "text-green-600 font-medium"
                    : shop.status === "pending"
                    ? "text-yellow-600 font-medium"
                    : "text-red-600 font-medium"
                }
              >
                {shop.status}
              </span>
            </p>

            {/* RATINGS */}
            <div>
              <p className="font-semibold">Ratings:</p>
              {shop.average_rating ? (
                <p>
                  ⭐ {shop.average_rating.toFixed(1)} / 5{" "}
                  <span className="text-gray-500">
                    ({shop.total_reviews} reviews)
                  </span>
                </p>
              ) : (
                <p className="text-gray-500">No ratings yet</p>
              )}
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        {shop.description && (
          <div className="mt-6">
            <p className="font-semibold text-md mb-2">Description:</p>
            <p className="text-gray-700 text-sm">{shop.description}</p>
          </div>
        )}

        {/* PRODUCTS LINK */}
        <Button
          className="mt-6 w-full"
          onClick={() => (window.location.href = `./admin/products-monitor?shopId=${shop.id}`)}
        >
          View All Products
        </Button>

        <Button variant="outline" onClick={onClose} className="mt-3 w-full">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
