"use client";
import { useEffect, useState, useCallback } from "react";
import { AddProducts } from "../_components/list-product";
import { ProductCard } from "../_components/product-card";
import type { Product } from "@/types/products";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/lib/i18n/context";

export default function Products() {
  const { t } = useLanguage();
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

      const res = await fetch("/api/sellers/products", {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error(t("unauthorized-login"));
        }
        throw new Error(t("failed-fetch-products"));
      }

      const data: Product[] = await res.json();
      setProducts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t("unknown-error");
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

  // Auto-refresh products every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchProducts(false); // Silent refresh (no loading spinner)
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchProducts]);

  const handleAddProduct = async (newProduct: Product): Promise<void> => {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const res = await fetch("/api/sellers/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(newProduct),
        });

        const responseData = await res.json().catch(() => ({}));

        if (!res.ok) {
          // Try to get error message from response
          let errorMessage = responseData.error || t("failed-create-product");

          // If it's a connection error (503), retry
          if (res.status === 503 && attempt < maxRetries - 1) {
            const delay = Math.min(200 * Math.pow(2, attempt), 2000);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }

          // For other errors or final attempt, throw
          throw new Error(errorMessage);
        }

        // Success - refresh products list
        // Small delay to ensure database is updated
        await new Promise(resolve => setTimeout(resolve, 200));
        await fetchProducts(false);
        return; // Success, exit retry loop
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(t("failed-create-product"));

        // If it's not a connection error or we've exhausted retries, throw
        if (attempt === maxRetries - 1 || !lastError.message.includes("connection")) {
          throw lastError;
        }
      }
    }

    // Should never reach here, but just in case
    throw lastError || new Error(t("failed-create-product"));
  };

  const handleRemoveProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/products?id=${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || t("failed-remove-product"));
      }

      toast.success(t("product-removed-success"));

      // Small delay to ensure database update is complete
      await new Promise(resolve => setTimeout(resolve, 300));
      await fetchProducts(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t("failed-remove-product");
      toast.error(errorMessage);
    }
  };

  const handleRestoreProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/products?id=${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore" }),
      });

      if (!res.ok) {
        throw new Error(t("failed-restore-product"));
      }

      toast.success(t("product-restored-success"));
      await fetchProducts(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t("failed-restore-product");
      toast.error(errorMessage);
    }
  };

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = async (updatedProduct: Product): Promise<void> => {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const res = await fetch(`/api/sellers/products?id=${updatedProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updatedProduct),
        });

        if (!res.ok) {
          let errorMessage = t("failed-update-product");
          try {
            const errorData = await res.json();
            errorMessage = errorData.error || errorMessage;
          } catch {
            errorMessage = res.statusText || errorMessage;
          }

          if (res.status === 503 && attempt < maxRetries - 1) {
            const delay = Math.min(200 * Math.pow(2, attempt), 2000);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }

          throw new Error(errorMessage);
        }

        await fetchProducts(false);
        setEditingProduct(null);
        return;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(t("failed-update-product"));

        if (attempt === maxRetries - 1 || !lastError.message.includes("connection")) {
          throw lastError;
        }
      }
    }

    throw lastError || new Error(t("failed-update-product"));
  };

  const handleEditComplete = () => {
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <section className="relative min-h-screen min-w-full overflow-hidden space-y-5 px-3">
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
              {t("try-again")}
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
            {t("refresh")}
          </Button>
          <AddProducts
            onAdd={handleAddProduct}
            onUpdate={handleUpdateProduct}
            productToEdit={editingProduct}
            onEditComplete={handleEditComplete}
          />
        </div>
      </div>

      {products.length === 0 && (
        <div className="flex justify-center items-center h-64 w-full">
          <div className="text-center">
            <p className="text-lg text-gray-500 mb-4">{t("you-have-no-products")}</p>
            <AddProducts
              onAdd={handleAddProduct}
              onUpdate={handleUpdateProduct}
              productToEdit={editingProduct}
              onEditComplete={handleEditComplete}
            />
          </div>
        </div>
      )}

      {products.length > 0 && (
        <>
          {/* Active Products (In Stock AND Available) */}
          {products.filter(p => {
            const status = (p.status || "").toString().trim().toLowerCase();
            const isRemoved = status === "removed" || status === "deleted" || status === "draft" || (!p.isAvailable && !status);
            const isOutOfStock = p.stock <= 0;
            return !isRemoved && !isOutOfStock;
          }).length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-[#2E7D32]">{t("active-products")}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {products
                    .filter(p => {
                      const status = (p.status || "").toString().trim().toLowerCase();
                      const isRemoved = status === "removed" || status === "deleted" || status === "draft" || (!p.isAvailable && !status);
                      const isOutOfStock = p.stock <= 0;
                      return !isRemoved && !isOutOfStock;
                    })
                    .map((item) => (
                      <ProductCard
                        key={item.id}
                        product={item}
                        onDelete={handleRemoveProduct}
                        onEdit={handleEditProduct}
                      />
                    ))}
                </div>
              </div>
            )}

          {/* Out of Stock / Removed Products */}
          {(() => {
            const secondaryProducts = products.filter(p => {
              const status = (p.status || "").toString().trim().toLowerCase();
              const isRemoved = status === "removed" || status === "deleted" || status === "draft" || (!p.isAvailable && !status);
              const isOutOfStock = p.stock <= 0;
              return isRemoved || isOutOfStock;
            });

            return secondaryProducts.length > 0 ? (
              <div className="space-y-4 pt-8">
                <h2 className="text-lg font-semibold text-gray-600">Out of Stock / Inactive</h2>
                <p className="text-sm text-muted-foreground">{t("restock-description")}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {secondaryProducts.map((item) => {
                    const status = (item.status || "").toString().trim().toLowerCase();
                    const isRemoved = status === "removed" || status === "deleted" || status === "draft" || (!item.isAvailable && !status);
                    return (
                      <ProductCard
                        key={item.id}
                        product={item}
                        onDelete={handleRemoveProduct}
                        onEdit={handleEditProduct}
                        onRestore={handleRestoreProduct}
                        isRemoved={isRemoved} // Only show restore button if actually removed
                      />
                    );
                  })}
                </div>
              </div>
            ) : null;
          })()}
        </>
      )}
    </section>
  );
}
