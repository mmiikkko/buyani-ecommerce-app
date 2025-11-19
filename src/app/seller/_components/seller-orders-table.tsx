"use client"

import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
  } from "@/components/ui/tabs"
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Button } from "@/components/ui/button"
  import { Eye } from "lucide-react"
  
  export function OrdersTabsTable() {
    return (
      <div className="w-full p-6 bg-green-50 min-h-screen">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 w-max bg-green-100 rounded-xl p-1 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
          </TabsList>
  
          <TabsContent value="all">
            <OrdersTable/>
          </TabsContent>
          <TabsContent value="pending">
            <OrdersTable filter="pending" />
          </TabsContent>
          <TabsContent value="confirmed">
            <OrdersTable filter="confirmed" />
          </TabsContent>
          <TabsContent value="shipped">
            <OrdersTable filter="shipped" />
          </TabsContent>
        </Tabs>
      </div>
    )
  }
  
  const orders = [
    {
      id: "ORD-001",
      customer: "Salamat, Martin Lewis",
      date: "2025-01-08 10:30 AM",
      products: 2,
      amount: "₱265",
      payment: "GCash",
      status: "pending",
      type: "online",
      action: "Confirm",
    },
    {
      id: "ORD-002",
      customer: "Azied, Jayece",
      date: "2025-01-08 09:15 AM",
      products: 1,
      amount: "₱250",
      payment: "Cash on Delivery",
      status: "shipped",
      type: "online",
      action: "Ship",
    },
    {
      id: "POS-001",
      customer: "Walk-in Customer",
      date: "2025-01-08 11:00 AM",
      products: 1,
      amount: "₱75",
      payment: "Cash",
      status: "delivered",
      type: "in-store",
      action: null,
    },
  ]
  
  function OrdersTable({ filter }: { filter?: string }) {
    const visibleOrders = filter
      ? orders.filter((o) => o.status === filter)
      : orders
  
    return (
      <Table className="bg-white rounded-xl shadow-sm">
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{order.customer}</span>
                  <span className="text-xs text-muted-foreground">{order.date}</span>
                </div>
              </TableCell>
              <TableCell>{order.products} item(s)</TableCell>
              <TableCell>{order.amount}</TableCell>
              <TableCell>{order.payment}</TableCell>
              <TableCell>
                <span
                  className={`text-xs px-2 py-1 rounded-full capitalize ${
                    order.status === "pending"
                      ? "bg-orange-100 text-orange-700"
                      : order.status === "shipped"
                      ? "bg-blue-100 text-blue-700"
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
                {order.action && (
                  <Button
                    size="sm"
                    className={
                      order.action === "Confirm"
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-orange-500 hover:bg-orange-600 text-white"
                    }
                  >
                    {order.action}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
  