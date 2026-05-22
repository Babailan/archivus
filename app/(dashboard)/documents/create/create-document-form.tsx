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
import { createDocumentAction } from "./action";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { SendHorizonal } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { format } from "date-fns";

export function CreateDocumentForm() {
  const { executeAsync, result, isExecuting } = useAction(createDocumentAction);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    const result = await executeAsync(formdata);
    if (result.data) {
      toast.success("Document created successfully", {
        description: format(new Date(), "MMM, d yyyy"),
      });
      e.currentTarget.reset();
    }
  }

  return (
    <form onSubmit={submit}>
      <FieldSet>
        <FieldLegend className="text-xl! font-bold">Create Document</FieldLegend>
        <FieldDescription>
          Add a document type that students must submit to the registrar.
        </FieldDescription>
        <Field>
          <FieldLabel>
            Document Name <span className="text-red-600">*</span>
          </FieldLabel>
          <Input
            type="text"
            name="name"
            aria-invalid={!!result.validationErrors?.fieldErrors.name}
          />
          <FieldDescription>
            e.g., Form 137, Birth Certificate, Good Moral Certificate
          </FieldDescription>
          <FieldError>
            {result.validationErrors?.fieldErrors.name}
          </FieldError>
        </Field>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Textarea
            name="description"
            aria-invalid={!!result.validationErrors?.fieldErrors.description}
          />
          <FieldDescription>
            Optional details about this document requirement.
          </FieldDescription>
          <FieldError>
            {result.validationErrors?.fieldErrors.description}
          </FieldError>
        </Field>
        <Button type="submit" disabled={isExecuting}>
          {isExecuting ? <Spinner /> : <SendHorizonal />}
          Create Document
        </Button>
      </FieldSet>
    </form>
  );
}
