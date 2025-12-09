"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { USER_ROLES } from "@/server/schema/auth-schema";
import { Calendar, Eye, Mail, Shield, Store, Trash2, UserCheck, User as UserIcon, Users, UserX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export interface AdminUser {
  id: string;
  fullName: string;
  role: "Customer" | "Seller" | "Admin" | "Suspended";
  amount: number;
  lastActive: string | null;
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

  // Suspend seller accounts and block seller access
  const handleSuspend = async (userId: string, userName: string) => {
    if (!confirm(`Suspend ${userName}? Their seller access will be revoked and they must re-apply.`)) return;
    
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/users?id=${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: USER_ROLES.SUSPENDED }),
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
        body: JSON.stringify({ role: USER_ROLES.CUSTOMER }),
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

  const stats = useMemo(() => {
    const total = filtered.length;
    const active = filtered.filter(u => u.status === "active").length;
    const pending = filtered.filter(u => u.status === "pending").length;
    const suspended = filtered.filter(u => u.status === "suspended").length;
    // Count users active in last 15 minutes
    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
    const recentlyActive = filtered.filter(u => {
      if (!u.lastActive) return false;
      const lastActive = new Date(u.lastActive);
      return lastActive > fifteenMinutesAgo;
    }).length;
    return { total, active, pending, suspended, recentlyActive };
  }, [filtered]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-1.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-600 mb-0">Total Users</p>
                <p className="text-base font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="p-1 bg-blue-600 rounded-lg">
                <Users className="h-2.5 w-2.5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-1.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-600 mb-0">Active</p>
                <p className="text-base font-bold text-gray-800">{stats.active}</p>
              </div>
              <div className="p-1 bg-emerald-600 rounded-lg">
                <UserCheck className="h-2.5 w-2.5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-1.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-600 mb-0">Pending</p>
                <p className="text-base font-bold text-gray-800">{stats.pending}</p>
              </div>
              <div className="p-1 bg-amber-600 rounded-lg">
                <Mail className="h-2.5 w-2.5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-1.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-600 mb-0">Suspended</p>
                <p className="text-base font-bold text-gray-800">{stats.suspended}</p>
              </div>
              <div className="p-1 bg-red-600 rounded-lg">
                <UserX className="h-2.5 w-2.5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md border border-gray-200">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-gray-50">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-semibold text-gray-600 mb-2">No users found</p>
              <p className="text-sm text-gray-500">
                {search ? "Try adjusting your search criteria" : "No users match the selected filter"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto px-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700 py-2">
                      <div className="flex items-center gap-1.5">
                        <UserIcon className="h-3 w-3" />
                        <span className="text-xs">User ID</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-2">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3 w-3" />
                        <span className="text-xs">Customer</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-2">
                      <div className="flex items-center gap-1.5">
                        <Shield className="h-3 w-3" />
                        <span className="text-xs">Role</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-2">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        <span className="text-xs">Last Active</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-2">
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3 w-3" />
                        <span className="text-xs">Status</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-2">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        <span className="text-xs">Date Added</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-2 text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {currentRows.map((user, index) => (
                    <TableRow 
                      key={user.id}
                      className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                    >
                      <TableCell className="font-medium text-gray-800 font-mono text-xs py-1.5">
                        {user.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="text-gray-700 font-medium text-xs py-1.5">
                        {user.fullName}
                      </TableCell>
                      <TableCell className="py-1.5">
                        <Badge 
                          className={
                            user.role === "Admin" 
                              ? "bg-purple-600 text-white border-0 text-xs py-0"
                              : user.role === "Seller"
                              ? "bg-blue-600 text-white border-0 text-xs py-0"
                              : user.role === "Suspended"
                              ? "bg-red-600 text-white border-0 text-xs py-0"
                              : "bg-gray-600 text-white border-0 text-xs py-0"
                          }
                        >
                          {user.role === "Admin" && <Shield className="h-2.5 w-2.5 mr-1" />}
                          {user.role === "Seller" && <Store className="h-2.5 w-2.5 mr-1" />}
                          {user.role}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-xs text-gray-600 py-1.5">
                        {user.lastActive ? (
                          <div className="flex flex-col">
                            <span>
                              {new Date(user.lastActive).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                            <span className="text-[10px] text-gray-500">
                              {new Date(user.lastActive).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-xs">Never</span>
                        )}
                      </TableCell>

                      <TableCell className="py-1.5">
                        <Badge 
                          className={
                            user.status === "active"
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200 text-xs py-0"
                              : user.status === "pending"
                              ? "bg-amber-100 text-amber-700 border-amber-200 text-xs py-0"
                              : "bg-red-100 text-red-700 border-red-200 text-xs py-0"
                          }
                        >
                          {user.status === "active" && <UserCheck className="h-2.5 w-2.5 mr-1" />}
                          {user.status === "pending" && <Mail className="h-2.5 w-2.5 mr-1" />}
                          {user.status === "suspended" && <UserX className="h-2.5 w-2.5 mr-1" />}
                          {user.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-xs text-gray-600 py-1.5">
                        {new Date(user.dateAdded).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>

                      <TableCell className="py-1.5">
                        <div className="flex items-center gap-1.5">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            title="View Details"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          
                          {/* Show Suspend or Restore button based on status */}
                          {user.role === "Suspended" || user.status === "suspended" ? (
                            <Button 
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs cursor-pointer h-7 px-2"
                              onClick={() => handleRestore(user.id, user.fullName)}
                              disabled={actionLoading === user.id}
                              title="Restore User"
                            >
                              <UserCheck className="h-2.5 w-2.5 mr-1" />
                              {actionLoading === user.id ? "..." : "Restore"}
                            </Button>
                          ) : user.role !== "Admin" ? (
                            <Button 
                              size="sm"
                              className="bg-amber-600 hover:bg-amber-700 text-white text-xs cursor-pointer h-7 px-2"
                              onClick={() => handleSuspend(user.id, user.fullName)}
                              disabled={actionLoading === user.id}
                              title="Suspend User"
                            >
                              <UserX className="h-2.5 w-2.5 mr-1" />
                              {actionLoading === user.id ? "..." : "Suspend"}
                            </Button>
                          ) : null}

                          {/* Delete button - don't show for admin users */}
                          {user.role !== "Admin" && (
                            <Button 
                              variant="destructive"
                              size="sm"
                              className="text-xs cursor-pointer h-7 w-7 p-0"
                              onClick={() => handleDelete(user.id, user.fullName)}
                              disabled={actionLoading === user.id}
                              title="Delete User"
                            >
                              <Trash2 className="h-2.5 w-2.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="flex justify-between items-center p-4 bg-gray-50 border-t">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="border-gray-300"
              >
                Previous
              </Button>

              <span className="text-sm text-gray-600">
                Page {currentPage} of {pageCount}
              </span>

              <Button
                variant="outline"
                disabled={currentPage === pageCount}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="border-gray-300"
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
