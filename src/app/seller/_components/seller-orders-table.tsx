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
import { Eye, Check, X } from "lucide-react";
import type { Order } from "@/types/orders";
import { toast } from "sonner";

export function OrdersTabsTable({
  ordersData,
  filter,
  search,
  onStatusUpdate,
  onRefresh,
}: {
  ordersData: Order[];
  filter: string;
  search: string;
  onStatusUpdate?: (orderId: string, newStatus: string) => void;
  onRefresh?: () => void;
}) {
  return (
    <div className="w-full p-6 bg-green-50 min-h-screen">
      <OrdersTable
        orders={ordersData}
        filter={filter}
        search={search}
        onStatusUpdate={onStatusUpdate}
        onRefresh={onRefresh}
      />
    </div>
  );
}

function OrdersTable({
  orders,
  filter,
  search,
  onStatusUpdate,
  onRefresh,
}: {
  orders: Order[];
  filter: string;
  search: string;
  onStatusUpdate?: (orderId: string, newStatus: string) => void;
  onRefresh?: () => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [processingOrder, setProcessingOrder] = useState<string | null>(null);
  const rowsPerPage = 8;

  const handleAcceptReject = async (orderId: string, status: "accepted" | "rejected") => {
    try {
      setProcessingOrder(orderId);
      const res = await fetch(`/api/sellers/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update order status");
      }

      toast.success(`Order ${status} successfully`);
      
      // Call the parent's status update handler if provided
      if (onStatusUpdate) {
        onStatusUpdate(orderId, status === "accepted" ? "confirmed" : "rejected");
      }
      
      // Refresh the orders list
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update order";
      toast.error(errorMessage);
    } finally {
      setProcessingOrder(null);
    }
  };

  const filteredOrders = useMemo(() => {
    return (orders ?? []).filter((order) => {
      const firstItem = order.items?.[0];
      const productName = firstItem?.productId ?? firstItem?.productName ?? "Unknown";
      const customer = order.buyerName ?? order.buyerId ?? "Unknown";

      // no real status in type, skipping filter unless you manage a temp status in frontend
      if (filter !== "all") return true;

      if (search.trim() !== "") {
        const s = search.toLowerCase();
        const orderId = (order.orderId || order.id || "").toLowerCase();
        if (
          !orderId.includes(s) &&
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
              <TableHead>Seller Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentRows.map((order, idx) => {
              const firstItem = order.items?.[0];
              const productName = firstItem?.productId ?? firstItem?.productName ?? "Unknown";
              const buyerName = order.buyerName ?? order.buyerId ?? "Unknown Customer";
              const orderId = order.orderId || order.id || `order-${idx}`;

              return (
                <TableRow key={orderId}>
                  <TableCell className="font-medium">{orderId}</TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span>{buyerName}</span>
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

                  <TableCell>
                    {(() => {
                      const orderStatus = order.status?.toLowerCase() || order.payment?.status?.toLowerCase() || "";
                      const isAccepted = orderStatus === "confirmed" || orderStatus === "accepted";
                      const isRejected = orderStatus === "rejected";
                      const isProcessed = isAccepted || isRejected;

                      if (isProcessed) {
                        return (
                          <div className="flex items-center gap-2">
                            {isAccepted ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                <Check className="h-3 w-3 mr-1" />
                                Accepted
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                <X className="h-3 w-3 mr-1" />
                                Rejected
                              </span>
                            )}
                          </div>
                        );
                      }

                      return (
                        <div className="flex gap-2 items-center">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleAcceptReject(orderId, "accepted")}
                            disabled={processingOrder === orderId}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Accept
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleAcceptReject(orderId, "rejected")}
                            disabled={processingOrder === orderId}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      );
                    })()}
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
