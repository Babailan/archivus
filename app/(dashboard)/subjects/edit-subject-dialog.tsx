"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import Link from "next/link";
import { InferSafeActionFnResult } from "next-safe-action";
import { updateSubjectAction } from "./action";
import { NumericFormat } from "react-number-format";
import { PesoInput } from "@/components/ui/peso-input";
import { useAction } from "next-safe-action/hooks";
import React from "react";
import numeral from "numeral";
import { SearchSubjectResult } from "@/services/subject.service";
import { toast, useSonner } from "sonner";
import { format } from "date-fns";

type props = Awaited<SearchSubjectResult>["subjects"][number];

export default function EditSubjectDialog({
  prices,
  subject_code,
  subject_name,
  id,
}: props) {
  const { isExecuting, result, executeAsync } = useAction(updateSubjectAction);

  async function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    const formdata = new FormData(e.currentTarget);
    const validateForm = new FormData();
    // don't put if the value is the same
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
        numeral(formdata.get("price")!).value()?.toString()!,
      );
    }
    const result = await executeAsync(validateForm);
    if (result.data) {
      toast.success("Subject updated successfully", {
        description: format(new Date(), "MMM, d yyyy"),
      });
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"} className="w-full justify-start">
          Edit
        </Button>
      </DialogTrigger>
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
                locked at the current value. Alternatively, you can{" "}
                <Link
                  href={"/subjects/create"}
                  className="text-blue-600 hover:text-blue-600"
                >
                  create a new subject instead
                </Link>
              </DialogDescription>
            </DialogFooter>
            <Button className="w-full mt-2" disabled={isExecuting}>
              {isExecuting ? "Updating..." : "Update Subject"}
            </Button>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  );
}
