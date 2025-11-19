"use client";
import { Download} from "lucide-react";
import { Button } from "@/components/ui/button"; // ✅ Add this import for a clean button look
import { SellerProductsSearchbar } from "../_components/seller-orders-searchbar";
import { OrdersTabsTable } from "../_components/seller-orders-table";

export default function Orders() {
  return (
    <section className="relative min-h-screen min-w-[80%] max-w-[100%] overflow-hidden space-y-5 mt-18 mx-3">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <h1 className="text-xl mb-1 font-bold text-[#2E7D32]">Orders</h1>
          <p>Manage your online and in-store orders</p>
        </div>
        <div className="flex flex-col justify-center">
          <Button 
            variant="export"
            className="cursor-pointer"
          >
          <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <SellerProductsSearchbar />
      <OrdersTabsTable />
    </section>
  );
}
