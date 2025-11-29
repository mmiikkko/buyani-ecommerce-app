"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

export function AdminCategories() {
  const [categories, setCategories] = useState(["Fruits", "Handmade", "Snacks"]);
  const [newCat, setNewCat] = useState("");

  const addCategory = () => {
    if (!newCat.trim()) return;
    setCategories((prev) => [...prev, newCat]);
    setNewCat("");
  };

  const deleteCategory = (cat: string) => {
    setCategories((prev) => prev.filter((c) => c !== cat));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Categories</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {categories.map((cat) => (
          <div key={cat} className="flex items-center justify-between border p-3 rounded-lg">
            <span>{cat}</span>
            <Button variant="destructive" size="icon" className="cursor-pointer" onClick={() => deleteCategory(cat)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>

      <CardFooter className="flex gap-3">
        <Input
          placeholder="New category..."
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
        />
        <Button className="cursor-pointer" onClick={addCategory}>Add</Button>
      </CardFooter>
    </Card>
  );
}
