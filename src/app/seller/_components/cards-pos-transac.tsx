"use-client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
};

export function CardsPosTransac() {
  const [collapsed, setCollapsed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [cartItems, setCartItems] = useState<CartItem[]>([ /* HARDCODED*/ ]);

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQty = (id: number, newQty: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, newQty) } : item
      )
    );
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

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
            <span className="font-semibold">₱{subtotal}</span>
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
                <DropdownMenuItem onClick={() => setPaymentMethod("Cash")}>
                  Cash
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPaymentMethod("GCash")}>
                  GCash
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPaymentMethod("Maya")}>
                  Maya
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* COMPLETE BUTTON */}
          <Button className="w-full bg-green-600 hover:bg-green-700 cursor-pointer">
            Complete Sale
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

