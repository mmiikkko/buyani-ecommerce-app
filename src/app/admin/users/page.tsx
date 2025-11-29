"use client";

import { useState } from "react";
import { AdminUsersSearchbar } from "./admin-users-searchbar";
import { AdminUsersTable } from "./admin-users-table";

 //id: string;
  //fullName: string;
  //role: "Customer" | "Seller" | "Admin";
  //online: boolean;
  //status: "active" | "pending" | "suspended";
  //dateAdded: string;

export default function AdminUsersPage() {
  const demoUsers = [
    {
      id: "001",
      fullName: "Salamat, Martin Lewis",
      role: "Customer",
      amount: 265,
      online: true,
      status: "active",
      dateAdded: "2025-01-08T10:30:00",
    },
    {
      id: "002",
      fullName: "Azied, Jaycee",
      role: "Seller",
      amount: 250,
      online: true,
      status: "active",
      dateAdded: "2025-01-08T09:15:00",
    },
    {
      id: "003",
      fullName: "Doe, John",
      role: "Seller",
      amount: 75,
      online: true,
      status: "pending",
      dateAdded: "2025-01-08T11:00:00",
    },
  ];
  


    const [filter, setFilter] = useState<string>("all");
    const [search, setSearch] = useState<string>("");
  return (
    <section className="relative min-h-screen min-w-full overflow-hidden space-y-5 mt-18 mx-3">
      <h1 className="text-xl font-bold mb-1 text-[#2E7D32]">
        Users Monitoring
      </h1>
      <p>Manage user accounts and user priviledges</p>

      <AdminUsersSearchbar
        onFilterChange={setFilter}
        onSearchChange={setSearch}
      />

      <AdminUsersTable
        users={demoUsers}
        filter={filter}
        search={search}
      />
    </section>
  );
}
