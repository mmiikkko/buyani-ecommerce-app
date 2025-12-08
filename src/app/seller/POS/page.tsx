"use client";
import { useState } from "react";
import { CardsPosProd } from "../_components/cards-pos-prod";
import { CardsPosTransac } from "../_components/cards-pos-transac";

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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

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

  return (
    <section className="relative min-h-screen min-w-[80%] max-w-[100%] overflow-hidden space-y-5 mt-18 mx-3">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <h1 className="text-xl mb-1 font-bold text-[#2E7D32]">POS</h1>
          <p>Process in-store transactions</p>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex-1">
          <CardsPosProd onAddToCart={handleAddToCart} />
        </div>
        <CardsPosTransac cartItems={cartItems} onUpdateCart={setCartItems} />
      </div>
    </section>
  );
}
