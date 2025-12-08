"use client";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { DollarSign, ShoppingCart, Clock, Package, TrendingUp } from "lucide-react";

interface CardActivityProps {
  totalSales?: number | string;
  totalOrders?: number | string;
  pendingOrders?: number | string;
  totalProducts?: number | string;
}

export function CardActivity({
  totalSales,
  totalOrders,
  pendingOrders,
  totalProducts,
}: CardActivityProps) {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* Total Sales */}
      <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-emerald-100">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16" />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-lg bg-emerald-500/10">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
          <p className="text-2xl font-bold text-[#2E7D32]">{totalSales ?? "₱0.00"}</p>
        </CardContent>
      </Card>

      {/* Total Orders */}
      <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-blue-100">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16" />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-lg bg-blue-500/10">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
          <p className="text-2xl font-bold text-blue-600">{totalOrders ?? 0}</p>
        </CardContent>
      </Card>

      {/* Pending Orders */}
      <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-amber-100">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16" />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-lg bg-amber-500/10">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
          <p className="text-2xl font-bold text-amber-600">{pendingOrders ?? 0}</p>
        </CardContent>
      </Card>

      {/* Total Products */}
      <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-purple-100">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16" />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-lg bg-purple-500/10">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Total Products</p>
          <p className="text-2xl font-bold text-purple-600">{totalProducts ?? 0}</p>
        </CardContent>
      </Card>
    </div>
  );
}
