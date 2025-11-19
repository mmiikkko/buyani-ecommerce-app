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
    <section className="relative min-h-screen min-w-full overflow-hidden space-y-5 mt-18 ">
      <div className="flex flex-row justify-between items-center px-3">
        <h1 className="text-xl font-bold text-[#2E7D32]">Products</h1>
        <AddProducts onAdd={(newProduct) => setProducts(prev => [...prev, newProduct])}/>
      </div>
       {/* Flow Layout */}
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
    </section>
  )
}
