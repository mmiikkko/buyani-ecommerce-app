"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Plus,
  Minus,
  ArrowLeft,
  Store,
  Package,
  Star,
  Check,
  AlertCircle,
} from "lucide-react";
import { addToCart } from "@/lib/queries/cart";
import { toast } from "sonner";

interface ProductImage {
  id: string;
  url: string | null;
}

interface Shop {
  id: string;
  name: string | null;
  image: string | null;
  rating: string | null;
}

interface Category {
  id: string;
  name: string | null;
}

interface Product {
  id: string;
  productName: string;
  price: number;
  description: string | null;
  rating: string | null;
  isAvailable: boolean | null;
  status: string | null;
  SKU: string | null;
  createdAt: Date;
  updatedAt: Date;
  stock: number | null;
  itemsSold: number | null;
  images: ProductImage[];
  shop: Shop;
  category: Category;
}

interface RelatedProduct {
  id: string;
  productName: string;
  price: number;
  shopName: string | null;
  image: string | null;
}

interface ProductClientProps {
  product: Product;
  relatedProducts: RelatedProduct[];
  userId?: string;
}

export function ProductClient({
  product,
  relatedProducts,
  userId,
}: ProductClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const router = useRouter();

  const isInStock = (product.stock ?? 0) > 0;
  const maxQuantity = Math.min(product.stock ?? 0, 99);

  const handleAddToCart = async () => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }

    if (!isInStock) {
      toast.error("This product is out of stock");
      return;
    }

    setIsAddingToCart(true);
    try {
      const result = await addToCart(userId, product.id, quantity);
      if (result.success) {
        toast.success(`Added ${quantity} item(s) to cart`);
        router.push("/cart");
      } else {
        toast.error(result.error || "Failed to add to cart");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }

    if (!isInStock) {
      toast.error("This product is out of stock");
      return;
    }

    setIsAddingToCart(true);
    try {
      const result = await addToCart(userId, product.id, quantity);
      if (result.success) {
        router.push("/cart");
      } else {
        toast.error(result.error || "Failed to add to cart");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const primaryImage = product.images[selectedImageIndex]?.url || null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="mb-6 text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100">
            {primaryImage ? (
              <Image
                src={primaryImage}
                alt={product.productName}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <Package className="h-24 w-24" />
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImageIndex === index
                      ? "border-emerald-500 ring-2 ring-emerald-200"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {image.url ? (
                    <Image
                      src={image.url}
                      alt={`${product.productName} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                      <Package className="h-6 w-6" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Category */}
          {product.category.name && (
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-600">
              {product.category.name}
            </p>
          )}

          {/* Product Name */}
          <h1 className="text-3xl font-bold text-slate-900">
            {product.productName}
          </h1>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="font-medium text-slate-900">
                  {product.rating}
                </span>
              </div>
              {product.itemsSold !== null && product.itemsSold > 0 && (
                <span className="text-sm text-slate-500">
                  • {product.itemsSold} sold
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="space-y-1">
            <p className="text-4xl font-bold text-emerald-600">
              ₱{product.price.toFixed(2)}
            </p>
          </div>

          <Separator />

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {isInStock ? (
              <>
                <Check className="h-5 w-5 text-emerald-500" />
                <span className="font-medium text-emerald-600">In Stock</span>
                <span className="text-sm text-slate-500">
                  ({product.stock} available)
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="font-medium text-red-600">Out of Stock</span>
              </>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Quantity
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-lg border">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || !isInStock}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() =>
                    setQuantity((q) => Math.min(maxQuantity, q + 1))
                  }
                  disabled={quantity >= maxQuantity || !isInStock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <p className="text-sm text-slate-500">Total</p>
                <p className="text-xl font-bold text-slate-900">
                  ₱{(product.price * quantity).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart || !isInStock}
              variant="outline"
              size="lg"
              className="flex-1 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              onClick={handleBuyNow}
              disabled={isAddingToCart || !isInStock}
              size="lg"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              Buy Now
            </Button>
          </div>

          <Separator />

          {/* Shop Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-slate-100">
                  {product.shop.image ? (
                    <Image
                      src={product.shop.image}
                      alt={product.shop.name || "Shop"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      <Store className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">
                    {product.shop.name || "Unknown Shop"}
                  </p>
                  {product.shop.rating && (
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{product.shop.rating}</span>
                    </div>
                  )}
                </div>
                <Link href={`/shops/${product.shop.id}`}>
                  <Button variant="outline" size="sm">
                    Visit Shop
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {product.description && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900">
                Description
              </h3>
              <p className="text-slate-600 whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Product Details */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900">
              Product Details
            </h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              {product.SKU && (
                <>
                  <dt className="text-slate-500">SKU</dt>
                  <dd className="text-slate-900">{product.SKU}</dd>
                </>
              )}
              <dt className="text-slate-500">Category</dt>
              <dd className="text-slate-900">
                {product.category.name || "Uncategorized"}
              </dd>
              <dt className="text-slate-500">Status</dt>
              <dd className="text-slate-900">{product.status || "Available"}</dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            Related Products
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                href={`/products/${relatedProduct.id}`}
                className="group block"
              >
                <Card className="overflow-hidden transition-all hover:shadow-lg">
                  <div className="relative aspect-square bg-slate-100">
                    {relatedProduct.image ? (
                      <Image
                        src={relatedProduct.image}
                        alt={relatedProduct.productName}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <Package className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <p className="line-clamp-2 text-sm font-medium text-slate-900">
                      {relatedProduct.productName}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {relatedProduct.shopName}
                    </p>
                    <p className="mt-2 text-lg font-bold text-emerald-600">
                      ₱{relatedProduct.price.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
