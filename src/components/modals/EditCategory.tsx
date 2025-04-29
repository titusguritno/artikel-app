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
  onSubmit: () => void;
  categoryName: string;
  onSendData: (name: string) => void;
}

export default function EditCategoryDialog({
  open,
  onClose,
  onSubmit,
  categoryName,
  onSendData,
}: AddCategoryDialogProps) {
  const [edited, setEdited] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      setError("Category name is required.");
      return;
    }

    setError("");
    onSubmit();
    setEdited("");
    onClose();
  };

  const handleCancel = () => {
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-2">
          <label className="text-sm font-medium">Category</label>
          <Input
            placeholder="Input Category"
            defaultValue={categoryName}
            onChange={(e) => {
              setEdited(e.target.value);
              onSendData(e.target.value);
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
          <Button onClick={handleSubmit}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
