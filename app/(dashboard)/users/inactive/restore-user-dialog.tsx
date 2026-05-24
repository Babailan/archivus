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
import { restoreUserAction } from "./action";
import { useAction } from "next-safe-action/hooks";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface RestoreUserDialogProps {
  id: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RestoreUserDialog({
  id,
  open,
  onOpenChange,
}: RestoreUserDialogProps) {
  const { execute, isExecuting } = useAction(restoreUserAction);

  const handleRestore = () => {
    const formData = new FormData();
    formData.append("id", id.toString());

    execute(formData);
    toast.success("User restored successfully");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Restore User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to restore this user? They will be able to log in again.
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
