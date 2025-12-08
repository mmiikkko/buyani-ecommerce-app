"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import type { Product } from "@/types/products";

type POSProduct = {
  id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
};

interface CardsPosProdProps {
  onAddToCart: (product: POSProduct) => void;
}

export function CardsPosProd({ onAddToCart }: CardsPosProdProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch("/api/sellers/products");
        if (res.ok) {
          const data: Product[] = await res.json();
          // Filter only available products
          setProducts(data.filter(p => p.isAvailable && (p.stock || 0) > 0));
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.productName.toLowerCase().includes(query) ||
        p.SKU?.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const getImageUrl = (product: Product): string => {
    if (!product.images || product.images.length === 0) return "";
    const firstImage = product.images[0];
    if (!firstImage?.image_url) return "";
    
    if (Array.isArray(firstImage.image_url)) {
      return firstImage.image_url[0] || "";
    }
    return typeof firstImage.image_url === "string" ? firstImage.image_url : "";
  };

  const handleAddToCart = (product: Product) => {
    if ((product.stock || 0) <= 0) {
      return;
    }
    
    onAddToCart({
      id: product.id,
      name: product.productName,
      price: product.price || 0,
      stock: product.stock || 0,
      image: getImageUrl(product),
    });
  };

  return (
    <Card className="flex flex-col w-full border-1 shadow-md">
      <CardHeader className="pb-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchInput
            placeholder="Search products..."
            className="bg-[#f3f3f5]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>

      <CardContent className="min-h-[200px] max-h-[600px] overflow-y-auto">
        {loading ? (
          <p className="text-gray-500 text-center py-8">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {searchQuery ? "No products found." : "You have no listed products yet."}
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              const imageUrl = getImageUrl(product);
              const isOutOfStock = (product.stock || 0) <= 0;
              
              return (
                <div
                  key={product.id}
                  className={`border rounded-lg p-3 hover:shadow-md transition-shadow ${
                    isOutOfStock ? "opacity-50" : ""
                  }`}
                >
                  <div className="relative w-full h-32 mb-2 bg-gray-100 rounded overflow-hidden">
                    {imageUrl ? (
                      imageUrl.startsWith("data:image/") ? (
                        <img
                          src={imageUrl}
                          alt={product.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src={imageUrl}
                          alt={product.productName}
                          width={150}
                          height={128}
                          className="w-full h-full object-cover"
                          unoptimized={true}
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-sm mb-1 line-clamp-2">
                    {product.productName}
                  </h3>
                  <p className="text-green-700 font-bold text-sm mb-1">
                    ₱{product.price?.toFixed(2) || "0.00"}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    Stock: {product.stock || 0}
                  </p>
                  <Button
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => handleAddToCart(product)}
                    disabled={isOutOfStock}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
