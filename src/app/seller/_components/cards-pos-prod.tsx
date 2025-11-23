"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/input";

export function CardsPosProd() {
  const hasProducts = false; // <= change this later when you load real data

  return (
    <Card className="flex flex-col w-full border-1 shadow-md">
      <CardHeader className="pb-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchInput
            placeholder="Search products..."
            className="bg-[#f3f3f5]"
          />
        </div>
      </CardHeader>

      <CardContent className="min-h-[200px] flex items-center justify-center">
        {!hasProducts ? (
          <p className="text-gray-500 text-center">
            You have no listed products yet.
          </p>
        ) : (
          <div>{/* Product cards go here */}</div>
        )}
      </CardContent>
    </Card>
  );
}
