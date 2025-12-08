"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  stock: number;
};

interface CardsPosTransacProps {
  cartItems: CartItem[];
  onUpdateCart: (items: CartItem[]) => void;
}

export function CardsPosTransac({ cartItems, onUpdateCart }: CardsPosTransacProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentReceived, setPaymentReceived] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const removeItem = (id: string) => {
    onUpdateCart(cartItems.filter((item) => item.id !== id));
  };

  const updateQty = (id: string, newQty: number) => {
    onUpdateCart(
      cartItems.map((item) => {
        if (item.id === id) {
          const qty = Math.max(1, Math.min(newQty, item.stock));
          return { ...item, qty };
        }
        return item;
      })
    );
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const change = paymentReceived
    ? Math.max(0, Number(paymentReceived) - subtotal)
    : 0;

  const handleCompleteSale = async () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    if (paymentMethod === "Cash" && (!paymentReceived || Number(paymentReceived) < subtotal)) {
      toast.error("Payment received must be at least the total amount");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/sellers/pos/complete-sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.qty,
            price: item.price,
          })),
          paymentMethod: paymentMethod.toLowerCase(),
          paymentReceived: paymentMethod === "Cash" ? Number(paymentReceived) : subtotal,
          change: paymentMethod === "Cash" ? change : 0,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to complete sale");
      }

      toast.success("Sale completed successfully!");
      
      // Clear cart and reset
      onUpdateCart([]);
      setPaymentReceived("");
      setPaymentMethod("Cash");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to complete sale";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-sm shadow-md border sticky top-4">
      {/* Header */}
      <CardHeader
        className="flex flex-row items-center justify-between cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <h2 className="text-md font-semibold">Current Sale</h2>

        {collapsed ? (
          <ChevronDown className="w-5 h-5" />
        ) : (
          <ChevronUp className="w-5 h-5" />
        )}
      </CardHeader>

      {/* Collapsible Body */}
      {!collapsed && (
        <CardContent className="flex flex-col gap-4 pb-4">
          {/* SCROLLABLE LIST */}
          <div className="max-h-64 overflow-y-auto pr-2 space-y-4">
            {cartItems.length === 0 && (
              <p className="text-sm text-muted-foreground">No items yet.</p>
            )}

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ₱{item.price} × {item.qty}
                  </p>
                </div>

                {/* Quantity & Remove */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="cursor-pointer"
                  >
                    -
                  </Button>
                  <span>{item.qty}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="cursor-pointer"
                  >
                    +
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-red-500 " />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="flex justify-between pt-2 border-t">
            <span className="font-medium">Total:</span>
            <span className="font-semibold">₱{subtotal.toFixed(2)}</span>
          </div>

          {/* PAYMENT METHOD DROPDOWN MENU */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Payment Method</label>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-between cursor-pointer">
                  {paymentMethod}
                  <ChevronDown className="ml-2 h-4 w-4 opacity-60" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-[200px]">
                <DropdownMenuItem onClick={() => {
                  setPaymentMethod("Cash");
                  setPaymentReceived("");
                }}>
                  Cash
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setPaymentMethod("GCash");
                  setPaymentReceived(subtotal.toFixed(2));
                }}>
                  GCash
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setPaymentMethod("Maya");
                  setPaymentReceived(subtotal.toFixed(2));
                }}>
                  Maya
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* PAYMENT RECEIVED (for Cash) */}
          {paymentMethod === "Cash" && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Payment Received</label>
              <Input
                type="number"
                placeholder="0.00"
                value={paymentReceived}
                onChange={(e) => setPaymentReceived(e.target.value)}
                min={subtotal}
                step="0.01"
              />
              {paymentReceived && Number(paymentReceived) >= subtotal && (
                <p className="text-sm text-green-600 font-medium">
                  Change: ₱{change.toFixed(2)}
                </p>
              )}
            </div>
          )}

          {/* COMPLETE BUTTON */}
          <Button
            className="w-full bg-green-600 hover:bg-green-700 cursor-pointer"
            onClick={handleCompleteSale}
            disabled={isProcessing || (paymentMethod === "Cash" && (!paymentReceived || Number(paymentReceived) < subtotal))}
          >
            {isProcessing ? "Processing..." : "Complete Sale"}
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

