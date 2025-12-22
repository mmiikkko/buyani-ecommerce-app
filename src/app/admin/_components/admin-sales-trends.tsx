"use client";

import { useEffect, useState, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp, Calendar, Star, Store, Filter } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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

interface Shop {
  id: string;
  name: string;
}

const CustomTooltip = ({ active, payload, viewMode }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
        <p className="text-sm font-medium text-slate-900 mb-1">
          {new Date(payload[0].payload.day).toLocaleDateString("en-US", { 
            month: "short", 
            day: "numeric",
            year: "numeric"
          })}
        </p>
        <p className="text-sm text-emerald-600 font-semibold">
          {viewMode === "revenue" 
            ? `₱${Number(payload[0].value).toFixed(2)}`
            : `${payload[0].value} units`
          }
        </p>
      </div>
    );
  }
  return null;
};

export default function AdminSalesTrends() {
  const [chartData, setChartData] = useState<
    { day: string; total: number; revenue: number }[]
  >([]);
  const [topItem, setTopItem] = useState<{
    productName: string;
    totalSold: number;
    shopName?: string;
  } | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>("30");
  const [viewMode, setViewMode] = useState<"quantity" | "revenue">("revenue");

  // Fetch shops list
  const fetchShops = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/shops");
      if (res.ok) {
        const result = await res.json();
        setShops(result.shops ?? []);
      }
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  }, []);

  // Fetch analytics data
  const fetchData = useCallback(async (range: DateRange, shopId: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (range !== "all") {
        params.append("days", range);
      }
      if (shopId !== "all") {
        params.append("shopId", shopId);
      }
      
      const res = await fetch(`/api/admin/analytics?${params.toString()}`);
      if (res.ok) {
        const result = await res.json();
        setChartData(result.chart ?? []);
        setTopItem(result.topItem ?? null);
      } else {
        setChartData([]);
        setTopItem(null);
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      setChartData([]);
      setTopItem(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  useEffect(() => {
    fetchData(dateRange, selectedShop);
  }, [dateRange, selectedShop, fetchData]);

  const selectedRangeLabel = dateRangeOptions.find(opt => opt.value === dateRange)?.label || "Last 30 days";
  const selectedShopName = shops.find(s => s.id === selectedShop)?.name || "All Shops";

  return (
    <section className="relative min-h-screen min-w-full overflow-hidden space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-xl p-6 border border-emerald-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-600 rounded-lg shadow-md">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Sales Trends
              </h1>
              <p className="text-sm text-gray-600">
                Monitor sales throughout BuyAni.
              </p>
            </div>
          </div>
          
          {/* Shop Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {selectedShopName}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => setSelectedShop("all")}
                className={selectedShop === "all" ? "bg-emerald-50" : ""}
              >
                All Shops
              </DropdownMenuItem>
              {shops.map((shop) => (
                <DropdownMenuItem
                  key={shop.id}
                  onClick={() => setSelectedShop(shop.id)}
                  className={selectedShop === shop.id ? "bg-emerald-50" : ""}
                >
                  {shop.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Analytics Chart */}
      <Card className="w-full transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Analytics Trend</CardTitle>
                <CardDescription className="mt-1">
                  {viewMode === "revenue" ? "Total Revenue" : "Items Sold"} {selectedRangeLabel.toLowerCase()}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <Button
                  variant={viewMode === "revenue" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("revenue")}
                  className={`text-xs h-8 ${viewMode === "revenue" ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" : "hover:bg-emerald-50 text-slate-600"}`}
                >
                  Revenue
                </Button>
                <Button
                  variant={viewMode === "quantity" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("quantity")}
                  className={`text-xs h-8 ${viewMode === "quantity" ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" : "hover:bg-emerald-50 text-slate-600"}`}
                >
                  Quantity
                </Button>
              </div>
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
                      onClick={() => setDateRange(option.value)}
                      className={dateRange === option.value ? "bg-emerald-50" : ""}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-muted-foreground">Loading chart data...</p>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                No sales data available for the selected period
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="day"
                  tickFormatter={(v) =>
                    new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tickFormatter={(v) => viewMode === "revenue" ? `₱${v}` : v}
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />
                <Tooltip content={<CustomTooltip viewMode={viewMode} />} />
                <Area
                  type="monotone"
                  dataKey={viewMode === "revenue" ? "revenue" : "total"}
                  stroke="hsl(142, 76%, 36%)"
                  fill="hsl(142, 76%, 36%)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Most Bought Item */}
      <Card className="w-full transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Star className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Most Bought Item</CardTitle>
              <CardDescription className="mt-1">
                Top selling product {selectedRangeLabel.toLowerCase()}
                {selectedShop !== "all" && ` in ${selectedShopName}`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-muted-foreground">Loading data...</p>
            </div>
          ) : topItem ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-emerald-50 border border-amber-100">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-amber-600" />
                  <p className="text-lg font-bold text-slate-900">{topItem.productName}</p>
                </div>
                {topItem.shopName && (
                  <p className="text-xs text-muted-foreground mb-2">
                    from {topItem.shopName}
                  </p>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-muted-foreground">Total Sold:</span>
                  <span className="text-2xl font-bold text-[#2E7D32]">{topItem.totalSold}</span>
                  <span className="text-sm text-muted-foreground">units</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Star className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                No sales data available
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}