"use client";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Dialog,
} from "@/components/ui/dialog";
import { useAction } from "next-safe-action/hooks";
import { deleteSubjectAction } from "./action";
import { toast } from "sonner";

export default function DeleteSubjectDialog({
  id,
  open,
  onOpenChange,
}: {
  id: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { executeAsync, isExecuting } = useAction(deleteSubjectAction);
  const handleSubmit = async () => {
    const { data } = await executeAsync({ id });
    if (data) {
      toast.success("Subject deleted successfully");
      onOpenChange(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Subject</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this subject?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <DialogClose
            render={
              <Button
                type="submit"
                variant="destructive"
                onClick={handleSubmit}
                disabled={isExecuting}
              >
                Delete
              </Button>
            }
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
