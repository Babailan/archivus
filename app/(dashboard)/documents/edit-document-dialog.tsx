"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { updateDocumentAction } from "./action";
import { useAction } from "next-safe-action/hooks";
import React from "react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function EditDocumentDialog({
  id,
  name,
  description,
  open,
  onOpenChange,
}: {
  id: number;
  name: string;
  description: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { isExecuting, executeAsync } = useAction(updateDocumentAction);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    console.log("Update docs");
    const formdata = new FormData(e.currentTarget);
    const validateForm = new FormData();
    validateForm.append("id", id.toString());
    if (formdata.get("name") !== name) {
      validateForm.append("name", formdata.get("name") as string);
    }
    if (formdata.get("description") !== (description ?? "")) {
      validateForm.append("description", formdata.get("description") as string);
    }
    const result = await executeAsync(validateForm);
    if (result.data) {
      toast.success("Document updated successfully", {
        description: format(new Date(), "MMM, d yyyy"),
      });
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit}>
          <FieldSet className="gap-2">
            <Field>
              <FieldLabel>Document Name</FieldLabel>
              <Input name="name" defaultValue={name} />
            </Field>
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea name="description" defaultValue={description ?? ""} />
            </Field>
            <DialogFooter>
              <DialogDescription>
                Update the document name or description.
              </DialogDescription>
            </DialogFooter>
            <Button
              type="submit"
              className="w-full mt-2"
              disabled={isExecuting}
            >
              {isExecuting ? "Updating..." : "Update Document"}
            </Button>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  );
}
