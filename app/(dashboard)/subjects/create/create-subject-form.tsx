"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { useAction } from "next-safe-action/hooks";
import { createSubjectAction } from "./action";
import { Input } from "@/components/ui/input";
import { NumericFormat } from "react-number-format";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { SendHorizonal } from "lucide-react";
import React from "react";
import numeral from "numeral";
import { PesoInput } from "@/components/ui/peso-input";
import { toast } from "sonner";
import { format } from "date-fns";

export function CreateSubjectForm() {
  const { executeAsync, isExecuting, result } = useAction(createSubjectAction);
  async function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formdata = new FormData(e.target);
    const price = numeral(formdata.get("price"));
    formdata.set("price", price.value()?.toString() ?? "");
    const result = await executeAsync(formdata);
    if (result.data) {
      toast.success("Subject created successfully", {
        description: format(new Date(), "MMM, d yyyy"),
      });
      e.target.reset();
    }
  }
  return (
    <form onSubmit={submit}>
      <FieldSet>
        <FieldLegend className="text-xl! font-bold">Create Subject</FieldLegend>
        <FieldDescription>
          This subject can be use when making a new curriculum.
        </FieldDescription>
        <Field>
          <FieldLabel>
            Subject Name <span className="text-red-600">*</span>
          </FieldLabel>
          <Input
            type="text"
            name="subject_name"
            aria-invalid={!!result.validationErrors?.fieldErrors.subject_name}
          />
          <FieldDescription>
            Use clear, descriptive names (e.g., &quot;Advanced Mathematics&quot;
            or &quot;Introduction to Biology&quot;)
          </FieldDescription>
          <FieldError>
            {result.validationErrors?.fieldErrors.subject_name}
          </FieldError>
        </Field>
        <Field>
          <FieldLabel>
            Subject Code <span className="text-red-600">*</span>
          </FieldLabel>

          <Input
            type="text"
            name="subject_code"
            aria-invalid={!!result.validationErrors?.fieldErrors.subject_code}
          />
          <FieldDescription>
            Follow a consistent format like `[ABBREV][LEVEL]` (e.g., MATH101,
            ENG202)
          </FieldDescription>
          <FieldError>
            {result.validationErrors?.fieldErrors.subject_code}
          </FieldError>
        </Field>
        <Field>
          <FieldLabel>
            Price <span className="text-red-600">*</span>
          </FieldLabel>
          <NumericFormat
            customInput={PesoInput}
            thousandSeparator
            decimalScale={2}
            name="price"
            aria-invalid={!!result.validationErrors?.fieldErrors.price}
          />
          <FieldDescription>
            Set based on subject complexity, materials needed, or credit hours
          </FieldDescription>
          <FieldError>{result.validationErrors?.fieldErrors.price}</FieldError>
        </Field>
        <Button type="submit" disabled={isExecuting}>
          {isExecuting ? <Spinner /> : <SendHorizonal />}
          Create Subject
        </Button>
      </FieldSet>
    </form>
  );
}
