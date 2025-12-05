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
import type { Order } from "@/types/orders";

export function OrdersTabsTable({
  ordersData,
  filter,
  search,
  onStatusUpdate,
}: {
  ordersData: Order[];
  filter: string;
  search: string;
  onStatusUpdate?: (orderId: string, newStatus: string) => void;
}) {
  return (
    <div className="w-full p-6 bg-green-50 min-h-screen">
      <OrdersTable
        orders={ordersData}
        filter={filter}
        search={search}
        onStatusUpdate={onStatusUpdate}
      />
    </div>
  );
}

function OrdersTable({
  orders,
  filter,
  search,
  onStatusUpdate,
}: {
  orders: Order[];
  filter: string;
  search: string;
  onStatusUpdate?: (orderId: string, newStatus: string) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const filteredOrders = useMemo(() => {
    return (orders ?? []).filter((order) => {
      const firstItem = order.items?.[0];
      const productName = firstItem?.productName ?? "Unknown";
      const customer = order.buyerId ?? "Unknown";

      // no real status in type, skipping filter unless you manage a temp status in frontend
      if (filter !== "all") return true;

      if (search.trim() !== "") {
        const s = search.toLowerCase();
        if (
          !order.orderId.toLowerCase().includes(s) &&
          !customer.toLowerCase().includes(s) &&
          !productName.toLowerCase().includes(s)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [orders, filter, search]);

  const pageCount = Math.max(1, Math.ceil(filteredOrders.length / rowsPerPage));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [filter, search]);

  const currentRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredOrders.slice(start, start + rowsPerPage);
  }, [currentPage, filteredOrders]);

  return (
    <div className="space-y-3">
      {filteredOrders.length === 0 && (
        <div className="w-full text-center py-6 text-muted-foreground border rounded-md bg-white">
          No orders found.
        </div>
      )}

      {filteredOrders.length > 0 && (
        <Table className="bg-white rounded-xl shadow-sm">
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentRows.map((order, idx) => {
              const firstItem = order.items?.[0];
              const productName = firstItem?.productName ?? "Unknown";

              return (
                <TableRow key={order.orderId ?? idx}>
                  <TableCell className="font-medium">{order.orderId}</TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span>{order.buyerId}</span>
                      <span className="text-xs text-muted-foreground">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>{productName}</TableCell>

                  <TableCell>{firstItem?.quantity ?? 0}</TableCell>

                  <TableCell>{order.total ?? 0}</TableCell>

                  <TableCell className="flex gap-2 items-center">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
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
  );
}
