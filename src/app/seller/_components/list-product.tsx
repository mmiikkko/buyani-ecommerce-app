"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { v4 as uuidv4 } from "uuid";
import type { Product } from "@/types/products";
import { toast } from "sonner";

interface AddProductsProps {
  onAdd: (product: Product) => Promise<void>;
  onUpdate?: (product: Product) => Promise<void>;
  productToEdit?: Product | null;
  onEditComplete?: () => void;
}

export function AddProducts({ onAdd, onUpdate, productToEdit, onEditComplete }: AddProductsProps) {
  const [categories, setCategories] = useState<{ id: string; categoryName: string }[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // BASIC
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // IMAGES - start with empty array
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // CATEGORY
  const [categoryId, setCategoryId] = useState<string>("");

  // PRICING & STOCK (simple version)
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [status, setStatus] = useState("Available");

  // SHIPPING
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [lengthVal, setLengthVal] = useState("");
  const [widthVal, setWidthVal] = useState("");
  const [heightVal, setHeightVal] = useState("");
  const [shippingFee, setShippingFee] = useState("");

  // ERROR
  const [error, setError] = useState("");

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoadingCategories(true);
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
          if (data.length > 0 && !productToEdit) setCategoryId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, [productToEdit]);

  // Load product data when editing
  useEffect(() => {
    if (productToEdit) {
      setIsEditing(true);
      setIsDialogOpen(true);
      setName(productToEdit.productName || "");
      setDescription(productToEdit.description || "");
      setCategoryId(productToEdit.categoryId || "");
      setPrice(productToEdit.price?.toString() || "");
      setStock(productToEdit.stock?.toString() || "");
      setStatus(productToEdit.status || "Available");
      
      // Load images
      if (productToEdit.images && productToEdit.images.length > 0) {
        const imageUrls = productToEdit.images
          .map(img => {
            if (typeof img.image_url === "string") {
              return img.image_url;
            }
            //if (Array.isArray(img.image_url) && img.image_url.length > 0) {
              //return img.image_url[0];
            //}
            return null;
          })
          .filter((url): url is string => url !== null && url !== "" && url.startsWith("data:image/"));
        setImagePreviews(imageUrls);
      } else {
        setImagePreviews([]);
      }

      // Load shipping info
      if (productToEdit.shipping) {
        setWeight(productToEdit.shipping.weight?.toString() || "");
        setWeightUnit(productToEdit.shipping.weightUnit || "kg");
        setLengthVal(productToEdit.shipping.length?.toString() || "");
        setWidthVal(productToEdit.shipping.width?.toString() || "");
        setHeightVal(productToEdit.shipping.height?.toString() || "");
        setShippingFee(productToEdit.shipping.shippingFee?.toString() || "");
      }
    } else {
      if (isEditing) {
        // Only reset if we were editing and productToEdit is now null
        setIsEditing(false);
      }
    }
  }, [productToEdit, isEditing]);

  /* --- Submit --- */
  const handleSubmit = async (isDraft: boolean = false) => {
    if (isSubmitting) return;

    if (!name.trim()) {
      setError("Product name is required.");
      toast.error("Product name is required.");
      return;
    }
    if (!categoryId) {
      setError("Please select a category.");
      toast.error("Please select a category.");
      return;
    }
    if (!price.trim() || Number(price) <= 0) {
      setError("Enter a valid price.");
      toast.error("Enter a valid price.");
      return;
    }
    if (!stock.trim() || Number(stock) < 0) {
      setError("Enter valid stock quantity.");
      toast.error("Enter valid stock quantity.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const productId = isEditing && productToEdit ? productToEdit.id : uuidv4();
      // Generate unique SKU: first 6 chars of name + timestamp + random chars
      const nameBase = (name || "PRD").replace(/\s+/g, "").toUpperCase().slice(0, 6);
      const timestamp = Date.now().toString(36).slice(-4).toUpperCase();
      const random = Math.random().toString(36).slice(-2).toUpperCase();
      const skuBase = `${nameBase}${timestamp}${random}`;

      // SANITIZE image previews before sending:
      // - Only keep data:image/ URLs (base64 encoded images from FileReader)
      // - Filter out placeholder images, empty strings, and invalid formats
      console.log(`[DEBUG] Starting image sanitization. imagePreviews.length: ${imagePreviews.length}`);
      imagePreviews.forEach((img, idx) => {
        console.log(`[DEBUG] Preview ${idx + 1}: type=${typeof img}, length=${img?.length || 0}, startsWith data:image/=${img?.startsWith("data:image/")}`);
      });
      
      const sanitizedImages = imagePreviews
        .filter(img => {
          // Only keep valid data URLs
          const isValid = img && 
                 typeof img === "string" && 
                 img.trim() !== "" &&
                 img !== "/placeholder.png" &&
                 img.startsWith("data:image/");
          if (!isValid && img) {
            console.log(`[DEBUG] Filtered out image: type=${typeof img}, startsWith=${img.substring(0, 20)}...`);
          }
          return isValid;
        })
        .map((img, idx) => ({
          id: uuidv4(),
          product_id: productId,
          image_url: img, // Already validated as data:image/ URL
          is_primary: idx === 0,
        }));
      
      console.log(`[DEBUG] Sanitized ${sanitizedImages.length} images for product ${productId}`);
      if (sanitizedImages.length > 0) {
        console.log(`[DEBUG] First image URL length: ${sanitizedImages[0].image_url.length}, preview: ${sanitizedImages[0].image_url.substring(0, 50)}...`);
      }

      const productStatus = isDraft ? "Draft" : status;
      const product: Product = {
        id: productId,
        productName: name,
        description,
        price: Number(price),
        stock: Number(stock),
        images: sanitizedImages,
        categoryId,
        SKU: skuBase,
        shipping: {
          weight: weight ? Number(weight) : undefined,
          weightUnit,
          length: lengthVal ? Number(lengthVal) : undefined,
          width: widthVal ? Number(widthVal) : undefined,
          height: heightVal ? Number(heightVal) : undefined,
          shippingFee: shippingFee ? Number(shippingFee) : undefined,
        },
        status: productStatus,
        shopId: "",
        isAvailable: productStatus === "Available",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const wasEditing = isEditing;
      
      if (isEditing && onUpdate) {
        await onUpdate(product);
        // Close dialog immediately when updating
        setIsDialogOpen(false);
        toast.success(`${name} is updated`);
      } else {
        await onAdd(product);
        // Show success message
        if (isDraft) {
          toast.success("Product saved as draft successfully!");
        } else {
          // Close dialog immediately when publishing
          setIsDialogOpen(false);
          toast.success(`${name} is posted`);
        }
      }

      // RESET
      setName("");
      setDescription("");
      setImagePreviews([]);
      if (categories.length > 0) setCategoryId(categories[0].id);
      setPrice("");
      setStock("");
      setWeight("");
      setWeightUnit("kg");
      setLengthVal("");
      setWidthVal("");
      setHeightVal("");
      setShippingFee("");
      setIsEditing(false);
      
      // Notify parent that edit is complete
      if (wasEditing && onEditComplete) {
        onEditComplete();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save product. Please try again.";
      
      // Don't show error for connection issues that were already retried
      if (!errorMessage.includes("connection") && !errorMessage.includes("Database")) {
        toast.error(errorMessage);
      } else {
        toast.error("Unable to save product due to connection issues. Please check your connection and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when dialog closes
  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // Reset form when closing
      if (!isEditing) {
        setName("");
        setDescription("");
        setImagePreviews([]);
        if (categories.length > 0) setCategoryId(categories[0].id);
        setPrice("");
        setStock("");
        setWeight("");
        setWeightUnit("kg");
        setLengthVal("");
        setWidthVal("");
        setHeightVal("");
        setShippingFee("");
        setError("");
      }
      if (isEditing && onEditComplete) {
        setIsEditing(false);
        onEditComplete();
      }
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-md hover:bg-[#27632a] cursor-pointer">
          + Add Product
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[950px] max-h-[750px] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#2E7D32] text-xl font-bold">
            {isEditing ? "Edit Product" : "Products Information"}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full mt-4">
          <TabsList className="flex space-x-2 bg-transparent">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="images">Product Images</TabsTrigger>
            <TabsTrigger value="category">Category</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="shipping">Shipping Info</TabsTrigger>
          </TabsList>

          {/* BASIC */}
          <TabsContent value="basic" className="mt-4 space-y-4">
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-md px-3 py-2" />
            <textarea placeholder="Product Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded-md px-3 py-2 min-h-[100px]" />
            <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full border rounded-md px-3 py-2" />
          </TabsContent>

          {/* IMAGES */}
          <TabsContent value="images" className="mt-4">
            <div className="border p-4 rounded-md space-y-3">
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  if (!files) return;

                  const currentCount = imagePreviews.filter(img => img && img !== "/placeholder.png" && img.startsWith("data:image/")).length;
                  const filesToAdd = Array.from(files);
                  const totalAfterAdd = currentCount + filesToAdd.length;

                  if (totalAfterAdd > 10) {
                    setError(`Maximum 10 images allowed. You currently have ${currentCount} image(s) and tried to add ${filesToAdd.length} more.`);
                    return;
                  }

                  filesToAdd.forEach((file) => {
                    // Optional size limit (recommended)
                    if (file.size > 2 * 1024 * 1024) {
                      setError("Each image must be under 2MB");
                      return;
                    }

                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64 = reader.result as string;
                      setImagePreviews((prev) => {
                        const filtered = prev.filter(img => img && img !== "/placeholder.png" && img.startsWith("data:image/"));
                        if (filtered.length >= 10) {
                          setError("Maximum 10 images allowed");
                          return prev;
                        }
                        return [...prev, base64];
                      });
                    };
                    reader.readAsDataURL(file);
                  });
                }}
              />
              <p className="text-xs text-gray-500">
                You can upload up to 10 images. Currently: {imagePreviews.filter(img => img && img !== "/placeholder.png" && img.startsWith("data:image/")).length}/10
              </p>
            </div>
              <div className="mt-3 grid grid-cols-4 gap-3">
                {imagePreviews
                  .filter(img => img && img !== "/placeholder.png" && img.startsWith("data:image/"))
                  .map((src, idx) => (
                    <div key={idx} className="relative border rounded-md overflow-hidden">
                      <Image 
                        src={src} 
                        alt={name ? `${name} - Image ${idx + 1}` : `Product image ${idx + 1}`} 
                        width={200} 
                        height={200} 
                        className="object-cover"
                        unoptimized={true}
                      />
                      <button 
                        onClick={() => setImagePreviews(prev => prev.filter((_, i) => i !== idx))} 
                        className="absolute top-1 right-1 bg-black/50 text-white text-xs px-2 py-1 rounded" 
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
              </div>
              {imagePreviews.filter(img => img && img !== "/placeholder.png" && img.startsWith("data:image/")).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No images uploaded yet. Select images above to add them.</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Note: local previews (blob:) are shown for preview only — uploading images to a CDN/storage is required for permanent product images.
              </p>
            </div>
          </TabsContent>

          {/* CATEGORY */}
          <TabsContent value="category" className="mt-4">
            <div className="border p-4 rounded-md">
              <label className="block text-sm font-medium mb-2">Select Category</label>
              {loadingCategories ? (
                <p className="text-sm text-gray-500">Loading categories...</p>
              ) : (
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full border rounded-md px-3 py-2">
                  {categories?.map(cat => <option key={cat.id} value={cat.id}>{cat.categoryName}</option>)}
                </select>
              )}
            </div>
          </TabsContent>

          {/* PRICING */}
          <TabsContent value="pricing" className="mt-4">
            <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border rounded-md px-3 py-2" />
            <label className="block text-sm mt-2">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border rounded px-3 py-2">
              <option>Available</option>
              <option>Draft</option>
              <option>Out of stock</option>
              <option>Discontinued</option>
            </select>
          </TabsContent>

          {/* SHIPPING */}
          <TabsContent value="shipping" className="mt-4">
            <div className="grid grid-cols-3 gap-3">
              <input type="number" placeholder="Weight" value={weight} onChange={(e) => setWeight(e.target.value)} className="border rounded px-2 py-1" />
              <select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)} className="border rounded px-2 py-1">
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="lb">lb</option>
              </select>
              <input type="number" placeholder="Shipping Fee" value={shippingFee} onChange={(e) => setShippingFee(e.target.value)} className="border rounded px-2 py-1" />

              <input type="number" placeholder="Length (cm)" value={lengthVal} onChange={(e) => setLengthVal(e.target.value)} className="border rounded px-2 py-1" />
              <input type="number" placeholder="Width (cm)" value={widthVal} onChange={(e) => setWidthVal(e.target.value)} className="border rounded px-2 py-1" />
              <input type="number" placeholder="Height (cm)" value={heightVal} onChange={(e) => setHeightVal(e.target.value)} className="border rounded px-2 py-1" />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6">
          {!isEditing && (
            <button 
              onClick={() => handleSubmit(true)} 
              disabled={isSubmitting}
              className="px-5 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save as Draft"}
            </button>
          )}
          <button 
            onClick={() => handleSubmit(false)} 
            disabled={isSubmitting}
            className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (isEditing ? "Updating..." : "Publishing...") : (isEditing ? "Update Product" : "Save and Publish")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
