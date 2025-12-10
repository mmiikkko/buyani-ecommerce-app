"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Star, TrendingUp, Calendar } from "lucide-react";
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

export function FrequentBought() {
  const [item, setItem] = useState<{
    productName: string;
    totalSold: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>("30");

  const fetchData = useCallback(async (range: DateRange) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (range !== "all") {
        params.append("days", range);
      }
      const res = await fetch(`/api/sellers/analytics?${params.toString()}`);
      if (res.ok) {
        const result = await res.json();
        setItem(result.topItem ?? null);
      } else {
        setItem(null);
      }
    } catch (error) {
      console.error("Error fetching top item:", error);
      setItem(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(dateRange);
  }, [dateRange, fetchData]);

  const selectedRangeLabel = dateRangeOptions.find(opt => opt.value === dateRange)?.label || "Last 30 days";

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Star className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Most Bought Item</CardTitle>
              <CardDescription className="mt-1">
                Top selling product {selectedRangeLabel.toLowerCase()}
              </CardDescription>
            </div>
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
                  className={dateRange === option.value ? "bg-amber-50" : ""}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">Loading data...</p>
          </div>
        ) : item ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-emerald-50 border border-amber-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-amber-600" />
                <p className="text-lg font-bold text-slate-900">{item.productName}</p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-muted-foreground">Total Sold:</span>
                <span className="text-2xl font-bold text-[#2E7D32]">{item.totalSold}</span>
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
  );
}
