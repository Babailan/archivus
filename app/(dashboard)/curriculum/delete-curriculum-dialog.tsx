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
import { toast } from "sonner";

export default function DeleteCurriculumDialog({ id }: { id: number }) {
  const { executeAsync } = useAction(deleteCurriculumAction);
  const handleSubmit = async () => {
    const { data } = await executeAsync({ id });
    if (data) {
      toast.success("Curriculum deleted successfully");
    }
  };
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="destructive" className="w-full justify-start">
            Delete
          </Button>
        }
      ></DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Curriculum</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this curriculum?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <DialogClose
            render={
              <Button
                type="submit"
                variant={"destructive"}
                onClick={handleSubmit}
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
