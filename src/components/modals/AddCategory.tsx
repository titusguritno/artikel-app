"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AddCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (categoryName: string) => void;
}

export default function AddCategoryDialog({
  open,
  onClose,
  onSubmit,
}: AddCategoryDialogProps) {
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!categoryName.trim()) {
      setError("Category name is required.");
      return;
    }

    setError(""); // clear error
    onSubmit(categoryName);
    setCategoryName("");
    onClose();
  };

  const handleCancel = () => {
    setCategoryName("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-2">
          <label className="text-sm font-medium">Category</label>
          <Input
            placeholder="Input Category"
            value={categoryName}
            onChange={(e) => {
              setCategoryName(e.target.value);
              if (error) setError("");
            }}
            className={error ? "border-red-500" : ""}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
