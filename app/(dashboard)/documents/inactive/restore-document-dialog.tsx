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
import { restoreDocumentAction } from "./action";
import { useAction } from "next-safe-action/hooks";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface RestoreDocumentDialogProps {
  id: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RestoreDocumentDialog({
  id,
  open,
  onOpenChange,
}: RestoreDocumentDialogProps) {
  const { execute, isExecuting } = useAction(restoreDocumentAction);

  const handleRestore = () => {
    const formData = new FormData();
    formData.append("id", id.toString());

    execute(formData);
    toast.success("Document restored successfully");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Restore Document</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to restore this document? It will be available
            again in the active documents list.
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
