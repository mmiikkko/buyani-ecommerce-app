"use client"

import { Dialog,
         DialogContent,
         DialogDescription,
         DialogHeader,
         DialogTitle,
         DialogTrigger,} from "@/components/ui/dialog"

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
export function AddProducts({ onAdd } : AddProductsProps) {
    const handleSubmit = () => {

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
            {/* Your Add Product button here */}
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-md hover:bg-[#27632a] cursor-pointer">
              + Add Product
            </button>
          </DialogTrigger>
    
          <DialogContent className="sm:max-w-[950px] max-h-[650px] overflow-y-auto rounded-2xl">
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="text-[#2E7D32] text-xl font-bold">
            Products Information
          </DialogTitle>
        </DialogHeader>

        {/* TABS */}
        <Tabs defaultValue="basic" className="w-full mt-4">
          <TabsList className="flex space-x-2 bg-transparent">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="images">Product Images</TabsTrigger>
            <TabsTrigger value="category">Category</TabsTrigger>
            <TabsTrigger value="variations">Variations</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="shipping">Shipping Info</TabsTrigger>
          </TabsList>

          {/* TAB CONTENTS */}

          {/* BASIC INFO TAB */}
          <TabsContent value="basic" className="mt-4">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                className="w-full border rounded-md px-3 py-2"
              />
              <textarea
                placeholder="Description"
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
          </TabsContent>

          {/* IMAGES TAB */}
          <TabsContent value="images" className="mt-4">
            <div className="border p-4 rounded-md">
              <p className="text-sm text-gray-600">Upload product images here</p>
            </div>
          </TabsContent>

          {/* CATEGORY TAB */}
          <TabsContent value="category" className="mt-4">
            <p className="text-gray-600 text-sm">Category selection UI goes here</p>
          </TabsContent>

          {/* VARIATIONS TAB */}
          <TabsContent value="variations" className="mt-4">
            <p className="text-gray-600 text-sm">Variations (size, color, etc.)</p>
          </TabsContent>

          {/* SHIPPING INFO TAB */}
          <TabsContent value="pricing" className="mt-4">
            <p className="text-gray-600 text-sm">Unit Price and Status</p>
          </TabsContent>

          {/* OTHER INFO TAB */}
          <TabsContent value="shipping" className="mt-4">
            <p className="text-gray-600 text-sm">Shipping and logistics fields</p>
          </TabsContent>
        </Tabs>

        {/* FOOTER BUTTONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button className="px-5 py-2 bg-gray-200 rounded-md cursor-pointer">
            Save as Draft
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
          >
            Save and Publish
          </button>
        </div>
      </DialogContent>
        </Dialog>
      )
}
