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

  useEffect(() => {
    fetch("/api/sellers/analytics")
      .then(res => res.json())
      .then(res => setData(res.chart ?? []));
  }, []);

  return (
    <Card className="min-w-[45%] ml-5">
      <CardHeader>
        <CardTitle>Sales Trend</CardTitle>
        <CardDescription>
          Items sold (last 30 days)
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={{
          total: {
            label: "Items Sold",
            color: "var(--chart-1)",
            icon: TrendingUp,
          },
        }}>
          <AreaChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickFormatter={(v) =>
                new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="total"
              type="monotone"
              stroke="var(--color-total)"
              fill="var(--color-total)"
              fillOpacity={0.4}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
