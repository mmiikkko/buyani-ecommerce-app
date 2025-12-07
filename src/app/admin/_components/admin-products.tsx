"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { AdminSearchbar } from "./admin-users-searchbar";
import { BadgeAlert, Undo2, Trash2, Check } from "lucide-react";

// ------------------------------------------------------------
// PRODUCT TYPE
// ------------------------------------------------------------
type Product = {
  id: string;
  name: string;
  shopOwner: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  dateAdded: string;
  status: "normal" | "flagged" | "removed";
  flags?: number;
  reason?: string;
  image: string;
};

// ------------------------------------------------------------
// MAIN COMPONENT
// ------------------------------------------------------------
export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // ------------------------------------------------------------
  // FETCH PRODUCTS (Dynamic)
  // ------------------------------------------------------------
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ------------------------------------------------------------
  // CRUD ACTIONS
  // ------------------------------------------------------------

  const createProduct = async (data: unknown) => {
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchProducts();
  };

  const updateProduct = async (id: string, updates: unknown) => {
    await fetch(`/api/products?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    fetchProducts();
  };

  // ------------------------------------------------------------
  // "NEW PRODUCT" CHECK
  // ------------------------------------------------------------
  const NEW_PRODUCT_DAYS = 7;
  const today = new Date();

  const isNewProduct = (dateAdded: string) => {
    const diff =
      (today.getTime() - new Date(dateAdded).getTime()) /
      (1000 * 60 * 60 * 24);
    return diff <= NEW_PRODUCT_DAYS;
  };

  // ------------------------------------------------------------
  // FILTERING + SEARCH
  // ------------------------------------------------------------
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.shopOwner.toLowerCase().includes(search.toLowerCase());

      let matchesFilter = true;

      if (filter === "new") matchesFilter = isNewProduct(p.dateAdded);
      else if (filter === "flagged") matchesFilter = p.status === "flagged";
      else if (filter === "removed") matchesFilter = p.status === "removed";

      return matchesSearch && matchesFilter;
    });
  }, [filter, search, products]);

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  if (loading) return <p className="p-4">Loading products...</p>;

  return (
    <div className="px-5 w-full min-h-screen bg-green-50 rounded-xl pb-10">

      {/* SEARCH + FILTER BAR */}
      <AdminSearchbar
        placeholder="Search by product name or shop owner"
        filterOptions={[
          { value: "all", label: "All Products" },
          { value: "new", label: "Newly Added" },
          { value: "flagged", label: "Flagged" },
          { value: "removed", label: "Removed" },
        ]}
        onFilterChange={setFilter}
        onSearchChange={setSearch}
      />

      {/* PRODUCT GRID */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden shadow-sm">
            <div className="relative w-full h-48">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />

              {/* NEW BADGE */}
              {isNewProduct(product.dateAdded) && (
                <span className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 text-xs rounded-full">
                  New
                </span>
              )}

              {/* FLAGGED BADGE */}
              {product.status === "flagged" && (
                <span className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 text-xs rounded-full flex items-center gap-1">
                  <BadgeAlert className="w-3 h-3" />
                  {product.flags} Reports
                </span>
              )}
            </div>

            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.description}</p>

              <div className="mt-3 text-sm">
                <p className="font-medium">{product.shopOwner}</p>
                <p className="text-gray-600">Category: {product.category}</p>
              </div>

              <div className="flex justify-between mt-3 text-sm font-medium">
                <span>₱{product.price}</span>
                <span>Stock: {product.stock}</span>
              </div>

              <p className="text-xs mt-2 text-gray-500">
                Added: {product.dateAdded}
              </p>

              {/* FLAG REASON */}
              {product.status === "flagged" && product.reason && (
                <div className="bg-red-100 text-red-700 text-sm p-2 rounded-md mt-3">
                  <span className="font-medium">Reason:</span> {product.reason}
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="mt-4 flex flex-col gap-2">
                {product.status === "flagged" && (
                  <>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 cursor-pointer"
                      onClick={() =>
                        updateProduct(product.id, { status: "normal", flags: 0 })
                      }
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Mark as Safe
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      className="cursor-pointer"
                      onClick={() =>
                        updateProduct(product.id, { status: "removed" })
                      }
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove Product
                    </Button>
                  </>
                )}

                {product.status === "removed" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateProduct(product.id, { status: "normal" })
                    }
                  >
                    <Undo2 className="w-4 h-4 mr-1" />
                    Restore Product
                  </Button>
                )}
              </div>

              <Button
                variant="link"
                className="mt-2 w-full text-gray-600 cursor-pointer"
              >
                View Full Details
              </Button>

              {/* Delete button (always available) */}
              <Button
                className="w-full mt-2 bg-red-600 text-white cursor-pointer"
                onClick={() => deleteProduct(product.id)}
              >
                Delete Permanently
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
