"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { restoreCurriculumAction } from "./action";
import { useAction } from "next-safe-action/hooks";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface RestoreCurriculumDialogProps {
  id: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RestoreCurriculumDialog({
  id,
  open,
  onOpenChange,
}: RestoreCurriculumDialogProps) {
  const { execute, isExecuting } = useAction(restoreCurriculumAction);

  const handleRestore = () => {
    const formData = new FormData();
    formData.append("id", id.toString());

    execute(formData);
    toast.success("Curriculum restored successfully");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Restore Curriculum</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to restore this curriculum? It will be
            available again in the active curriculum list.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRestore} disabled={isExecuting}>
            {isExecuting && <Spinner className="w-4 h-4 mr-2" />}
            Restore
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
