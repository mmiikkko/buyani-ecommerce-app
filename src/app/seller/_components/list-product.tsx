"use client"

import { Dialog,
         DialogContent,
         DialogDescription,
         DialogHeader,
         DialogTitle,
         DialogTrigger,} from "@/components/ui/dialog"
import { CircleX } from "lucide-react"

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
    
          <DialogContent className="sm:max-w-[953px] max-h-[600px] overflow-y-auto max-h-screen">
            <DialogHeader>
              <DialogTitle>Add a New Product</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a product to your store.
              </DialogDescription>
            </DialogHeader>
    
            {/* MODAL BODY CONTENT */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Product name"
                className="w-full border rounded-md px-3 py-2"
              />
    
              <input
                type="number"
                placeholder="Price"
                className="w-full border rounded-md px-3 py-2"
              />
    
              <textarea
                placeholder="Description"
                className="w-full border rounded-md px-3 py-2"
              />
    
              <button onClick={handleSubmit} className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
                Save Product
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )
}
