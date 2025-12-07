"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminSearchbar } from "../_components/admin-users-searchbar";
import { AdminUsersTable, AdminUser } from "../_components/admin-users-table";

// Define the APIUser interface to type the fetched data
interface APIUser {
  id: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  role: "admin" | "seller" | "customer" | "suspended";
  emailVerified: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      const data: APIUser[] = await res.json();

      // Transform API data to AdminUser format
      const transformedUsers: AdminUser[] = data.map((user) => {
        // Determine display role
        let displayRole: "Customer" | "Seller" | "Admin" | "Suspended";
        if (user.role === "admin") displayRole = "Admin";
        else if (user.role === "seller") displayRole = "Seller";
        else if (user.role === "suspended") displayRole = "Suspended";
        else displayRole = "Customer";

        // Determine status - suspended users get suspended status
        let status: "active" | "pending" | "suspended";
        if (user.role === "suspended") {
          status = "suspended";
        } else if (user.emailVerified) {
          status = "active";
        } else {
          status = "pending";
        }

        return {
          id: user.id,
          fullName: user.name || `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Unknown",
          role: displayRole,
          amount: 0,
          online: false,
          status,
          dateAdded: user.createdAt || new Date().toISOString(),
        };
      });

      setUsers(transformedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
          onRefresh={fetchUsers}
        />
      )}
    </section>
  );
}
