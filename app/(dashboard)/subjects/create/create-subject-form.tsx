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
import { createSubject } from "./action";
import { Input } from "@/components/ui/input";
import { NumericFormat } from "react-number-format";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { SendHorizonal } from "lucide-react";
import React from "react";
import { dinero, PHP } from "dinero.js";
import numeral from "numeral";
import { PesoInput } from "@/components/ui/peso";

export function CreateSubjectForm() {
  const { execute, result, status, isExecuting } = useAction(createSubject);
  function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formdata = new FormData(e.target);
    const price = numeral(formdata.get("price"));
    formdata.set("price", price.value()?.toString() ?? "");
    execute(formdata);
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
            onValueChange={(v) => v.floatValue}
            name="price"
            aria-invalid={!!result.validationErrors?.fieldErrors.price}
          />
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
