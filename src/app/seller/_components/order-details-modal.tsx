"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import type { Order } from "@/types/orders";
import { useLanguage } from "@/lib/i18n/context";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

export function OrderDetailsModal({ open, onOpenChange, order }: Props) {
  const { t } = useLanguage();

  if (!order) return null;

  const orderId = order.orderId || order.id || "Unknown Order";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {t("order-details")} — {orderId}
          </DialogTitle>
        </DialogHeader>

        {/* Buyer + Status */}
        <div className="space-y-1 text-sm">
          <p>
            <span className="font-medium">{t("customer")}:</span>{" "}
            {order.buyerName ?? t("unknown-customer")}
          </p>

          <p>
            <span className="font-medium">{t("status")}:</span>{" "}
            <Badge variant="outline">
              {order.status ?? "pending"}
            </Badge>
          </p>
        </div>

        <Separator />

        {/* Order Items */}
        <div className="space-y-3 max-h-[350px] overflow-y-auto">
          {order.items.map((item: any) => {
            // Handle both API structure (item.product?.productName) and type definition (item.productName)
            const productName = item.product?.productName ?? item.productName ?? "Unknown Product";
            // Handle image from nested product.images or direct productImage
            const productImage = item.product?.images?.[0]?.image_url?.[0] 
              ?? item.product?.images?.[0]?.url 
              ?? item.productImage 
              ?? null;
            
            return (
              <div
                key={`${orderId}-${item.productId}`}
                className="flex gap-4 border rounded-lg p-3"
              >
                {/* Product Image */}
                <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted shrink-0">
                  {productImage ? (
                    <Image
                      src={productImage}
                      alt={productName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 space-y-1">
                  <p className="font-medium">{productName}</p>

                  <p className="text-sm text-muted-foreground">
                    {t("quantity")}: {item.quantity}
                  </p>

                  <p className="text-sm">
                    {t("subtotal")}: ₱{item.subtotal.toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <Separator />

        {/* Order Summary */}
        <div className="flex justify-between text-sm font-medium">
          <span>{t("total")}:</span>
          <span>₱{order.total?.toFixed(2)}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
