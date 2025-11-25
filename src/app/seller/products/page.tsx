"use client";
import { useEffect, useState } from "react";
import { AddProducts } from "../_components/list-product";
import { ProductCard } from "../_components/product-card";
import type { Product } from "@/types/products";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sellerId = "SELLER_ID_HERE";

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products?sellerId=${sellerId}`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [sellerId]);

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  return (
    <section className="relative min-h-screen min-w-full overflow-hidden space-y-5 mt-18 px-3">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-[#2E7D32]">Products Listing</h1>
          <p>Manage your product inventory and pricing</p>
        </div>

        <AddProducts onAdd={handleAddProduct} />
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64 w-full">
          <p className="text-lg text-gray-500">Loading products...</p>
        </div>
      )}

      {error && (
        <div className="flex justify-center items-center h-64 w-full">
          <p className="text-lg text-red-500">{error}</p>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="flex justify-center items-center h-64 w-full">
          <p className="text-lg text-gray-500">You have no listed products yet</p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pt-8">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </section>
  );
}
