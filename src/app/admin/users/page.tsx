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
      id: "1",
      fullName: "John Doe",
      role: "Customer", // Matches the allowed value
      amount: 100,
      online: true,
      status: "Active",
      dateAdded: "2023-10-01",
    },
    {
      id: "2",
      fullName: "Jane Smith",
      role: "Seller", // Matches the allowed value
      amount: 200,
      online: false,
      status: "Inactive",
      dateAdded: "2023-10-02",
    },
  ];

  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  return (
    <section className="relative min-h-screen min-w-full overflow-hidden space-y-5 mt-18 mx-3">
      <h1 className="text-xl font-bold mb-1 text-[#2E7D32]">
        Users Monitoring
      </h1>
      <p>Manage user accounts and user privileges</p>

      <AdminUsersSearchbar
        onFilterChange={setFilter}
        onSearchChange={setSearch}
      />
    </section>
  );
}
