"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { removeFromCart, updateCartItemQuantity } from "@/lib/queries/cart";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  productName: string | null;
  price: number | null;
  image: string | null;
}

interface CartClientProps {
  initialItems: CartItem[];
  userId: string;
}

export function CartClient({ initialItems, userId }: CartClientProps) {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [selectedItems, setSelectedItems] = useState<Set<string>>(
    new Set(initialItems.map(item => item.id))
  );
  const router = useRouter();

  const handleRemove = async (itemId: string) => {
    setLoading((prev) => ({ ...prev, [itemId]: true }));
    const result = await removeFromCart(userId, itemId);
    if (result.success) {
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    }
    setLoading((prev) => ({ ...prev, [itemId]: false }));
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    setLoading((prev) => ({ ...prev, [itemId]: true }));
    const result = await updateCartItemQuantity(userId, itemId, newQuantity);
    if (result.success) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
    setLoading((prev) => ({ ...prev, [itemId]: false }));
  };

  const handleToggleSelect = (itemId: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
  };

  const subtotal = items
    .filter((item) => selectedItems.has(item.id))
    .reduce(
      (sum, item) => sum + (item.price || 0) * item.quantity,
      0
    );

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-20">
          <ShoppingCart className="h-16 w-16 text-slate-300 mb-4" />
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-slate-600 mb-6">
            Add some items to get started!
          </p>
          <Button onClick={() => router.push("/")} className="bg-emerald-600 hover:bg-emerald-700">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Select All Checkbox */}
          <div className="flex items-center gap-2 pb-2 border-b">
            <Checkbox
              id="select-all"
              checked={selectedItems.size === items.length && items.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <label
              htmlFor="select-all"
              className="text-sm font-medium text-slate-700 cursor-pointer"
            >
              Select All ({selectedItems.size} of {items.length})
            </label>
          </div>

          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Checkbox */}
                  <div className="flex items-start pt-1">
                    <Checkbox
                      id={`item-${item.id}`}
                      checked={selectedItems.has(item.id)}
                      onCheckedChange={() => handleToggleSelect(item.id)}
                    />
                  </div>

                  {/* Product Image */}
                  <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.productName || "Product"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {item.productName || "Unnamed Product"}
                    </h3>
                    <p className="text-lg font-bold text-emerald-600 mb-3">
                      ₱{((item.price || 0) * item.quantity).toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={loading[item.id] || item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={loading[item.id]}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRemove(item.id)}
                        disabled={loading[item.id]}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold">₱{subtotal.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold text-slate-900">
                  <span>Total</span>
                  <span>₱{subtotal.toFixed(2)}</span>
                </div>
              </div>
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                size="lg"
                onClick={() => router.push("/checkout")}
                disabled={selectedItems.size === 0}
              >
                Proceed to Checkout ({selectedItems.size} {selectedItems.size === 1 ? "item" : "items"})
              </Button>
              {selectedItems.size === 0 && (
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Please select at least one item to checkout
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

