"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { addToCart } from "@/lib/queries/cart";
import { useRouter } from "next/navigation";

interface AddToCartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    vendor?: {
      name: string;
      icon: string;
    };
  };
  userId: string;
}

export function AddToCartModal({
  open,
  onOpenChange,
  product,
  userId,
}: AddToCartModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if product ID is a placeholder
  const isPlaceholder = product.id.startsWith("PlaceHolder") || product.id.includes("PlaceHolder");

  // Reset quantity and error when modal closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setQuantity(1);
      setError(null);
    }
    onOpenChange(newOpen);
  };

  const handleAddToCart = async () => {
    // Prevent adding placeholder products
    if (isPlaceholder) {
      setError("This is a placeholder product and cannot be added to cart. Please select a real product.");
      return;
    }

    setIsAdding(true);
    setError(null);
    try {
      const result = await addToCart(userId, product.id, quantity);
      if (result.success) {
        // Close modal first
        onOpenChange(false);
        // Reset quantity after adding
        setQuantity(1);
        // Navigate to cart page
        router.push("/cart");
      } else {
        setError(result.error || "Failed to add item to cart. Please try again.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setError("Failed to add item to cart. The product may not exist in the database.");
    } finally {
      setIsAdding(false);
    }
  };

  const totalPrice = product.price * quantity;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add to Cart
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="flex gap-4">
            {/* Product Image */}
            <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/60 to-amber-50/80">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-slate-400 text-2xl">
                  📦
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2">
                {product.name}
              </h3>
              {product.vendor && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                  <span>{product.vendor.icon}</span>
                  <span>{product.vendor.name}</span>
                </div>
              )}
              <p className="text-lg font-bold text-emerald-600">
                ₱{product.price.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">
              Quantity
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold text-lg">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 text-right">
                <p className="text-xs text-slate-500">Total</p>
                <p className="text-xl font-bold text-slate-900">
                  ₱{totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={isAdding || isPlaceholder}
            className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? (
              "Adding to cart..."
            ) : isPlaceholder ? (
              "Placeholder Product"
            ) : (
              <>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add {quantity} {quantity === 1 ? "item" : "items"} to cart
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

