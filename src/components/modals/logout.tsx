import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LogoutPage {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function Logout({ open, onClose, onConfirm }: LogoutPage) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-6 rounded-lg">
        <DialogHeader>
          <DialogTitle>Logout</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Are you sure you want to logout?
          </p>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
