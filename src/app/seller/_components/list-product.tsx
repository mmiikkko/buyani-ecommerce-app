"use client"

import { useState } from "react";
import { Dialog,
         DialogContent,
         DialogHeader,
         DialogTitle,
         DialogTrigger } from "@/components/ui/dialog"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
};

interface AddProductsProps {
  onAdd: (product: Product) => void;
}

export function AddProducts({ onAdd }: AddProductsProps) {

  // FORM STATES
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // ERROR STATE
  const [error, setError] = useState("");

  const handleSubmit = () => {
    // VALIDATION
    if (!name.trim()) return setError("Product name is required.");
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0)
      return setError("Enter a valid price.");
    if (!stock.trim() || isNaN(Number(stock)) || Number(stock) < 0)
      return setError("Enter valid stock quantity.");

    // If valid → clear error
    setError("");

    const product = {
      id: crypto.randomUUID(),
      name: "New Product",
      price: 100,
      stock: 50,
      image: "",
    };

    onAdd(product);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-md hover:bg-[#27632a] cursor-pointer">
          + Add Product
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[950px] max-h-[650px] overflow-y-auto rounded-2xl">

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
            <TabsTrigger value="variations">Variations</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="shipping">Shipping Info</TabsTrigger>
          </TabsList>

          {/* BASIC INFO */}
          <TabsContent value="basic" className="mt-4">
            <div className="space-y-4">

              {/* ERROR MESSAGE */}
              {error && (
                <p className="text-red-500 text-sm font-medium">{error}</p>
              )}

              <input
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />

              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />

              <input
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />

            </div>
          </TabsContent>

          {/* Other tabs unchanged */}
          <TabsContent value="images" className="mt-4">
            <div className="border p-4 rounded-md">
              <p className="text-sm text-gray-600">Upload product images here</p>
            </div>
          </TabsContent>

          <TabsContent value="category" className="mt-4">
            <p className="text-gray-600 text-sm">Category selection UI goes here</p>
          </TabsContent>

          <TabsContent value="variations" className="mt-4">
            <p className="text-gray-600 text-sm">Variations (size, color, etc.)</p>
          </TabsContent>

          <TabsContent value="pricing" className="mt-4">
            <p className="text-gray-600 text-sm">Unit Price and Status</p>
          </TabsContent>

          <TabsContent value="shipping" className="mt-4">
            <p className="text-gray-600 text-sm">Shipping and logistics fields</p>
          </TabsContent>
        </Tabs>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 mt-6">
          <button className="px-5 py-2 bg-gray-200 rounded-md">
            Save as Draft
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Save and Publish
          </button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
