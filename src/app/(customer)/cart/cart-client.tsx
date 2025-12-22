"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, Edit, X } from "lucide-react";
import Image from "next/image";
import { removeFromCart, updateCartItemQuantity } from "@/lib/queries/cart";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { toast } from "sonner";

interface CartItem {
  id: string;
  productId: string | null;
  quantity: number;
  productName: string | null;
  price: number | null;
  image: string | null;
  shopId: string | null;
  shopName: string | null;
  variationName?: string | null;
  variationId?: string | null;
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<Set<string>>(new Set());
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();
  const [previousPath, setPreviousPath] = useState<string | null>(null);

  useEffect(() => {
    // Get the previous path from sessionStorage
    const storedPath = sessionStorage.getItem("previousPath");
    if (storedPath && storedPath !== "/cart") {
      setPreviousPath(storedPath);
    }

    // Store current path as previous for next navigation
    const currentPath = window.location.pathname;
    const referrer = document.referrer;
    if (referrer) {
      try {
        const referrerUrl = new URL(referrer);
        if (referrerUrl.pathname !== currentPath) {
          sessionStorage.setItem("previousPath", referrerUrl.pathname);
          setPreviousPath(referrerUrl.pathname);
        }
      } catch (e) {
        // If referrer parsing fails, use stored path or default to home
        if (!storedPath) {
          setPreviousPath("/");
        }
      }
    } else if (!storedPath) {
      setPreviousPath("/");
    }
  }, []);

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

  // Group items by shop
  const groupedByShop = items.reduce((acc, item) => {
    const shopId = item.shopId || 'unknown';
    if (!acc[shopId]) {
      acc[shopId] = {
        shopId,
        shopName: item.shopName || t("unknown-shop"),
        items: []
      };
    }
    acc[shopId].items.push(item);
    return acc;
  }, {} as Record<string, { shopId: string; shopName: string; items: CartItem[] }>);

  const shopGroups = Object.values(groupedByShop);

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
            {t("cart-empty")}
          </h2>
          <p className="text-slate-600 mb-6">
            {t("cart-empty-desc")}
          </p>
          <Button onClick={() => router.push("/")} className="bg-emerald-600 hover:bg-emerald-700">
            {t("continue-shopping")}
          </Button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    if (previousPath && previousPath !== window.location.pathname) {
      router.push("/");
    } else {
      router.back();
    }
  };

  const handleBulkDelete = async () => {
    if (itemsToDelete.size === 0) {
      toast.error("Please select items to delete");
      return;
    }

    setLoading((prev) => {
      const newLoading = { ...prev };
      itemsToDelete.forEach(id => {
        newLoading[id] = true;
      });
      return newLoading;
    });

    try {
      const deletePromises = Array.from(itemsToDelete).map(itemId =>
        removeFromCart(userId, itemId)
      );

      const results = await Promise.all(deletePromises);
      const allSuccess = results.every(r => r.success);

      if (allSuccess) {
        setItems((prev) => prev.filter((item) => !itemsToDelete.has(item.id)));
        setSelectedItems((prev) => {
          const newSet = new Set(prev);
          itemsToDelete.forEach(id => newSet.delete(id));
          return newSet;
        });
        setItemsToDelete(new Set());
        setIsEditMode(false);
        toast.success(`Successfully deleted ${itemsToDelete.size} item(s)`);
      } else {
        toast.error("Some items could not be deleted");
      }
    } catch (error) {
      toast.error("Error deleting items");
    } finally {
      setLoading((prev) => {
        const newLoading = { ...prev };
        itemsToDelete.forEach(id => {
          delete newLoading[id];
        });
        return newLoading;
      });
    }
  };

  const toggleItemForDeletion = (itemId: string) => {
    setItemsToDelete((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-slate-900">{t("shopping-cart")}</h1>
        </div>
        {!isEditMode ? (
          <Button
            variant="outline"
            onClick={() => setIsEditMode(true)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditMode(false);
                setItemsToDelete(new Set());
              }}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={itemsToDelete.size === 0}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete ({itemsToDelete.size})
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Select All Checkbox */}
          {!isEditMode && (
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
                {t("select-all")} ({selectedItems.size} of {items.length})
              </label>
            </div>
          )}
          {isEditMode && (
            <div className="flex items-center gap-2 pb-2 border-b">
              <Checkbox
                id="select-all-delete"
                checked={itemsToDelete.size === items.length && items.length > 0}
                onCheckedChange={() => {
                  if (itemsToDelete.size === items.length) {
                    setItemsToDelete(new Set());
                  } else {
                    setItemsToDelete(new Set(items.map(item => item.id)));
                  }
                }}
              />
              <label
                htmlFor="select-all-delete"
                className="text-sm font-medium text-slate-700 cursor-pointer"
              >
                Select All for Deletion ({itemsToDelete.size} of {items.length})
              </label>
            </div>
          )}

          {/* Shop Groups */}
          {shopGroups.map((shopGroup) => {
            const shopSubtotal = shopGroup.items
              .filter((item) => selectedItems.has(item.id))
              .reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

            return (
              <div key={shopGroup.shopId} className="space-y-3">
                {/* Shop Header */}
                <div className="flex items-center gap-2 py-3 px-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2 flex-1">
                    <svg
                      className="h-5 w-5 text-slate-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="font-semibold text-slate-900">
                      {shopGroup.shopName}
                    </span>
                  </div>
                  {shopSubtotal > 0 && (
                    <span className="text-sm text-slate-600">
                      {t("shop-subtotal")}: <span className="font-semibold text-emerald-600">₱{shopSubtotal.toFixed(2)}</span>
                    </span>
                  )}
                </div>

                {/* Shop Items */}
                {shopGroup.items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Checkbox */}
                        <div className="flex items-start pt-1">
                          {isEditMode ? (
                            <Checkbox
                              id={`delete-${item.id}`}
                              checked={itemsToDelete.has(item.id)}
                              onCheckedChange={() => toggleItemForDeletion(item.id)}
                            />
                          ) : (
                            <Checkbox
                              id={`item-${item.id}`}
                              checked={selectedItems.has(item.id)}
                              onCheckedChange={() => handleToggleSelect(item.id)}
                            />
                          )}
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
                              {t("no-image")}
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 mb-1">
                            {item.productName || t("unnamed-product")}
                          </h3>
                          {item.variationName && item.variationName !== "Standard" && (
                            <p className="text-sm text-slate-500 mb-2">
                              {item.variationName}
                            </p>
                          )}
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

                            {!isEditMode && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleRemove(item.id)}
                                disabled={loading[item.id]}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t("order-summary")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-slate-600">
                <span>{t("subtotal")}</span>
                <span className="font-semibold">₱{subtotal.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold text-slate-900">
                  <span>{t("total")}</span>
                  <span>₱{subtotal.toFixed(2)}</span>
                </div>
              </div>
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                size="lg"
                onClick={() => {
                  setIsCheckingOut(true);
                  const ids = Array.from(selectedItems);
                  router.push(
                    ids.length > 0
                      ? `/checkout?items=${encodeURIComponent(ids.join(","))}`
                      : "/checkout"
                  );
                }}
                disabled={selectedItems.size === 0 || isCheckingOut}
              >
                {isCheckingOut ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t("loading")}...
                  </>
                ) : (
                  `${t("proceed-checkout")} (${selectedItems.size} ${selectedItems.size === 1 ? t("item") : t("items")})`
                )}
              </Button>
              {selectedItems.size === 0 && (
                <p className="text-xs text-center text-muted-foreground mt-2">
                  {t("select-item-checkout")}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
