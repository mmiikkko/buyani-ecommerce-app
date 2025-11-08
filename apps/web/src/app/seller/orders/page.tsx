"use client";
import { Input, SearchInput } from "@/components/ui/input";
import { Search, Filter, ChevronDown, Check , Download} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button"; // ✅ Add this import for a clean button look

export default function Orders() {
  return (
    <section className="relative min-h-screen min-w-full overflow-hidden space-y-5 mt-18 mx-3">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <h1 className="text-xl mb-1 font-bold text-[#2E7D32]">Orders</h1>
          <p>Manage your online and in-store orders</p>
        </div>
        <div className="flex flex-col justify-center">
          <Button 
            variant="export"
            className="cursor-pointer"
          >
          <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="flex flex-row gap-2 justify-between space-x-4 mt-auto p-5 bg-white rounded-md shadow-md">

        <div className="flex flex-row bg-[#f3f3f5] rounded-md">
          <SearchInput placeholder="Search by order ID or customer name" className="bg-[#f3f3f5]" />
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
    </section>
  );
}
