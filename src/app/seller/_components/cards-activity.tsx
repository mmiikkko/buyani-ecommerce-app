"use client";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { DollarSign, ShoppingCart, Clock, Package, TrendingUp, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

type DateRange = "7" | "30" | "90" | "365" | "all";

const dateRangeOptions: { value: DateRange; label: string }[] = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "365", label: "Last year" },
  { value: "all", label: "All time" },
];

interface CardActivityProps {
  totalSales?: number | string;
  totalOrders?: number | string;
  pendingOrders?: number | string;
  totalProducts?: number | string;
  removedProducts?: number | string;
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange) => void;
}

export function CardActivity({
  totalSales,
  totalOrders,
  pendingOrders,
  totalProducts,
  removedProducts,
  dateRange = "all",
  onDateRangeChange,
}: CardActivityProps) {
  const selectedRangeLabel = dateRangeOptions.find(opt => opt.value === dateRange)?.label || "All time";

  return (
    <div className="space-y-4 w-full">
      {/* Date Range Filter */}
      {onDateRangeChange && (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {selectedRangeLabel}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {dateRangeOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onDateRangeChange?.(option.value)}
                  className={dateRange === option.value ? "bg-emerald-50" : ""}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
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

      {/* Total Products (Active) */}
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
          <p className="text-sm font-medium text-muted-foreground">Active Products</p>
          <p className="text-2xl font-bold text-purple-600">{totalProducts ?? 0}</p>
        </CardContent>
      </Card>

      {/* Removed Products */}
      <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-gray-100">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-500/5 rounded-full -mr-16 -mt-16" />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-lg bg-gray-500/10">
              <Package className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Removed Products</p>
          <p className="text-2xl font-bold text-gray-600">{removedProducts ?? 0}</p>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
