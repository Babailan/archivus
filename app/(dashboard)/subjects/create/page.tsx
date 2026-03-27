"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSubjectAction } from "./action";
import { Send, SendHorizonal } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
  subject_name: z.string().nonempty("This field is required."),
  subject_code: z.string().nonempty("This field is required."),
});

export default function CreateSubject() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject_name: "",
      subject_code: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const formdata = new FormData();
    formdata.append("subject_name", data.subject_name);
    formdata.append("subject_code", data.subject_code);
    try {
      const action = await createSubjectAction(formdata);
      if (action.success) {
      } else {
      }
    } catch (error) {}
  }

  return (
    <div className="p-10">
      <FieldSet>
        <FieldLegend>Create Subject</FieldLegend>
        <FieldDescription>
          This form allows you to create a new subject which you can use when
          making a curriculum.
        </FieldDescription>
        <FieldGroup>
          <Controller
            control={form.control}
            name="subject_name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.error}>
                <FieldLabel htmlFor="subject_name">
                  Subject Name <span className="text-red-600">*</span>
                </FieldLabel>
                <Input
                  type="text"
                  placeholder="Ex: Mathematics"
                  id="subject_name"
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="subject_code"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="subject_code">
                  Subject Code <span className="text-red-600">*</span>
                </FieldLabel>
                <Input
                  type="text"
                  placeholder="Ex: MATH101"
                  id="subject_code"
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </FieldGroup>
        <Button
          className="mt-4 cursor-pointer"
          onClick={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? <Spinner /> : <SendHorizonal />}
          Create Subject
        </Button>
      </FieldSet>
    </div>
  );
}
