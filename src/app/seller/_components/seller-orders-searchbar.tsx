"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { SearchInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, ChevronDown, Check } from "lucide-react";

export function SellerProductsSearchbar() {
    return (
        <div className="flex flex-row justify-center gap-3 space-x-4 mt-auto p-5 bg-white rounded-md shadow-md">

        <div className="flex flex-row min-w-[90%] max-w-[100%] bg-[#f3f3f5] rounded-md">
          <SearchInput placeholder="Search by order ID or customer name" className="min-w-[100%] max-w-[120%] bg-[#f3f3f5]" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* ✅ wrap everything in ONE element */}
            <Button
              variant="outline"
              className="flex items-center gap-2 text-[#717182]"
            >
              <Filter className="h-4 w-4" />
              Filter
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="bottom"
            align="start"
            sideOffset={8}
            className="z-[9999]"
          >
            <DropdownMenuItem>
              <Check className="mr-2 h-4 w-4 text-[#2E7D32]" /> All
            </DropdownMenuItem>
            <DropdownMenuItem>Pending</DropdownMenuItem>
            <DropdownMenuItem>Completed</DropdownMenuItem>
            <DropdownMenuItem>Cancelled</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );

}