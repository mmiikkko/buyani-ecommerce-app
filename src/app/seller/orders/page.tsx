"use client";
import { Download} from "lucide-react";
import { Button } from "@/components/ui/button"; // ✅ Add this import for a clean button look
import { SellerProductsSearchbar } from "../_components/seller-orders-searchbar";
import { OrdersTabsTable } from "../_components/seller-orders-table";
import { useState } from "react";

export default function Orders() {

  // TEMPORARY HARDCODED ORDERS
const demoOrders = [
  {
    id: "ORD-1001",
    customer: "Juan Dela Cruz",
    date: "2025-01-12",
    products: 3,
    amount: "₱1,250",
    payment: "GCash",
    status: "pending",
    type: "Delivery",
  },
  {
    id: "ORD-1002",
    customer: "Maria Santos",
    date: "2025-01-10",
    products: 1,
    amount: "₱350",
    payment: "Cash",
    status: "confirmed",
    type: "Pickup",
  },
  {
    id: "ORD-1003",
    customer: "Carlo Reyes",
    date: "2025-01-09",
    products: 2,
    amount: "₱780",
    payment: "Maya",
    status: "shipped",
    type: "Delivery",
  },
  {
    id: "ORD-1004",
    customer: "Angela Cruz",
    date: "2025-01-09",
    products: 5,
    amount: "₱2,550",
    payment: "Cash",
    status: "pending",
    type: "Pickup",
  },
  {
    id: "ORD-1005",
    customer: "Jayson Bautista",
    date: "2025-01-08",
    products: 4,
    amount: "₱1,980",
    payment: "GCash",
    status: "confirmed",
    type: "Delivery",
  },
  {
    id: "ORD-1006",
    customer: "Nicole Tan",
    date: "2025-01-07",
    products: 2,
    amount: "₱720",
    payment: "Maya",
    status: "shipped",
    type: "Pickup",
  },
  {
    id: "ORD-1007",
    customer: "Mark Villanueva",
    date: "2025-01-07",
    products: 3,
    amount: "₱1,110",
    payment: "Cash",
    status: "pending",
    type: "Delivery",
  },
  {
    id: "ORD-1008",
    customer: "Jenny Francisco",
    date: "2025-01-06",
    products: 6,
    amount: "₱3,210",
    payment: "GCash",
    status: "confirmed",
    type: "Pickup",
  },
  {
    id: "ORD-1009",
    customer: "Robin Cortez",
    date: "2025-01-06",
    products: 2,
    amount: "₱910",
    payment: "Cash",
    status: "shipped",
    type: "Delivery",
  },
];

const [filter, setFilter] = useState<string>("all");
const [search, setSearch] = useState<string>("");

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
      
      <SellerProductsSearchbar
          onFilterChange={setFilter}
          onSearchChange={setSearch}
      />
      <OrdersTabsTable 
        ordersData={demoOrders}
        filter={filter}
        search={search}
      />
    </section>
  );
}
