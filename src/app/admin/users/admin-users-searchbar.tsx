"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, ChevronDown, Check } from "lucide-react";

export type FilterOption = {
  value: string;
  label: string;
};

type AdminSearchbarProps = {
  placeholder: string;
  filterOptions: FilterOption[];
  onFilterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
};

export function AdminSearchbar({
  placeholder,
  filterOptions,
  onFilterChange,
  onSearchChange,
}: AdminSearchbarProps) {
  return (
    <div className="flex items-center justify-center mb-0 gap-4 p-5 bg-white rounded-md shadow-md">
      {/* Search Bar */}
      <div className="flex flex-row w-full bg-[#f3f3f5] rounded-md">
        <SearchInput
          placeholder={placeholder}
          className="w-full bg-[#f3f3f5]"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center cursor-pointer gap-2 text-[#717182]">
            <Filter className="h-4 w-4" /> Filter <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="bottom"
          align="start"
          sideOffset={8}
          className="z-[9999]"
        >
          {filterOptions.map((opt) => (
            <DropdownMenuItem key={opt.value} onClick={() => onFilterChange(opt.value)}>
              <Check className="mr-2 h-4 w-4 text-[#2E7D32]" />
              {opt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
