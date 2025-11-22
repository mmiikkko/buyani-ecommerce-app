"use client";
import { AddProducts } from "../_components/list-product";
import { ProductCard } from "../_components/product-card";
import { useState } from "react";

export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  return (
    <section className="relative min-h-screen min-w-full overflow-hidden space-y-5 mt-18">
      
      {/* Header */}
      <div className="flex flex-row justify-between items-center px-3">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-[#2E7D32]">Products Listing</h1>
          <p>Manage your product inventory and pricing</p>
        </div>

        <AddProducts onAdd={(newProduct) => setProducts(prev => [...prev, newProduct])} />
      </div>

      {/* Flow Layout */}
      {products.length === 0 ? (
        <div className="flex justify-center items-center h-64 w-full">
          <p className="text-lg text-gray-500">You have no listed products yet</p>
        </div>
      ) : (
        <div
          className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-3 
            xl:grid-cols-4 
            gap-5 
            px-3
          "
        >
          {products.map((item) => (
            <ProductCard 
              key={item.id}
              {...item}
            />
          ))}
        </div>
      )}
      
    </section>
  );
}
