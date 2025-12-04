"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

export function FrequentBought() {
  const [item, setItem] = useState<{
    productName: string;
    totalSold: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/sellers/analytics")
      .then(res => res.json())
      .then(res => setItem(res.topItem));
  }, []);

  return (
    <div className="min-w-[45%] mr-5">
      <Card>
        <CardHeader>
          <h1 className="font-bold">Most Bought Item</h1>
          <CardDescription>Last 30 days</CardDescription>
        </CardHeader>

        <CardContent>
          {item ? (
            <>
              <p className="text-lg font-semibold">{item.productName}</p>
              <p className="text-sm text-muted-foreground">
                Sold: <span className="font-bold">{item.totalSold}</span>
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No sales data available
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
