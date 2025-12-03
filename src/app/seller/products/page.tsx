"use client";
import { useEffect, useState, useCallback } from "react";
import { AddProducts } from "../_components/list-product";
import { ProductCard } from "../_components/product-card";
import type { Product } from "@/types/products";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API
  const fetchProducts = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setError(null);
      
      const res = await fetch("/api/sellers/products");
      
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized. Please log in.");
        }
        throw new Error("Failed to fetch products");
      }
      
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      if (showLoading) {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(true);
  }, [fetchProducts]);

  const handleAddProduct = async (newProduct: Product) => {
    try {
      const res = await fetch("/api/sellers/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (!res.ok) {
        throw new Error("Failed to create product");
      }

      toast.success("Product created successfully");
      await fetchProducts(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create product";
      toast.error(errorMessage);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const res = await fetch(`/api/products?id=${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      toast.success("Product deleted successfully");
      await fetchProducts(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete product";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <section className="relative min-h-screen min-w-full overflow-hidden space-y-5 mt-18 px-3">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-[#2E7D32]">Products Listing</h1>
            <p>Manage your product inventory and pricing</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pt-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-full max-w-sm shadow-md rounded-lg space-y-4 overflow-hidden bg-white p-4">
              <Skeleton className="w-full h-40" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative min-h-screen min-w-full overflow-hidden space-y-5 mt-18 px-3">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-[#2E7D32]">Products Listing</h1>
            <p>Manage your product inventory and pricing</p>
          </div>
        </div>
        <div className="flex justify-center items-center h-64 w-full">
          <div className="text-center">
            <p className="text-lg text-red-500 mb-2">{error}</p>
            <button
              onClick={() => fetchProducts(true)}
              className="text-sm text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen min-w-full overflow-hidden space-y-5 mt-18 px-3">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-[#2E7D32]">Products Listing</h1>
          <p>Manage your product inventory and pricing</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchProducts(false)}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <AddProducts onAdd={handleAddProduct} />
        </div>
      </div>

      {products.length === 0 && (
        <div className="flex justify-center items-center h-64 w-full">
          <div className="text-center">
            <p className="text-lg text-gray-500 mb-4">You have no listed products yet</p>
            <AddProducts onAdd={handleAddProduct} />
          </div>
        </div>
      )}

      {products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pt-8">
          {products.map((item) => (
            <ProductCard 
              key={item.id} 
              product={item} 
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}
    </section>
  );
}
