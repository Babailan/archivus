"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
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
  grade_level: z.enum(
    ["grade_1", "grade_2", "grade_3", "grade_4", "grade_5", "grade_6"],
    {
      error: () => "This field is required.",
    },
  ),
  address: z.string().nonempty("This field is required."),
});

export default function CreateSubject() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      middle_name: "",
      date_of_birth: undefined as any,
      gender: undefined as any,
      address: "",
      grade_level: undefined as any,
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
  console.log(form.formState.isSubmitted);

  return (
    <div className="px-10 py-2 mb-10">
      <FieldSet>
        <FieldLegend variant="legend" className="flex gap-2 items-center">
          <UserRoundPen />
          Enrollment
        </FieldLegend>
        <FieldDescription>
          Please fill out the form below to enroll as an applicant.
        </FieldDescription>
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
            render={({ field, fieldState }) => (
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
                      <SelectItem value="grade_1">Grade 1</SelectItem>
                      <SelectItem value="grade_2">Grade 2</SelectItem>
                      <SelectItem value="grade_3">Grade 3</SelectItem>
                      <SelectItem value="grade_4">Grade 4</SelectItem>
                      <SelectItem value="grade_5">Grade 5</SelectItem>
                      <SelectItem value="grade_6">Grade 6</SelectItem>
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

            {/* if is submitted  */}
            <FieldContent>
              <FieldLabel htmlFor="accept_term">
                Accept terms and conditions
              </FieldLabel>
              <FieldDescription>
                You must accept the terms and conditions to proceed.
              </FieldDescription>
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
