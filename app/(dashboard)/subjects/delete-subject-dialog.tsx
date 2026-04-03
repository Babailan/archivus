"use client";
import { Button } from "@/components/ui/button";
import {
  DialogTrigger,
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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function DeleteSubjectDialog({ id }: { id: number }) {
  const { executeAsync, result, isExecuting } = useAction(deleteSubjectAction);
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { data } = await executeAsync({ id });
    if (data) {
      toast.success("Subject deleted successfully");
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full justify-start">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Subject</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this subject?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="submit"
              variant={"destructive"}
              onClick={handleSubmit}
            >
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
