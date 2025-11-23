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
      productName: "Fresh Sweet Pineapple",
      img: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc",
      quantity: 3,
      amount: "₱1,250",
      payment: "GCash",
      status: "pending",
      type: "Delivery",
    },
    {
      id: "ORD-1002",
      customer: "Maria Santos",
      date: "2025-01-10",
      productName: "Pineapple Slices (Canned)",
      img: "https://images.unsplash.com/photo-1585238342028-4a45a4d0d81a",
      quantity: 1,
      amount: "₱350",
      payment: "Cash",
      status: "confirmed",
      type: "Pickup",
    },
    {
      id: "ORD-1003",
      customer: "Carlo Reyes",
      date: "2025-01-09",
      productName: "Pineapple Jam",
      img: "https://images.unsplash.com/photo-1589308078054-8329c0c11a87",
      quantity: 2,
      amount: "₱780",
      payment: "Maya",
      status: "shipped",
      type: "Delivery",
    },
    {
      id: "ORD-1004",
      customer: "Angela Cruz",
      date: "2025-01-09",
      productName: "Pineapple Tart Pack",
      img: "https://images.unsplash.com/photo-1604908554168-58c036ba0acd",
      quantity: 5,
      amount: "₱2,550",
      payment: "Cash",
      status: "pending",
      type: "Pickup",
    },
    {
      id: "ORD-1005",
      customer: "Jayson Bautista",
      date: "2025-01-08",
      productName: "Pineapple Juice (1L)",
      img: "https://images.unsplash.com/photo-1585238342071-ea5f92d781ae",
      quantity: 4,
      amount: "₱1,980",
      payment: "GCash",
      status: "confirmed",
      type: "Delivery",
    },
    {
      id: "ORD-1006",
      customer: "Nicole Tan",
      date: "2025-01-07",
      productName: "Pineapple Vinegar",
      img: "https://images.unsplash.com/photo-1598514982221-0e0dffa8b5c8",
      quantity: 2,
      amount: "₱720",
      payment: "Maya",
      status: "shipped",
      type: "Pickup",
    },
    {
      id: "ORD-1007",
      customer: "Mark Villanueva",
      date: "2025-01-07",
      productName: "Pineapple Crumble Cake",
      img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
      quantity: 3,
      amount: "₱1,110",
      payment: "Cash",
      status: "pending",
      type: "Delivery",
    },
    {
      id: "ORD-1008",
      customer: "Jenny Francisco",
      date: "2025-01-06",
      productName: "Pineapple Preserves (Jar)",
      img: "https://images.unsplash.com/photo-1543353071-10c8ba85a904",
      quantity: 6,
      amount: "₱3,210",
      payment: "GCash",
      status: "confirmed",
      type: "Pickup",
    },
    {
      id: "ORD-1009",
      customer: "Robin Cortez",
      date: "2025-01-06",
      productName: "Dried Pineapple Rings",
      img: "https://images.unsplash.com/photo-1585238301549-62b1fe4e30c1",
      quantity: 2,
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
