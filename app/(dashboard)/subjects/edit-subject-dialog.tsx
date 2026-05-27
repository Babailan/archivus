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
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { updateSubjectAction } from "./action";
import { NumericFormat } from "react-number-format";
import { PesoInput } from "@/components/ui/peso-input";
import { useAction } from "next-safe-action/hooks";
import React from "react";
import numeral from "numeral";
import { toast } from "sonner";
import { format } from "date-fns";

export default function EditSubjectDialog({
  prices,
  subject_code,
  subject_name,
  id,
  open,
  onOpenChange,
}: {
  prices: { price: number }[];
  subject_code: string;
  subject_name: string;
  id: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { isExecuting, executeAsync } = useAction(updateSubjectAction);

  async function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    const formdata = new FormData(e.currentTarget);
    const validateForm = new FormData();
    validateForm.append("id", id.toString());
    if (formdata.get("subject_code") !== subject_code) {
      validateForm.append("subject_code", formdata.get("subject_code")!);
    }
    if (formdata.get("subject_name") !== subject_name) {
      validateForm.append("subject_name", formdata.get("subject_name")!);
    }
    if (numeral(formdata.get("price")!).value() !== prices[0]?.price) {
      validateForm.append(
        "price",
        numeral(formdata.get("price")!).value()?.toString() ?? "",
      );
    }
    const result = await executeAsync(validateForm);
    if (result.data) {
      toast.success("Subject updated successfully", {
        description: format(new Date(), "MMM, d yyyy"),
      });
      onOpenChange(false);
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Subject</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit}>
          <FieldSet className="gap-2">
            <Field>
              <FieldLabel>Subject Code</FieldLabel>
              <Input name="subject_code" defaultValue={subject_code} />
            </Field>
            <Field>
              <FieldLabel>Subject Name</FieldLabel>
              <Input name="subject_name" defaultValue={subject_name} />
            </Field>
            <Field>
              <FieldLabel>Price</FieldLabel>
              <NumericFormat
                defaultValue={prices[0]?.price}
                customInput={PesoInput}
                decimalScale={2}
                thousandSeparator
                name="price"
              />
            </Field>
            <DialogFooter>
              <DialogDescription>
                You can update this subject without changing existing records.
                Any curriculum already using this subject will have its price
                locked at the current value.
              </DialogDescription>
            </DialogFooter>
            <Button
              type="submit"
              className="w-full mt-2"
              disabled={isExecuting}
            >
              {isExecuting ? "Updating..." : "Update Subject"}
            </Button>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  );
}
