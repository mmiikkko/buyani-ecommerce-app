"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { BadgeAlert, Trash2, Undo2, Check } from "lucide-react";

// Review type returned from /api/reviews
type Review = {
  reviewId: string;
  buyerName: string | null;
  buyerEmail: string | null;
  comment: string | null;
  rating: number | null;
  createdAt: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    shopOwner: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    dateAdded: string;
    status: string;
    image: string;
    flags?: number;
    reason?: string;
  } | null;
  onUpdateStatus?: (id: string, status: string) => void;
};

export function AdminProductModal({
  open,
  onClose,
  product,
  onUpdateStatus,
}: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // ------------------------------------------------------------
  // FETCH REVIEWS WHEN MODAL OPENS
  // ------------------------------------------------------------
  useEffect(() => {
    if (!open || !product) return;

    const fetchReviews = async () => {
      setLoadingReviews(true);

      try {
        const res = await fetch(`/api/reviews?productId=${product.id}`);
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error("Error loading reviews:", err);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [open, product]);

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {product.name}
          </DialogTitle>
        </DialogHeader>

        {/* TABS WRAPPER */}
        <Tabs defaultValue="details" className="mt-2">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="actions">Admin Actions</TabsTrigger>
          </TabsList>

          {/* ------------------------------------------------------------ */}
          {/* TAB 1 — PRODUCT DETAILS */}
          {/* ------------------------------------------------------------ */}
          <TabsContent value="details" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* IMAGE */}
              <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* BASIC DETAILS */}
              <div className="space-y-3 text-sm">
                <p>
                  <span className="font-semibold">Shop Owner:</span>{" "}
                  {product.shopOwner}
                </p>
                <p>
                  <span className="font-semibold">Category:</span>{" "}
                  {product.category}
                </p>
                <p>
                  <span className="font-semibold">Price:</span> ₱
                  {product.price}
                </p>
                <p>
                  <span className="font-semibold">Stock:</span>{" "}
                  {product.stock}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {product.status}
                </p>
                <p>
                  <span className="font-semibold">Date Added:</span>{" "}
                  {product.dateAdded}
                </p>

                {product.status === "flagged" && (
                  <div className="bg-red-100 text-red-700 p-3 rounded-md mt-3">
                    <p className="flex items-center gap-2 font-semibold">
                      <BadgeAlert className="w-4 h-4" />
                      {product.flags} Reports
                    </p>
                    {product.reason && (
                      <p className="mt-1">
                        <span className="font-semibold">Reason:</span>{" "}
                        {product.reason}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-6">
              <p className="font-semibold mb-2">Description:</p>
              <p className="text-gray-700 text-sm">{product.description}</p>
            </div>
          </TabsContent>

          {/* ------------------------------------------------------------ */}
          {/* TAB 2 — REVIEWS */}
          {/* ------------------------------------------------------------ */}
          <TabsContent value="reviews" className="mt-4">
            {loadingReviews ? (
              <p>Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-gray-600 text-sm">
                No reviews for this product yet.
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.reviewId}
                    className="border rounded-lg p-3 bg-gray-50"
                  >
                    <p className="font-medium">{rev.buyerName}</p>
                    <p className="text-xs text-gray-500">
                      {rev.buyerEmail}
                    </p>

                    <p className="mt-2 text-yellow-600 text-sm">
                      ⭐ {rev.rating}/5
                    </p>

                    <p className="mt-2 text-sm">{rev.comment}</p>

                    <p className="text-xs mt-2 text-gray-500">
                      {rev.createdAt}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ------------------------------------------------------------ */}
          {/* TAB 3 — ADMIN ACTIONS */}
          {/* ------------------------------------------------------------ */}
          <TabsContent value="actions" className="mt-4 space-y-4">
            <p className="text-sm text-gray-600">
              Update this product’s visibility & status.
            </p>

            {/* ACTION BUTTONS */}
            {product.status === "flagged" && (
              <>
                <Button
                  className="bg-green-600 hover:bg-green-700 w-full"
                  onClick={() =>
                    onUpdateStatus?.(product.id, "normal")
                  }
                >
                  <Check className="w-4 h-4 mr-1" />
                  Mark as Safe
                </Button>

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() =>
                    onUpdateStatus?.(product.id, "removed")
                  }
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove Product
                </Button>
              </>
            )}

            {product.status === "removed" && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  onUpdateStatus?.(product.id, "normal")
                }
              >
                <Undo2 className="w-4 h-4 mr-1" />
                Restore Product
              </Button>
            )}

            {/* ALWAYS AVAILABLE */}
            <Button
              variant="destructive"
              className="w-full mt-2"
              onClick={() =>
                onUpdateStatus?.(product.id, "delete")
              }
            >
              Delete Permanently
            </Button>
          </TabsContent>
        </Tabs>

        {/* CLOSE BUTTON */}
        <Button onClick={onClose} className="mt-6 w-full">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
