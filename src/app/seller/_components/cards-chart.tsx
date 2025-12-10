"use client";

import { useEffect, useState, useCallback } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { TrendingUp, Calendar } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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

export function ChartAreaIcons() {
  const [data, setData] = useState<
    { day: string; total: number }[]
  >([]);
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
        setData(result.chart ?? []);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setData([]);
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
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Sales Trend</CardTitle>
              <CardDescription className="mt-1">
                Items sold {selectedRangeLabel.toLowerCase()}
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
                  className={dateRange === option.value ? "bg-emerald-50" : ""}
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
            <p className="text-sm text-muted-foreground">Loading chart data...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              No sales data available for the last 30 days
            </p>
          </div>
        ) : (
          <ChartContainer config={{
            total: {
              label: "Items Sold",
              color: "hsl(142, 76%, 36%)",
              icon: TrendingUp,
            },
          }}>
            <AreaChart data={data}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-slate-200" />
              <XAxis
                dataKey="day"
                tickFormatter={(v) =>
                  new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }
                className="text-xs"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                dataKey="total"
                type="monotone"
                stroke="hsl(142, 76%, 36%)"
                fill="hsl(142, 76%, 36%)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
