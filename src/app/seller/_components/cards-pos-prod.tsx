"use-client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/input";


export function CardsPosProd() {
  return (
    <Card className="flex flex-col w-full border-1 shadow-md">
      <CardHeader className="pb-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchInput placeholder="Search products..." className="bg-[#f3f3f5]"/>
        </div>
      </CardHeader>
      <CardContent>{/* Content goes here */}</CardContent>
    </Card>
  );
}
