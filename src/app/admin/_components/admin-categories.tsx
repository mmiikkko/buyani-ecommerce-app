"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, RefreshCw, Tag, Plus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/types/categories";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCat, setNewCat] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/categories");
      
      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }
      
      const data: Category[] = await res.json();
      setCategories(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async () => {
    if (!newCat.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      setAdding(true);
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryName: newCat.trim() }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add category");
      }

      const newCategory: Category = await res.json();
      setCategories((prev) => [...prev, newCategory]);
      setNewCat("");
      toast.success("Category added successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add category";
      toast.error(errorMessage);
    } finally {
      setAdding(false);
    }
  };

  const deleteCategory = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      return;
    }

    try {
      setDeleting(categoryId);
      const res = await fetch(`/api/categories?id=${categoryId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete category");
      }

      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      toast.success("Category deleted successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete category";
      toast.error(errorMessage);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Card className="shadow-md border border-gray-200">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Tag className="h-5 w-5 text-emerald-600" />
            Manage Categories
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchCategories()}
            disabled={loading}
            className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {loading && (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-4">
            <p className="text-red-600 mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={() => fetchCategories()}>
              Try again
            </Button>
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
            <Tag className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium mb-1">No categories found</p>
            <p className="text-sm text-gray-500">Add your first category below</p>
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className="flex items-center justify-between border border-gray-200 p-4 rounded-lg bg-white hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Tag className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span className="font-medium text-gray-800 truncate">{cat.categoryName}</span>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="cursor-pointer ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deleteCategory(cat.id, cat.categoryName)}
                  disabled={deleting === cat.id}
                >
                  {deleting === cat.id ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-3 bg-gray-50 border-t">
        <Input
          placeholder="Enter new category name..."
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !adding) {
              addCategory();
            }
          }}
          disabled={adding}
          className="flex-1"
        />
        <Button
          className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={addCategory}
          disabled={adding || !newCat.trim()}
        >
          {adding ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
