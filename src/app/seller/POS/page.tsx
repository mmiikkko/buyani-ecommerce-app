"use client";
import { useState, useRef } from "react";
import { CardsPosProd, type CardsPosProdRef } from "../_components/cards-pos-prod";
import { CardsPosTransac } from "../_components/cards-pos-transac";
import { useLanguage } from "@/lib/i18n/context";

type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  stock: number;
};

type POSProduct = {
  id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
};

export default function POS() {
  const { t } = useLanguage();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const productsRef = useRef<CardsPosProdRef>(null);

  const handleAddToCart = (product: POSProduct) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        // If item exists, increase quantity if stock allows
        if (existingItem.qty < product.stock) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, qty: item.qty + 1 }
              : item
          );
        } else {
          return prev; // Stock limit reached
        }
      } else {
        // Add new item
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            qty: 1,
            stock: product.stock,
          },
        ];
      }
    });
  };

  const handleSaleComplete = () => {
    // Refresh products to show updated stock
    productsRef.current?.refreshProducts();
  };

  return (
    <section className="relative min-h-screen min-w-[80%] max-w-[100%] overflow-hidden space-y-5 mx-3">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <h1 className="text-xl mb-1 font-bold text-[#2E7D32]">{t("pos")}</h1>
          <p>{t("process-transactions")}</p>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex-1">
          <CardsPosProd ref={productsRef} onAddToCart={handleAddToCart} />
        </div>
        <CardsPosTransac
          cartItems={cartItems}
          onUpdateCart={setCartItems}
          onSaleComplete={handleSaleComplete}
        />
      </div>
    </section>
  );
}
