"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizonal, UserRoundPen } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  first_name: z.string().nonempty("This field is required."),
  last_name: z.string().nonempty("This field is required."),
  middle_name: z.string().nonempty("This field is required."),
  date_of_birth: z.date({ error: () => "This field is required" }),
  gender: z.enum(["male", "female"], {
    error: () => "This field is required.",
  }),
  grade_level: z.string({
    error: () => "This field is required.",
  }),
  address: z.string().nonempty("This field is required."),
});

interface EnrollmentFormProps {
  gradeLevels: Array<{
    value: string;
    label: string;
    curriculumId: number | null;
  }>;
}

export function EnrollmentForm({ gradeLevels }: EnrollmentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      middle_name: "",
      date_of_birth: undefined as unknown as Date,
      gender: undefined as unknown as "male" | "female",
      address: "",
      grade_level: undefined as unknown as string,
    },
  });

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [acceptTerm, setAcceptTerm] = useState<boolean>(false);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const formdata = new FormData();
    formdata.append("first_name", data.first_name);
    formdata.append("last_name", data.last_name);
    formdata.append("middle_name", data.middle_name);
    formdata.append("date_of_birth", data.date_of_birth.toISOString());
    try {
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }

  return (
    <div className="px-10 py-2 mb-10">
      <FieldSet>
        <FieldLegend variant="legend" className="flex gap-2 items-center">
          <UserRoundPen />
          Enrollment
        </FieldLegend>
        <p className="text-sm text-muted-foreground mb-6">
          Please fill out the form below to enroll as an applicant.
        </p>
        <FieldGroup>
          <Controller
            control={form.control}
            name="first_name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.error}>
                <FieldLabel>
                  First Name <span className="text-red-600">*</span>
                </FieldLabel>
                <Input
                  type="text"
                  placeholder="Ex: John"
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="last_name"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>
                  Last Name <span className="text-red-600">*</span>
                </FieldLabel>
                <Input
                  type="text"
                  placeholder="Ex: Doe"
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="middle_name"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>
                  Middle Name <span className="text-red-600">*</span>
                </FieldLabel>
                <Input
                  type="text"
                  placeholder="Ex: Flores"
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup className="flex-row">
          <Controller
            control={form.control}
            name="gender"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>
                  Gender <span className="text-red-600">*</span>
                </FieldLabel>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Select a gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="date_of_birth"
            render={({ fieldState }) => (
              <Field className="mx-auto w-60">
                <FieldLabel htmlFor="date">
                  Date of birth <span className="text-red-600">*</span>
                </FieldLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className={"justify-start font-normal"}
                      aria-invalid={fieldState.invalid}
                    >
                      {date ? date.toLocaleDateString() : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      defaultMonth={date}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setDate(date);
                        setOpen(false);
                        if (date) {
                          form.setValue("date_of_birth", date);
                          form.trigger("date_of_birth");
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup>
          <Controller
            control={form.control}
            name="address"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.error}>
                <FieldLabel>
                  Address <span className="text-red-600">*</span>
                </FieldLabel>
                <Input
                  type="text"
                  placeholder="Ex: 123 Main St, City, Country"
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </FieldGroup>
        <FieldGroup>
          <Controller
            control={form.control}
            name="grade_level"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>
                  Grade Level <span className="text-red-600">*</span>
                </FieldLabel>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Select Grade Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {gradeLevels.map((grade) => (
                        <SelectItem key={grade.value} value={grade.value}>
                          {grade.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup>
          <Field
            orientation="horizontal"
            data-invalid={!acceptTerm && form.formState.isSubmitted}
          >
            <Checkbox
              id="accept_term"
              onCheckedChange={(v: boolean) => setAcceptTerm(v)}
              aria-invalid={
                !acceptTerm && form.formState.isSubmitted ? "true" : "false"
              }
            />

            <FieldContent>
              <FieldLabel htmlFor="accept_term">
                Accept terms and conditions
              </FieldLabel>
              <p className="text-sm text-muted-foreground">
                You must accept the terms and conditions to proceed.
              </p>
            </FieldContent>
            <FieldError />
          </Field>
        </FieldGroup>

        <Button
          className="mt-4 cursor-pointer"
          onClick={form.handleSubmit(onSubmit)}
        >
          <SendHorizonal />
          Proceed to Enroll
        </Button>
      </FieldSet>
    </div>
  );
}
