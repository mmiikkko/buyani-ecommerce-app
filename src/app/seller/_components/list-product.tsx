"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { v4 as uuidv4 } from "uuid";
import type { Product } from "@/types/products";

interface AddProductsProps {
  onAdd: (product: Product) => void;
}

export function AddProducts({ onAdd }: AddProductsProps) {
  const [categories, setCategories] = useState<{ id: string; categoryName: string }[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // BASIC
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // IMAGES
  const [imagePreviews, setImagePreviews] = useState<string[]>([
    "/mnt/data/cd282b9a-854b-424e-8299-1e421d8c3b67.png",
  ]);

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
          if (data.length > 0) setCategoryId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  /* --- Submit --- */
  const handleSubmit = () => {
    if (!name.trim()) return setError("Product name is required.");
    if (!categoryId) return setError("Please select a category.");
    if (!price.trim() || Number(price) <= 0) return setError("Enter a valid price.");
    if (!stock.trim() || Number(stock) < 0) return setError("Enter valid stock quantity.");

    setError("");

    const productId = uuidv4();
    const skuBase = (name || "PRD").replace(/\s+/g, "").toUpperCase().slice(0, 6);

    const product: Product = {
      id: productId,
      productName: name,
      description,
      price: Number(price),
      stock: Number(stock),
      images: imagePreviews.map((img, idx) => ({
        id: uuidv4(),
        product_id: productId,
        image_url: [img],
        is_primary: idx === 0,
      })),
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
      status,
      shopId: "",
      isAvailable: status === "Available",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onAdd(product);

    // RESET
    setName("");
    setDescription("");
    setImagePreviews(["/mnt/data/cd282b9a-854b-424e-8299-1e421d8c3b67.png"]);
    if (categories.length > 0) setCategoryId(categories[0].id);
    setPrice("");
    setStock("");
    setWeight("");
    setWeightUnit("kg");
    setLengthVal("");
    setWidthVal("");
    setHeightVal("");
    setShippingFee("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-md hover:bg-[#27632a] cursor-pointer">
          + Add Product
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[950px] max-h-[750px] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#2E7D32] text-xl font-bold">
            Products Information
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
              <input type="file" accept="image/*" multiple onChange={(e) => {
                const files = e.target.files;
                if (!files) return;
                setImagePreviews(prev => [...prev, ...Array.from(files).map(f => URL.createObjectURL(f))]);
              }} />
              <div className="mt-3 grid grid-cols-4 gap-3">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="relative border rounded-md overflow-hidden">
                    <Image src={src} alt={`preview-${idx}`} width={200} height={200} className="object-cover" />
                    <button onClick={() => setImagePreviews(prev => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-black/50 text-white text-xs px-2 py-1 rounded" type="button">Remove</button>
                  </div>
                ))}
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

              <input type="number" placeholder="Length" value={lengthVal} onChange={(e) => setLengthVal(e.target.value)} className="border rounded px-2 py-1" />
              <input type="number" placeholder="Width" value={widthVal} onChange={(e) => setWidthVal(e.target.value)} className="border rounded px-2 py-1" />
              <input type="number" placeholder="Height" value={heightVal} onChange={(e) => setHeightVal(e.target.value)} className="border rounded px-2 py-1" />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6">
          <button className="px-5 py-2 bg-gray-200 rounded-md">Save as Draft</button>
          <button onClick={handleSubmit} className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Save and Publish</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
