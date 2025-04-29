import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddCategoryModal() {
  const [categoryName, setCategoryName] = useState("");
  const [open, setOpen] = useState(false);

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      alert("Category name is required.");
      return;
    }

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: categoryName }),
      });

      if (!response.ok) throw new Error("Failed to add category");
      alert("Category added successfully!");
      setCategoryName("");
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("An error occurred while adding the category.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Category</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Add Category
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 py-2">
          <label
            htmlFor="category"
            className="text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <Input
            id="category"
            placeholder="Input Category"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddCategory}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
