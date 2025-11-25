"use client";
// Removed unused Download and Button imports
import { SellerProductsSearchbar } from "../_components/seller-orders-searchbar";
import { OrdersTabsTable } from "../_components/seller-orders-table";
import { useState } from "react";
import type { Order } from "../../../types/orders";


export default function Orders() {



const demoOrders: Order[] = [
  {
    id: "1",
    buyerId: "USER123",
    addressId: "ADDR001",
    total: 50,
    createdAt: new Date("2023-10-01"),
    updatedAt: new Date("2023-10-01"),

    items: [
      {
        id: "OI-1",
        orderId: "1",
        productId: "P1",
        quantity: 2,
        subtotal: 50,
        product: {
          id: "P1",
          productName: "Product A",
          images: [
            {
              id: "IMG1",
              product_id: "P1",
              image_url: ["/images/product-a.jpg"],
              is_primary: true,
            },
          ],
        },
      },
    ],

    payment: {
      id: "PAY1",
      orderId: "1",
      paymentMethod: 1,
      paymentReceived: 50,
      change: 0,
      status: "Paid",
      createdAt: new Date("2023-10-01"),
      updatedAt: new Date("2023-10-01"),
    },

    transactions: [
      {
        id: "TX1",
        userId: "USER123",
        orderId: "1",
        transactionType: "online",
        remarks: null,
        createdAt: new Date("2023-10-01"),
        updatedAt: new Date("2023-10-01"),
      },
    ],

    status: "pending",
    type: "online",
  },

  {
    id: "2",
    buyerId: "USER456",
    addressId: "ADDR002",
    total: 30,
    createdAt: new Date("2023-10-02"),
    updatedAt: new Date("2023-10-02"),

    items: [
      {
        id: "OI-2",
        orderId: "2",
        productId: "P2",
        quantity: 1,
        subtotal: 30,
        product: {
          id: "P2",
          productName: "Product B",
          images: [
            {
              id: "IMG2",
              product_id: "P2",
              image_url: [
                "https://images.unsplash.com/photo-1589308078054-8329c0c11a87",
              ],
              is_primary: true,
            },
          ],
        },
      },
    ],

    payment: {
      id: "PAY2",
      orderId: "2",
      paymentMethod: 1,
      paymentReceived: 30,
      change: 0,
      status: "Paid",
      createdAt: new Date("2023-10-02"),
      updatedAt: new Date("2023-10-02"),
    },

    transactions: [
      {
        id: "TX2",
        userId: "USER456",
        orderId: "2",
        transactionType: "in-store",
        remarks: null,
        createdAt: new Date("2023-10-02"),
        updatedAt: new Date("2023-10-02"),
      },
    ],

    status: "shipped",
    type: "in-store",
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
