"use client";

import { useState, useEffect } from "react";
import { AdminSearchbar } from "../_components/admin-users-searchbar";
import { AdminUsersTable, AdminUser } from "../_components/admin-users-table";

// Define the APIUser interface to type the fetched data
interface APIUser {
  id: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  role: "admin" | "seller" | "customer";
  emailVerified: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data: APIUser[] = await res.json(); // now fully typed

        // Transform API data to AdminUser format
        const transformedUsers: AdminUser[] = data.map((user) => ({
          id: user.id,
          fullName: user.name || `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Unknown",
          role: user.role === "admin" ? "Admin" : user.role === "seller" ? "Seller" : "Customer",
          amount: 0,
          online: false,
          status: user.emailVerified ? "active" : "pending",
          dateAdded: user.createdAt || new Date().toISOString(),
        }));

        setUsers(transformedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    if (filter === "all") return true;
    if (filter === "active") return user.status === "active";
    if (filter === "pending") return user.status === "pending";
    if (filter === "suspended") return user.status === "suspended";
    return true;
  });

  return (
    <section className="relative min-h-screen min-w-full overflow-hidden space-y-5 mt-18 mx-3">
      <h1 className="text-xl font-bold mb-1 text-[#2E7D32]">
        Users Monitoring
      </h1>
      <p>Manage user accounts and user privileges</p>

      <AdminSearchbar
        placeholder="Search by user ID or name"
        filterOptions={[
          { value: "all", label: "All" },
          { value: "active", label: "Active" },
          { value: "pending", label: "Pending" },
          { value: "inactive", label: "Inactive" },
          { value: "suspended", label: "Suspended" },
        ]}
        onFilterChange={(val) => setFilter(val)}
        onSearchChange={(val) => setSearch(val)}
      />

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <AdminUsersTable
          users={filteredUsers}
          search={search}
          filter={filter}
        />
      )}
    </section>
  );
}
