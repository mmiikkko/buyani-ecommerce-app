"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { AdminSearchbar } from "./admin-users-searchbar";
import { BadgeAlert, Undo2, Trash2, Check, Eye, Package, Store, Tag, DollarSign, Box, AlertCircle, Sparkles } from "lucide-react";
import { AdminProductModal } from "./admin-product-modal";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// ------------------------------------------------------------
// API PRODUCT TYPE (from /api/products)
// ------------------------------------------------------------
type APIProduct = {
  id: string;
  shopId: string;
  categoryId: string;
  productName: string;
  SKU: string | null;
  description: string | null;
  price: number;
  rating: number | null;
  isAvailable: boolean;
  status: string | null;
  createdAt: string;
  updatedAt: string;
  stock: number;
  itemsSold: number | null;
  shopName: string | null;
  shopStatus: string | null;
  images: Array<{
    id: string;
    product_id: string;
    image_url: string[];
    is_primary: boolean;
  }>;
};

// ------------------------------------------------------------
// DISPLAY PRODUCT TYPE (transformed for UI)
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

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };


  // ------------------------------------------------------------
  // FETCH PRODUCTS (Dynamic)
  // ------------------------------------------------------------
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data: APIProduct[] = await res.json();
      
      // Transform API response to display format
      const transformedProducts: Product[] = data.map((p) => ({
        id: p.id,
        name: p.productName,
        shopOwner: p.shopName || "Unknown Shop",
        description: p.description || "",
        category: p.categoryId || "Uncategorized",
        price: Number(p.price) || 0,
        stock: p.stock || 0,
        dateAdded: p.createdAt,
        status: mapProductStatus(p.status),
        flags: 0,
        reason: undefined,
        image: p.images?.[0]?.image_url?.[0] || "/assets/placeholder.png",
      }));
      
      setProducts(transformedProducts);
    } catch (err) {
      console.error("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  };
  
  // Map API status to display status
  const mapProductStatus = (status: string | null): "normal" | "flagged" | "removed" => {
    if (!status) return "normal";
    const s = status.toLowerCase();
    if (s === "flagged") return "flagged";
    if (s === "removed" || s === "unavailable") return "removed";
    return "normal";
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ------------------------------------------------------------
  // CRUD ACTIONS
  // ------------------------------------------------------------


  const updateProduct = async (id: string, updates: { status?: string; flags?: number }) => {
    // Map display status to API status
    const apiUpdates: Record<string, unknown> = {};
    if (updates.status) {
      if (updates.status === "normal") {
        apiUpdates.status = "Available";
        apiUpdates.isAvailable = true;
      } else if (updates.status === "flagged") {
        apiUpdates.status = "flagged";
      } else if (updates.status === "removed") {
        apiUpdates.status = "removed";
        apiUpdates.isAvailable = false;
      }
    }
    
    await fetch(`/api/products?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(apiUpdates),
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
      else if (filter === "removed") matchesFilter = p.status === "removed";

      return matchesSearch && matchesFilter;
    });
  }, [products, search, filter]);

  // ------------------------------------------------------------
  // STATS CALCULATION
  // ------------------------------------------------------------
  const stats = useMemo(() => {
    const total = products.length;
    const newProducts = products.filter(p => isNewProduct(p.dateAdded)).length;
    const removed = products.filter(p => p.status === "removed").length;
    return { total, newProducts, removed };
  }, [products]);

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="rounded-xl overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-2">
      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Total Products</p>
                <p className="text-xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="p-2 bg-blue-600 rounded-lg">
                <Package className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">New Products</p>
                <p className="text-xl font-bold text-gray-800">{stats.newProducts}</p>
              </div>
              <div className="p-2 bg-emerald-600 rounded-lg">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Removed</p>
                <p className="text-xl font-bold text-gray-800">{stats.removed}</p>
              </div>
              <div className="p-2 bg-red-600 rounded-lg">
                <Trash2 className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">

        {/* SEARCH + FILTER BAR */}
        <AdminSearchbar
          placeholder="Search by product name or shop owner"
          filterOptions={[
            { value: "all", label: "All Products" },
            { value: "new", label: "Newly Added" },
            { value: "removed", label: "Removed" },
          ]}
          onFilterChange={setFilter}
          onSearchChange={setSearch}
        />

        {/* PRODUCT GRID */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed mt-6">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-600 mb-2">No products found</p>
            <p className="text-sm text-gray-500">
              {search ? "Try adjusting your search or filter criteria" : "No products match the selected filter"}
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-start">
            {filteredProducts.map((product) => {
              const isNew = isNewProduct(product.dateAdded);
              const isFlagged = product.status === "flagged";
              const isRemoved = product.status === "removed";
              
              return (
                <Card 
                  key={product.id} 
                  className={`overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 rounded-xl border ${
                    isFlagged 
                      ? "border-red-200 bg-gradient-to-br from-white to-red-50/30" 
                      : isRemoved
                      ? "border-gray-200 bg-gradient-to-br from-white to-gray-50/30 opacity-75"
                      : "border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30"
                  }`}
                >
                  <div className="relative w-full h-40 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className={`object-cover ${isRemoved ? "grayscale opacity-60" : ""}`}
                    />

                    {/* NEW BADGE */}
                    {isNew && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-blue-600 text-white border-0 shadow-md">
                          <Sparkles className="h-3 w-3 mr-1" />
                          New
                        </Badge>
                      </div>
                    )}

                    {/* STATUS BADGES */}
                    {isFlagged && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-red-600 text-white border-0 shadow-md">
                          <BadgeAlert className="h-3 w-3 mr-1" />
                          Flagged
                        </Badge>
                      </div>
                    )}

                    {isRemoved && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-gray-600 text-white border-0 shadow-md">
                          <Trash2 className="h-3 w-3 mr-1" />
                          Removed
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-3">
                    <h3 className="font-bold text-sm text-gray-800 mb-1 line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    
                    {product.description && (
                      <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                        {product.description}
                      </p>
                    )}

                    <div className="space-y-1 mb-2">
                      <div className="flex items-center gap-1.5 text-xs text-gray-700">
                        <Store className="h-3 w-3 text-gray-500" />
                        <span className="truncate font-medium">{product.shopOwner}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Tag className="h-3 w-3 text-gray-500" />
                        <span>{product.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg mb-3">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-emerald-600" />
                        <span className="text-sm font-bold text-emerald-600">₱{product.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Box className="h-3 w-3 text-gray-500" />
                        <span className="text-xs font-medium text-gray-700">
                          {product.stock}
                        </span>
                      </div>
                    </div>

                    {/* FLAG REASON */}
                    {isFlagged && product.reason && (
                      <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-2 rounded-lg mb-2">
                        <div className="flex items-start gap-1.5">
                          <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-semibold">Flag:</span> {product.reason}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ACTION BUTTONS */}
                    <div className="space-y-1.5">
                      {isFlagged && (
                        <>
                          <Button
                            size="sm"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer text-xs h-8 shadow-sm hover:shadow-md transition-shadow"
                            onClick={async () => {
                              await updateProduct(product.id, { status: "normal", flags: 0 });
                              toast.success(`"${product.name}" marked as safe`);
                            }}
                          >
                            <Check className="w-3 h-3 mr-1.5" />
                            Mark Safe
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            className="w-full cursor-pointer text-xs h-8 shadow-sm hover:shadow-md transition-shadow"
                            onClick={async () => {
                              await updateProduct(product.id, { status: "removed" });
                              toast.success(`"${product.name}" is removed`);
                            }}
                          >
                            <Trash2 className="w-3 h-3 mr-1.5" />
                            Remove
                          </Button>
                        </>
                      )}

                      {isRemoved && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 cursor-pointer text-xs h-8"
                          onClick={async () => {
                            await updateProduct(product.id, { status: "normal" });
                            toast.success(`"${product.name}" is restored`);
                          }}
                        >
                          <Undo2 className="w-3 h-3 mr-1.5" />
                          Restore
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-gray-300 hover:bg-gray-50 cursor-pointer text-xs h-8"
                        onClick={() => openModal(product)}
                      >
                        <Eye className="w-3 h-3 mr-1.5" />
                        Details
                      </Button>

                      {/* Delete button (always available) */}
                      <Button
                        size="sm"
                        variant="destructive"
                        className="w-full cursor-pointer text-xs h-8 shadow-sm hover:shadow-md transition-shadow"
                        onClick={async () => {
                          if (confirm(`Are you sure you want to permanently delete "${product.name}"?`)) {
                            await deleteProduct(product.id);
                            toast.success(`"${product.name}" is permanently deleted`);
                          }
                        }}
                      >
                        <Trash2 className="w-3 h-3 mr-1.5" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

      </div>

      <AdminProductModal 
        open={isModalOpen} 
        onClose={closeModal} 
        product={selectedProduct}
      />
    </div>
  );
}
