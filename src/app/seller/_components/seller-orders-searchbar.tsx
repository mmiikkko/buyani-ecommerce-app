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
import { useLanguage } from "@/lib/i18n/context";

type SellerOrdersSearchbarProps = {
  onFilterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
};

export function SellerOrdersSearchbar({
  onFilterChange,
  onSearchChange,
}: SellerOrdersSearchbarProps) {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-center mb-0 gap-4 p-5 bg-white rounded-md shadow-md">
      {/* Search Bar */}
      <div className="flex flex-row w-full bg-[#f3f3f5] rounded-md">
        <SearchInput
          placeholder={t("search-order-placeholder")}
          className="w-full bg-[#f3f3f5]"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 text-[#717182]">
            <Filter className="h-4 w-4" /> {t("filter")} <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="bottom" align="start" sideOffset={8} className="z-[9999]">
          <DropdownMenuItem onClick={() => onFilterChange("all")}>
            <Check className="mr-2 h-4 w-4 text-[#2E7D32]" /> {t("all")}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onFilterChange("pending")}>
            {t("order-status-pending")}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onFilterChange("confirmed")}>
            {t("completed")}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onFilterChange("cancelled")}>
            {t("cancelled")}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onFilterChange("shipped")}>
            {t("shipped")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
