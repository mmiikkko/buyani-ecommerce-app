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

export type Order = {
  id: string;
  customer: string;
  date: string;

  // NEW FIELDS
  productName: string;
  img: string;
  quantity: number;

  amount: string;
  payment: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  type: string;
};

export function OrdersTabsTable({
  ordersData,
  filter,
  search,
}: {
  ordersData: Order[];
  filter: string;
  search: string;
}) {
  return (
    <div className="w-full p-6 bg-green-50 min-h-screen">
      <OrdersTable orders={ordersData} filter={filter} search={search} />
    </div>
  );
}

function OrdersTable({
  orders,
  filter,
  search,
}: {
  orders: Order[];
  filter: string;
  search: string;
}) {
  // Apply filtering + search
  const filteredOrders = (orders ?? []).filter((order) => {
    // FILTER by status
    if (filter !== "all" && order.status !== filter) return false;

    // SEARCH by id, customer, product name
    if (search.trim() !== "") {
      const s = search.toLowerCase();
      if (
        !order.id.toLowerCase().includes(s) &&
        !order.customer.toLowerCase().includes(s) &&
        !order.productName.toLowerCase().includes(s)
      ) {
        return false;
      }
    }

    return true;
  });

  // Pagination logic
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
      {/* EMPTY STATE */}
      {filteredOrders.length === 0 && (
        <div className="w-full text-center py-6 text-muted-foreground border rounded-md bg-white">
          No orders found.
        </div>
      )}

      {/* TABLE */}
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
            {currentRows.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>

                <TableCell>
                  <div className="flex flex-col">
                    <span>{order.customer}</span>
                    <span className="text-xs text-muted-foreground">
                      {order.date}
                    </span>
                  </div>
                </TableCell>

                {/* PRODUCT NAME + IMAGE */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img
                      src={order.img}
                      alt={order.productName}
                      className="w-10 h-10 rounded-md object-cover border"
                    />
                    <span className="font-medium">{order.productName}</span>
                  </div>
                </TableCell>

                {/* QUANTITY */}
                <TableCell>{order.quantity}</TableCell>

                <TableCell>{order.amount}</TableCell>
                <TableCell>{order.payment}</TableCell>

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
                  <Button variant="ghost" size="icon" className="cursor-pointer">
                    <Eye className="h-4 w-4" />
                  </Button>

                  {order.status === "pending" && (
                    <>
                      <Button className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 cursor-pointer">
                        Confirm
                      </Button>
                      <Button className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 cursor-pointer">
                        Cancel
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* PAGINATION */}
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
