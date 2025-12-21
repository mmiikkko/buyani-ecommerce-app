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
  currentFilter: string;
  onFilterChange: (value: string) => void;
  currentSort: string;
  onSortChange: (value: string) => void;
  onSearchChange: (value: string) => void;
};

export function SellerOrdersSearchbar({
  currentFilter,
  onFilterChange,
  currentSort,
  onSortChange,
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
          <Button variant="outline" className="flex items-center gap-2 text-[#717182] min-w-[140px] justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>
                {currentFilter === "all" ? t("all") :
                  currentFilter === "pending" ? t("order-status-pending") :
                    currentFilter === "confirmed" ? t("accepted") :
                      currentFilter === "cancelled" ? t("cancelled") :
                        currentFilter === "shipped" ? t("shipped") :
                          currentFilter === "delivered" ? t("delivered") :
                            currentFilter === "walk-in" ? t("walk-in") :
                              t("filter")}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="bottom" align="start" sideOffset={8} className="z-[9999] min-w-[140px]">
          <DropdownMenuItem onClick={() => onFilterChange("all")} className="flex items-center justify-between">
            <span>{t("all")}</span>
            {currentFilter === "all" && <Check className="h-4 w-4 text-[#2E7D32]" />}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onFilterChange("pending")} className="flex items-center justify-between">
            <span>{t("order-status-pending")}</span>
            {currentFilter === "pending" && <Check className="h-4 w-4 text-[#2E7D32]" />}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onFilterChange("confirmed")} className="flex items-center justify-between">
            <span>{t("accepted")}</span>
            {currentFilter === "confirmed" && <Check className="h-4 w-4 text-[#2E7D32]" />}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onFilterChange("shipped")} className="flex items-center justify-between">
            <span>{t("shipped")}</span>
            {currentFilter === "shipped" && <Check className="h-4 w-4 text-[#2E7D32]" />}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onFilterChange("delivered")} className="flex items-center justify-between">
            <span>{t("delivered")}</span>
            {currentFilter === "delivered" && <Check className="h-4 w-4 text-[#2E7D32]" />}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onFilterChange("cancelled")} className="flex items-center justify-between">
            <span>{t("cancelled")}</span>
            {currentFilter === "cancelled" && <Check className="h-4 w-4 text-[#2E7D32]" />}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onFilterChange("walk-in")} className="flex items-center justify-between">
            <span>{t("walk-in")}</span>
            {currentFilter === "walk-in" && <Check className="h-4 w-4 text-[#2E7D32]" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sort Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 text-[#717182] min-w-[160px] justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 rotate-90" />
              <span>
                {currentSort === "date-desc" ? t("date-newest") :
                  currentSort === "date-asc" ? t("date-oldest") :
                    currentSort === "amount-desc" ? t("amount-highest") :
                      currentSort === "amount-lowest" ? t("amount-lowest") :
                        t("sort")}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="bottom" align="end" sideOffset={8} className="z-[9999] min-w-[160px]">
          <DropdownMenuItem onClick={() => onSortChange("date-desc")} className="flex items-center justify-between">
            <span>{t("date-newest")}</span>
            {currentSort === "date-desc" && <Check className="h-4 w-4 text-[#2E7D32]" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("date-asc")} className="flex items-center justify-between">
            <span>{t("date-oldest")}</span>
            {currentSort === "date-asc" && <Check className="h-4 w-4 text-[#2E7D32]" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("amount-desc")} className="flex items-center justify-between">
            <span>{t("amount-highest")}</span>
            {currentSort === "amount-desc" && <Check className="h-4 w-4 text-[#2E7D32]" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("amount-lowest")} className="flex items-center justify-between">
            <span>{t("amount-lowest")}</span>
            {currentSort === "amount-lowest" && <Check className="h-4 w-4 text-[#2E7D32]" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
