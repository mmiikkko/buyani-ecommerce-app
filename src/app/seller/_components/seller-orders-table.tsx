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
  // Prepare search-friendly fields
  const filteredOrders = (orders ?? []).filter((order) => {
    const firstItem = order.items[0];
    const productName = firstItem?.product?.productName ?? "";
    const customer = order.buyerId; // since no customer name exists

    if (filter !== "all" && order.status !== filter) return false;

    if (search.trim() !== "") {
      const s = search.toLowerCase();
      if (
        !order.id.toLowerCase().includes(s) &&
        !customer.toLowerCase().includes(s) &&
        !productName.toLowerCase().includes(s)
      ) {
        return false;
      }
    }

    return true;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const pageCount = Math.max(
    1,
    Math.ceil(filteredOrders.length / rowsPerPage)
  );

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
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentRows.map((order) => {
              const firstItem = order.items[0];
              const product = firstItem?.product;
              const img = product?.images?.[0]?.image_url?.[0];
              const productName = product?.productName ?? "Unknown";

              return (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>

                  {/* CUSTOMER = buyerId (you do not have customer table yet) */}
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{order.buyerId}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>

                  {/* PRODUCT */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {img && (
                        <img
                          src={img}
                          alt={productName}
                          className="w-10 h-10 rounded-md object-cover border"
                        />
                      )}
                      <span className="font-medium">{productName}</span>
                    </div>
                  </TableCell>

                  {/* QUANTITY */}
                  <TableCell>{firstItem?.quantity ?? 0}</TableCell>

                  {/* TOTAL AMOUNT */}
                  <TableCell>{order.total ?? 0}</TableCell>

                  {/* PAYMENT */}
                  <TableCell>
                    {order.payment?.paymentMethod ?? "N/A"}
                  </TableCell>

                  {/* STATUS */}
                  <TableCell>
                    <span
                      className={`text-xs px-2 py-1 rounded-full capitalize ${
                        order.status === "pending"
                          ? "bg-orange-100 text-orange-700"
                          : order.status === "shipped"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "confirmed"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs bg-black text-white px-2 py-1 rounded-full">
                      {order.type}
                    </span>
                  </TableCell>

                  <TableCell className="flex gap-2 items-center">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>

                    {order.status === "pending" && (
                      <>
                        <Button 
                          className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
                          onClick={() => onStatusUpdate?.(order.id, "confirmed")}
                        >
                          Confirm
                        </Button>
                        <Button 
                          className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1"
                          onClick={() => onStatusUpdate?.(order.id, "cancelled")}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    {order.status === "confirmed" && (
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1"
                        onClick={() => onStatusUpdate?.(order.id, "shipped")}
                      >
                        Ship
                      </Button>
                    )}
                    {order.status === "shipped" && (
                      <Button 
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1"
                        onClick={() => onStatusUpdate?.(order.id, "delivered")}
                      >
                        Mark Delivered
                      </Button>
                    )}
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
