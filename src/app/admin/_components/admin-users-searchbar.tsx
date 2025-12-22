"use client";

import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, ChevronDown, Check, Tag } from "lucide-react";

export type FilterOption = {
  value: string;
  label: string;
};

type Category = {
  id: string;
  categoryName: string;
};

type AdminSearchbarProps = {
  placeholder: string;
  filterOptions: FilterOption[];
  onFilterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onCategoryChange: (categoryId: string | null) => void;
};

export function AdminSearchbar({
  placeholder,
  filterOptions,
  onFilterChange,
  onSearchChange,
  onCategoryChange,
}: AdminSearchbarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
  
        const data: Category[] = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Category fetch error:", err);
      }
    };
  
    fetchCategories();
  }, []);
  

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    onCategoryChange(categoryId);
  };

  return (
    <div className="flex items-center justify-center mb-0 gap-4 p-5 mx-5 bg-white rounded-md shadow-md">
      {/* Search Bar */}
      <div className="flex flex-row w-full bg-[#f3f3f5] rounded-md">
        <SearchInput
          placeholder={placeholder}
          className="w-full bg-[#f3f3f5]"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Category Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 text-[#717182]">
          <Tag className="h-4 w-4" />
          {selectedCategory
            ? categories.find(c => c.id === selectedCategory)?.categoryName
            : "Category"}
          <ChevronDown className="h-4 w-4" />
        </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="bottom" align="start" sideOffset={8}>
          <DropdownMenuItem onClick={() => handleCategorySelect(null)}>
            <Check className="mr-2 h-4 w-4 text-transparent" />
            All Categories
          </DropdownMenuItem>

          {categories.map((cat) => (
            <DropdownMenuItem
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
            >
              <Check
                className={`mr-2 h-4 w-4 ${
                  selectedCategory === cat.id
                    ? "text-[#2E7D32]"
                    : "text-transparent"
                }`}
              />
              {cat.categoryName}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center cursor-pointer gap-2 text-[#717182]"
          >
            <Filter className="h-4 w-4" /> Filter <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="bottom" align="start" sideOffset={8}>
          {filterOptions.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => onFilterChange(opt.value)}
            >
              <Check className="mr-2 h-4 w-4 text-[#2E7D32]" />
              {opt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
