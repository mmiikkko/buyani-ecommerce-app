"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { TrendingUp } from "lucide-react";
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

export function ChartAreaIcons() {
  const [data, setData] = useState<
    { day: string; total: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/sellers/analytics");
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
    };

    fetchData();
  }, []);

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <CardTitle className="text-xl">Sales Trend</CardTitle>
            <CardDescription className="mt-1">
              Items sold over the last 30 days
            </CardDescription>
          </div>
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
