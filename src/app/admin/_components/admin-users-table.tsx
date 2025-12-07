"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, UserX, UserCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";

export interface AdminUser {
  id: string;
  fullName: string;
  role: "Customer" | "Seller" | "Admin" | "Suspended";
  amount: number;
  online: boolean;
  status: "active" | "pending" | "suspended";
  dateAdded: string;
  originalRole?: string; // Store original role before suspension
}

export function AdminUsersTable({
  users,
  search,
  filter,
  onRefresh,
}: {
  users: AdminUser[];
  search: string;
  filter: string; // "all", "active", "pending", "inactive", "suspended"
  onRefresh?: () => void;
}) {
  const filtered = (users ?? []).filter((u) => {
    // Filter by status (already filtered in parent, but keeping for consistency)
    if (filter !== "all" && u.status !== filter) return false;

    // Filter by search
    if (search.trim() !== "") {
      const s = search.toLowerCase();
      if (
        !u.fullName.toLowerCase().includes(s) &&
        !u.id.toLowerCase().includes(s)
      ) {
        return false;
      }
    }

    return true;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const pageCount = Math.max(1, Math.ceil(filtered.length / rowsPerPage));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [search, filter]);

  const currentRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [currentPage, filtered]);

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Suspend user by changing their role to "suspended"
  const handleSuspend = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to suspend ${userName}?`)) return;
    
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/users?id=${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "suspended" }),
      });
      
      if (res.ok) {
        toast.success(`${userName} has been suspended`);
        onRefresh?.();
      } else {
        toast.error("Failed to suspend user");
      }
    } catch (error) {
      console.error("Error suspending user:", error);
      toast.error("Failed to suspend user");
    } finally {
      setActionLoading(null);
    }
  };

  // Restore user by changing their role back to "customer"
  const handleRestore = async (userId: string, userName: string) => {
    if (!confirm(`Restore ${userName} as a customer?`)) return;
    
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/users?id=${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "customer" }),
      });
      
      if (res.ok) {
        toast.success(`${userName} has been restored`);
        onRefresh?.();
      } else {
        toast.error("Failed to restore user");
      }
    } catch (error) {
      console.error("Error restoring user:", error);
      toast.error("Failed to restore user");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete user permanently
  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to permanently delete ${userName}? This action cannot be undone.`)) return;
    
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/users?id=${userId}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        toast.success(`${userName} has been deleted`);
        onRefresh?.();
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="w-full p-6 bg-green-50 min-h-screen">
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="w-full text-center py-6 text-muted-foreground border rounded-md bg-white">
            No users found.
          </div>
        )}

        {filtered.length > 0 && (
          <Table className="bg-white rounded-xl shadow-sm">
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Online</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date added</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentRows.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>₱{user.amount}</TableCell>

                  <TableCell>
                    <span
                      className={`w-3 h-3 rounded-full inline-block ${
                        user.online ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></span>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`text-xs px-2 py-1 rounded-full capitalize
                      ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700"
                          : user.status === "pending"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(user.dateAdded).toLocaleString()}
                  </TableCell>

                  <TableCell className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" title="View Details">
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {/* Show Suspend or Restore button based on status */}
                    {user.role === "Suspended" || user.status === "suspended" ? (
                      <Button 
                        className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 cursor-pointer"
                        onClick={() => handleRestore(user.id, user.fullName)}
                        disabled={actionLoading === user.id}
                        title="Restore User"
                      >
                        <UserCheck className="h-3 w-3 mr-1" />
                        {actionLoading === user.id ? "..." : "Restore"}
                      </Button>
                    ) : user.role !== "Admin" ? (
                      <Button 
                        className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1 cursor-pointer"
                        onClick={() => handleSuspend(user.id, user.fullName)}
                        disabled={actionLoading === user.id}
                        title="Suspend User"
                      >
                        <UserX className="h-3 w-3 mr-1" />
                        {actionLoading === user.id ? "..." : "Suspend"}
                      </Button>
                    ) : null}

                    {/* Delete button - don't show for admin users */}
                    {user.role !== "Admin" && (
                      <Button 
                        variant="destructive"
                        size="sm"
                        className="text-xs px-2 py-1 cursor-pointer"
                        onClick={() => handleDelete(user.id, user.fullName)}
                        disabled={actionLoading === user.id}
                        title="Delete User"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div className="flex justify-between items-center mt-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </Button>

          <span className="text-sm">
            Page {currentPage} of {pageCount}
          </span>

          <Button
            variant="outline"
            disabled={currentPage === pageCount}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
