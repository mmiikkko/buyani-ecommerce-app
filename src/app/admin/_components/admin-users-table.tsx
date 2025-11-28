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
import { Eye } from "lucide-react";

export interface AdminUser {
  id: string;
  fullName: string;
  role: "Customer" | "Seller" | "Admin";
  amount: number;
  online: boolean;
  status: "active" | "pending" | "suspended";
  dateAdded: string;
}

export function AdminUsersTable({
  users,
  search,
  filter,
}: {
  users: AdminUser[];
  search: string;
  filter: string; // "all", "customer", "seller", "admin"
}) {
  const filtered = (users ?? []).filter((u) => {
    if (filter !== "all" && u.role.toLowerCase() !== filter.toLowerCase())
      return false;

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
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1">
                      Suspend
                    </Button>
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
