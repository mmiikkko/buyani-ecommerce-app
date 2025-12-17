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
import { Eye, Check, X, Truck } from "lucide-react";
import type { Order } from "@/types/orders";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n/context";
import { OrderDetailsModal } from "./order-details-modal";

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
  const { t } = useLanguage();
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
        throw new Error(error.error || t("failed-update-status"));
      }

      toast.success(status === "accepted" ? t("order-accepted-success") : t("order-rejected-success"));
      
      // Call the parent's status update handler if provided
      if (onStatusUpdate) {
        onStatusUpdate(orderId, status === "accepted" ? "confirmed" : "rejected");
      }

      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t("failed-update-order");
      toast.error(errorMessage);
    } finally {
      setProcessingOrder(null);
    }
  };

  const handleMarkShipped = async (orderId: string) => {
    try {
      setProcessingOrder(orderId);
      const res = await fetch(`/api/sellers/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "shipped" }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || t("failed-update-status"));
      }

      toast.success(t("order-shipped-success"));

      if (onStatusUpdate) {
        onStatusUpdate(orderId, "shipped");
      }

      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t("failed-update-order");
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
    setCurrentPage(1);
  }, [filter, search]);

  const currentRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredOrders.slice(start, start + rowsPerPage);
  }, [currentPage, filteredOrders]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);


  return (
    <div className="space-y-3">
      {filteredOrders.length === 0 && (
        <div className="w-full text-center py-6 text-muted-foreground border rounded-md bg-white">
          {t("no-orders-found")}
        </div>
      )}

      {filteredOrders.length > 0 && (
        <Table className="bg-white rounded-xl shadow-sm">
          <TableHeader>
            <TableRow>
              <TableHead>{t("order-id")}</TableHead>
              <TableHead>{t("customer")}</TableHead>
              <TableHead>{t("product")}</TableHead>
              <TableHead>{t("qty")}</TableHead>
              <TableHead>{t("amount")}</TableHead>
              <TableHead>{t("actions")}</TableHead>
              <TableHead>{t("seller-action")}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentRows.map((order, idx) => {
              const firstItem = order.items?.[0];
              const productName = firstItem?.productId ?? firstItem?.productName ?? "unknown-product";
              const buyerName = order.buyerName ?? order.buyerId ?? t("unknown-customer");
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedOrder(order);
                      setDetailsOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  </TableCell>

                  <TableCell>
                    {(() => {
                      const orderStatus = order.status?.toLowerCase() || order.payment?.status?.toLowerCase() || "";
                      const isAccepted = orderStatus === "confirmed" || orderStatus === "accepted";
                      const isRejected = orderStatus === "rejected";
                      const isShipped = orderStatus === "shipped";
                      const isCompleted = orderStatus === "completed" || orderStatus === "complete";
                      const isDelivered = orderStatus === "delivered";

                      if (isRejected) {
                        return (
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                            <X className="h-3 w-3 mr-1" />
                            {t("rejected")}
                          </div>
                        );
                      }

                      if (isCompleted || isDelivered) {
                        return (
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <Check className="h-3 w-3 mr-1" />
                            {isDelivered ? t("delivered") : t("completed")}
                          </div>
                        );
                      }

                      if (isShipped) {
                        return (
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            <Truck className="h-3 w-3 mr-1" />
                            {t("shipped")}
                          </div>
                        );
                      }

                      if (isAccepted) {
                        return (
                          <div className="flex gap-2 items-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              <Check className="h-3 w-3 mr-1" />
                              {t("accepted")}
                            </span>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleMarkShipped(orderId)}
                              disabled={processingOrder === orderId}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Truck className="h-3 w-3 mr-1" />
                              {t("mark-shipped")}
                            </Button>
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
                            {t("accept")}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleAcceptReject(orderId, "rejected")}
                            disabled={processingOrder === orderId}
                          >
                            <X className="h-3 w-3 mr-1" />
                            {t("reject")}
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
          {t("previous")}
        </Button>

        <span className="text-sm">
          {t("page")} {currentPage} {t("of")} {pageCount}
        </span>

        <Button
          variant="outline"
          disabled={currentPage === pageCount}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          {t("next")}
        </Button>
      </div>

      <OrderDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        order={selectedOrder}
      />

    </div>
  );
}
