"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface OrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  total: number;
}

export function OrderSummary({
  cartItems,
  subtotal,
  total,
}: OrderSummaryProps) {
  const { t } = useLanguage();
  // Group items by shop
  const groupedByShop = cartItems.reduce((acc, item) => {
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

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>{t("order-summary")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Shop breakdown */}
        {shopGroups.length > 1 && (
          <div className="space-y-3 pb-3 border-b">
            {shopGroups.map((shopGroup) => {
              const shopSubtotal = shopGroup.items.reduce(
                (sum, item) => sum + (item.price || 0) * item.quantity,
                0
              );
              return (
                <div key={shopGroup.shopId} className="space-y-1">
                  <p className="text-sm font-medium text-slate-700">
                    {shopGroup.shopName}
                  </p>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>{shopGroup.items.length} {shopGroup.items.length === 1 ? t("item") : t("items")}</span>
                    <span className="font-semibold text-emerald-600">₱{shopSubtotal.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Total summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-slate-600">
            <span>{t("subtotal")} ({cartItems.length} {cartItems.length === 1 ? t("item") : t("items")})</span>
            <span className="font-semibold">₱{subtotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between text-lg font-bold text-slate-900">
            <span>{t("total")}</span>
            <span className="text-emerald-600">₱{total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
