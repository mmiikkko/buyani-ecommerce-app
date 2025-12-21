"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { v4 as uuidv4 } from "uuid";
import type { Product, VariationOption, ProductVariation } from "@/types/products";
import { toast } from "sonner";
import { Plus, X, Trash2, Upload } from "lucide-react";

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

  // ✅ NEW: Upload state
  const [uploadingImages, setUploadingImages] = useState(false);

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

  // VARIATIONS
  const [variations, setVariations] = useState<any[]>([]);
  const [matrix, setMatrix] = useState<any[]>([]);
  const [newVarName, setNewVarName] = useState("");
  const [newVarValue, setNewVarValue] = useState("");
  const [activeVarIndex, setActiveVarIndex] = useState<number | null>(null);

  // ERROR
  const [error, setError] = useState("");

  // ✅ HELPER: Check if image URL is valid (Cloudinary or base64)
  const isValidImageUrl = (url: string): boolean => {
    if (!url || typeof url !== "string" || url.trim() === "") return false;
    return url.startsWith("https://res.cloudinary.com/") || url.startsWith("data:image/");
  };

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
            return null;
          })
          .filter((url): url is string => url !== null && isValidImageUrl(url));
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
  
      // Load variations and matrix
      const productVariations = productToEdit.variations || [];
      setVariations(productVariations);
  
      // Check if it's a "Standard" variation (Simple Product)
      const hasVariations = productVariations.length > 0;
      
      // ✅ FIXED: Use type assertion to safely check properties
      const firstVariation = hasVariations ? productVariations[0] : null;
      const isStandard = firstVariation && (
        (firstVariation as any).name === "Standard" ||
        (firstVariation as any).isStandard === true ||
        (firstVariation as any).value === "Standard" ||
        (firstVariation as any).variationValue === "Standard"
      );
  
      if (hasVariations && !isStandard) {
        // It's a real matrix product - map with type safety
        setMatrix(productVariations.map((v: any) => ({
          id: v.id,
          name: v.name || v.variationName || "Unnamed",
          value: v.value || v.variationValue || "",
          price: v.price?.toString() || "",
          stock: v.stock?.toString() || v.quantityInStock?.toString() || "",
          sku: v.sku || v.SKU || "",
        })));
      } else {
        // Simple product or empty - ensure matrix is empty
        setMatrix([]);
      }
    } else {
      if (isEditing) {
        setIsEditing(false);
      }
    }
  }, [productToEdit, isEditing]);

  // Price display state for range
  const [priceRange, setPriceRange] = useState("");

  // Auto-calculate total stock and base price from matrix/variations
  useEffect(() => {
    if (matrix.length > 0) {
      const totalStock = matrix.reduce((sum, item) => sum + (Number(item.stock) || 0), 0);
      setStock(totalStock.toString());

      const prices = matrix.map(m => Number(m.price)).filter(p => !isNaN(p) && p > 0);
      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPrice(minPrice.toString());

        if (minPrice === maxPrice) {
          setPriceRange(minPrice.toString());
        } else {
          setPriceRange(`${minPrice} - ${maxPrice}`);
        }
      }
    } else {
      setPriceRange("");
    }
  }, [matrix]);

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
      const nameBase = (name || "PRD").replace(/\s+/g, "").toUpperCase().slice(0, 6);
      const timestamp = Date.now().toString(36).slice(-4).toUpperCase();
      const random = Math.random().toString(36).slice(-2).toUpperCase();
      const skuBase = `${nameBase}${timestamp}${random}`;

      // ✅ UPDATED: Accept both Cloudinary URLs and base64
      const sanitizedImages = imagePreviews
        .filter(img => isValidImageUrl(img))
        .map((img, idx) => ({
          id: uuidv4(),
          product_id: productId,
          image_url: img,
          is_primary: idx === 0,
        }));

      console.log(`[DEBUG] Sanitized ${sanitizedImages.length} images for product ${productId}`);

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
        variations: matrix.length > 0 ? matrix : [],
      };

      const wasEditing = isEditing;

      if (isEditing && onUpdate) {
        await onUpdate(product);
        setIsDialogOpen(false);
        toast.success(`${name} is updated`);
      } else {
        await onAdd(product);
        if (isDraft) {
          toast.success("Product saved as draft successfully!");
        } else {
          setIsDialogOpen(false);
          toast.success(`${name} is posted`);
        }
      }

      // RESET - Only if NOT saving as draft
      if (!isDraft) {
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
        setVariations([]);
        setMatrix([]);
        setNewVarName("");
        setNewVarValue("");
        setIsEditing(false);
      }

      if (wasEditing && onEditComplete) {
        onEditComplete();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save product. Please try again.";

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
        setVariations([]);
        setMatrix([]);
        setError("");
      }
      if (isEditing && onEditComplete) {
        setIsEditing(false);
        onEditComplete();
      }
    }
  };

  // ✅ NEW: Handle image upload to Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const currentCount = imagePreviews.filter(img => isValidImageUrl(img)).length;
    const filesToAdd = Array.from(files);
    const totalAfterAdd = currentCount + filesToAdd.length;

    if (totalAfterAdd > 10) {
      setError(`Maximum 10 images allowed. You currently have ${currentCount} image(s) and tried to add ${filesToAdd.length} more.`);
      return;
    }

    // Check file sizes (10MB limit for Cloudinary)
    for (const file of filesToAdd) {
      if (file.size > 10 * 1024 * 1024) {
        setError("Each image must be under 10MB");
        return;
      }
    }

    setUploadingImages(true);
    setError("");

    try {
      // Create FormData
      const formData = new FormData();
      filesToAdd.forEach(file => {
        formData.append('images', file);
      });

      // Upload to Cloudinary via API
      const response = await fetch('/api/sellers/upload-images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const { images } = await response.json();
      
      // Add Cloudinary URLs to previews
      setImagePreviews(prev => [
        ...prev,
        ...images.map((img: any) => img.url)
      ]);

      toast.success(`${images.length} image(s) uploaded successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload images');
      toast.error('Failed to upload images. Please try again.');
    } finally {
      setUploadingImages(false);
      // Clear the input
      e.target.value = '';
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
            <TabsTrigger value="variations">Variations</TabsTrigger>
            <TabsTrigger value="category">Category</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="shipping">Shipping Info</TabsTrigger>
          </TabsList>

          {/* BASIC */}
          <TabsContent value="basic" className="mt-4 space-y-4">
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Product Name *</label>
              <input type="text" placeholder="Enter product name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-md px-3 py-2" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Product Description</label>
              <textarea placeholder="Enter product description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded-md px-3 py-2 min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Stock Quantity *</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Enter stock quantity"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  disabled={matrix.length > 0}
                  className={`w-full border rounded-md px-3 py-2 ${matrix.length > 0 ? "bg-gray-50 text-gray-500 cursor-not-allowed font-bold" : ""}`}
                />
                {matrix.length > 0 && (
                  <p className="text-[10px] text-[#2E7D32] font-bold mt-1 animate-pulse">
                    Auto-calculated from variations total
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* IMAGES - ✅ UPDATED */}
          <TabsContent value="images" className="mt-4">
            <div className="border p-4 rounded-md space-y-3">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={uploadingImages}
                    onChange={handleImageUpload}
                    className={`w-full ${uploadingImages ? "opacity-50 cursor-not-allowed" : ""}`}
                  />
                  {uploadingImages && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded">
                      <div className="flex items-center gap-2 text-[#2E7D32] font-medium">
                        <Upload className="h-5 w-5 animate-bounce" />
                        <span>Uploading to cloud storage...</span>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  You can upload up to 10 images (max 10MB each). Currently: {imagePreviews.filter(img => isValidImageUrl(img)).length}/10
                </p>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-3">
                {imagePreviews
                  .filter(img => isValidImageUrl(img))
                  .map((src, idx) => (
                    <div key={idx} className="relative border rounded-md overflow-hidden group">
                      <Image
                        src={src}
                        alt={name ? `${name} - Image ${idx + 1}` : `Product image ${idx + 1}`}
                        width={200}
                        height={200}
                        className="object-cover"
                        unoptimized={src.startsWith("data:image/")}
                      />
                      <button
                        onClick={() => setImagePreviews(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        type="button"
                      >
                        Remove
                      </button>
                      {src.startsWith("https://res.cloudinary.com/") && (
                        <div className="absolute bottom-1 left-1 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                          ☁️ Cloud
                        </div>
                      )}
                    </div>
                  ))}
              </div>
              {imagePreviews.filter(img => isValidImageUrl(img)).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No images uploaded yet. Select images above to add them.</p>
              )}
            </div>
          </TabsContent>

          {/* VARIATIONS */}
          <TabsContent value="variations" className="mt-4 space-y-4">
            <div className="border p-6 rounded-xl space-y-6 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#2E7D32]">Product Variations</h3>
                  <p className="text-xs text-gray-500">Add specific variations (e.g. "Red Large", "Blue Medium") with their own stock levels.</p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => {
                      setMatrix([...matrix, {
                        name: "New Variation",
                        value: JSON.stringify({ "Variation": "New Variation" }),
                        price: price || "0",
                        stock: "0",
                        sku: ""
                      }]);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-[#27632a] transition-all active:scale-95 shadow-md shadow-emerald-500/20"
                    type="button"
                  >
                    <Plus className="h-4 w-4" />
                    Add Variation
                  </button>
                )}
              </div>

              {isEditing && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm flex items-center gap-3">
                  <span className="text-xl">⚠️</span>
                  <p><strong>Note:</strong> Product variations are locked after creation to protect order history. To change them, please list a new product.</p>
                </div>
              )}

              <div className="space-y-4">
                {matrix.map((item, idx) => (
                  <div key={idx} className="group relative border rounded-2xl p-4 bg-slate-50 transition-all hover:bg-white hover:shadow-lg hover:border-emerald-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2 md:col-span-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Variation Name</label>
                        <input
                          type="text"
                          value={item.name}
                          disabled={isEditing}
                          placeholder="e.g. Red Small"
                          onChange={(e) => {
                            const newMatrix = [...matrix];
                            newMatrix[idx].name = e.target.value;
                            newMatrix[idx].value = JSON.stringify({ "Variation": e.target.value });
                            setMatrix(newMatrix);
                          }}
                          className="w-full border-2 border-slate-100 rounded-xl px-3 py-2 text-sm font-bold focus:border-emerald-500 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Price (₱)</label>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => {
                            const newMatrix = [...matrix];
                            newMatrix[idx].price = e.target.value;
                            setMatrix(newMatrix);
                          }}
                          className="w-full border-2 border-slate-100 rounded-xl px-3 py-2 text-sm font-bold focus:border-emerald-500 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Stock</label>
                        <input
                          type="number"
                          value={item.stock}
                          onChange={(e) => {
                            const newMatrix = [...matrix];
                            newMatrix[idx].stock = e.target.value;
                            setMatrix(newMatrix);
                          }}
                          className="w-full border-2 border-slate-100 rounded-xl px-3 py-2 text-sm font-bold focus:border-emerald-500 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-2 relative">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">SKU</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item.sku}
                            placeholder="Optional"
                            onChange={(e) => {
                              const newMatrix = [...matrix];
                              newMatrix[idx].sku = e.target.value;
                              setMatrix(newMatrix);
                            }}
                            className="w-full border-2 border-slate-100 rounded-xl px-3 py-2 text-sm font-bold focus:border-emerald-500 outline-none transition-all"
                          />
                          {!isEditing && (
                            <button
                              onClick={() => setMatrix(matrix.filter((_, i) => i !== idx))}
                              className="ml-2 p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                              title="Remove variation"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {matrix.length === 0 && (
                  <div className="text-center py-10 rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 text-sm">No variations added yet.</p>
                    {!isEditing && (
                      <button
                        onClick={() => {
                          setMatrix([{
                            name: "Standard",
                            value: JSON.stringify({ "Variation": "Standard" }),
                            price: price || "0",
                            stock: "0",
                            sku: ""
                          }]);
                        }}
                        className="mt-4 text-emerald-600 font-bold hover:underline cursor-pointer"
                      >
                        Add your first variation
                      </button>
                    )}
                  </div>
                )}
              </div>
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

          <TabsContent value="pricing" className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Price (₱) *</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter product price"
                  value={matrix.length > 0 ? priceRange : price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={matrix.length > 0}
                  className={`w-full border rounded-md px-3 py-2 ${matrix.length > 0 ? "bg-gray-50 text-[#2E7D32] cursor-not-allowed font-black" : ""}`}
                />
                {matrix.length > 0 && (
                  <p className="text-[10px] text-[#2E7D32] font-bold mt-1 animate-pulse">
                    Dynamic range: Automatically synced from variations
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Product Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border rounded-md px-3 py-2">
                <option>Available</option>
                <option>Draft</option>
                <option>Out of stock</option>
                <option>Discontinued</option>
              </select>
            </div>
          </TabsContent>

          {/* SHIPPING */}
          <TabsContent value="shipping" className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Weight</label>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Enter weight" value={weight} onChange={(e) => setWeight(e.target.value)} className="border rounded-md px-3 py-2" />
                <select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)} className="border rounded-md px-3 py-2">
                  <option value="kg">kg (Kilograms)</option>
                  <option value="g">g (Grams)</option>
                  <option value="lb">lb (Pounds)</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Shipping Fee (₱)</label>
              <input type="number" placeholder="Enter shipping fee" value={shippingFee} onChange={(e) => setShippingFee(e.target.value)} className="w-full border rounded-md px-3 py-2" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Dimensions (cm)</label>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs text-gray-600">Length</label>
                  <input type="number" placeholder="Length" value={lengthVal} onChange={(e) => setLengthVal(e.target.value)} className="w-full border rounded-md px-3 py-2" />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs text-gray-600">Width</label>
                  <input type="number" placeholder="Width" value={widthVal} onChange={(e) => setWidthVal(e.target.value)} className="w-full border rounded-md px-3 py-2" />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs text-gray-600">Height</label>
                  <input type="number" placeholder="Height" value={heightVal} onChange={(e) => setHeightVal(e.target.value)} className="w-full border rounded-md px-3 py-2" />
                </div>
              </div>
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
