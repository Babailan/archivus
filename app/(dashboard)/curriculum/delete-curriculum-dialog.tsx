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
import { deleteCurriculumAction } from "./action";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function DeleteCurriculumDialog({ id }: { id: number }) {
  const { executeAsync, result, isExecuting } = useAction(
    deleteCurriculumAction,
  );
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { data } = await executeAsync({ id });
    if (data) {
      toast.success("Curriculum deleted successfully");
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
          <DialogTitle>Delete Curriculum</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this curriculum?
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
