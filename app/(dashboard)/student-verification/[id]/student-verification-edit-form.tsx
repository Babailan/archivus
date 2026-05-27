"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Field,
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
import { Check, X, UserRoundPen } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useAction } from "next-safe-action/hooks";
import {
  updateStudentVerificationAction,
  approveStudentVerificationAction,
  declineStudentVerificationAction,
  fetchStudentVerificationById,
} from "../action";
import { toast } from "sonner";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { PatternFormat } from "react-number-format";

const formSchema = z.object({
  id: z.number(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  middle_name: z.string(),
  date_of_birth: z.date({ error: () => "Date of birth is required" }),
  gender: z.enum(["male", "female"], {
    error: () => "Gender is required",
  }),
  address: z.string().min(1, "Address is required"),
  email: z.string().email("Invalid email address"),
  grade_level: z.string({
    error: () => "Grade level is required",
  }),
  school_year: z.string({
    error: () => "School year is required",
  }),
  lrn: z
    .string({
      error: () => "This field is required.",
    })
    .regex(/^\d{12}$/, "LRN must be exactly 12 digits."),
  contact_number: z
    .string({
      error: () => "This field is required.",
    })
    .transform((v) => v.replace(/\s/g, ""))
    .refine(
      (v) => /^\d{11}$/.test(v),
      "Contact number must be exactly 11 digits.",
    ),
});

type StudentVerification = Awaited<
  ReturnType<typeof fetchStudentVerificationById>
>;

type StudentVerificationEditFormProps = {
  studentVerification: StudentVerification;
  approveAction: typeof approveStudentVerificationAction;
  declineAction: typeof declineStudentVerificationAction;
};

export function StudentVerificationEditForm({
  studentVerification,
  approveAction,
  declineAction,
}: StudentVerificationEditFormProps) {
  const router = useRouter();
  const { executeAsync: updateAsync, isExecuting: isUpdating } = useAction(
    updateStudentVerificationAction,
  );
  const { executeAsync: approveAsync } = useAction(approveAction);
  const { executeAsync: declineAsync, isExecuting: isDeclining } =
    useAction(declineAction);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: studentVerification.id,
      first_name: studentVerification.first_name,
      last_name: studentVerification.last_name,
      middle_name: studentVerification.middle_name || "",
      date_of_birth: new Date(studentVerification.date_of_birth),
      gender: studentVerification.gender,
      address: studentVerification.address,
      email: studentVerification.email,
      grade_level: studentVerification.grade_level,
      school_year: studentVerification.school_year,
      lrn: studentVerification.lrn,
      contact_number: studentVerification.contact_number,
    },
  });

  const [date, setDate] = useState<Date | undefined>(
    new Date(studentVerification.date_of_birth),
  );
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [isSavingAndApproving, setIsSavingAndApproving] = useState(false);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("id", data.id.toString());
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("middle_name", data.middle_name);
    formData.append("date_of_birth", data.date_of_birth.toISOString());
    formData.append("gender", data.gender);
    formData.append("address", data.address);
    formData.append("email", data.email);
    formData.append("grade_level", data.grade_level);
    formData.append("school_year", data.school_year);
    formData.append("lrn", data.lrn);
    formData.append("contact_number", data.contact_number);

    const { data: result } = await updateAsync(formData);

    if (result?.success) {
      toast.success("Updated successfully!");
    } else {
      toast.error("Failed to update");
    }
  }

  const handleSaveAndApprove = async () => {
    const isFormValid = await form.trigger();
    if (!isFormValid) return;

    setIsSavingAndApproving(true);

    const data = form.getValues();
    const formData = new FormData();
    formData.append("id", data.id.toString());
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("middle_name", data.middle_name);
    formData.append("date_of_birth", data.date_of_birth.toISOString());
    formData.append("gender", data.gender);
    formData.append("address", data.address);
    formData.append("email", data.email);
    formData.append("grade_level", data.grade_level);
    formData.append("school_year", data.school_year);
    formData.append("lrn", data.lrn);
    formData.append("contact_number", data.contact_number);

    const { data: updateResult } = await updateAsync(formData);
    if (!updateResult?.success) {
      toast.error("Failed to save changes");
      setIsSavingAndApproving(false);
      return;
    }

    const approveFormData = new FormData();
    approveFormData.append("id", data.id.toString());
    const { data: approveResult } = await approveAsync(approveFormData);
    if (approveResult?.success) {
      toast.success("Application approved!");
      router.push("/student-verification");
    } else {
      toast.error("Failed to approve after saving");
    }

    setIsSavingAndApproving(false);
  };

  const handleDecline = async () => {
    const formData = new FormData();
    formData.append("id", studentVerification.id.toString());
    const { data } = await declineAsync(formData);
    if (data?.success) {
      toast.success("Application denied");
      router.push("/student-verification");
    } else {
      toast.error("Failed to deny");
    }
  };

  return (
    <div className="mb-10">
      <Card className="p-6 rounded-lg">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldLegend variant="legend" className="flex gap-2 items-center">
              <UserRoundPen />
              Edit Applicant Information
            </FieldLegend>
            <p className="text-sm text-muted-foreground mb-6">
              Review and modify the applicant&apos;s information.
            </p>

            <FieldGroup className="flex-row">
              <Controller
                control={form.control}
                name="lrn"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.error}>
                    <FieldLabel>
                      LRN (Learner Reference Number){" "}
                      <span className="text-red-600">*</span>
                    </FieldLabel>
                    <PatternFormat
                      customInput={Input}
                      format="############"
                      placeholder="Ex: 123456789012"
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
                name="first_name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.error}>
                    <FieldLabel>
                      First Name <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input type="text" {...field} />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="last_name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.error}>
                    <FieldLabel>
                      Last Name <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input type="text" {...field} />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="middle_name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.error}>
                    <FieldLabel>Middle Name</FieldLabel>
                    <Input type="text" {...field} />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="gender"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.error}>
                    <FieldLabel>
                      Gender <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select gender" />
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
                  <Field data-invalid={fieldState.error}>
                    <FieldLabel>
                      Date of Birth <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Popover
                      open={openDatePicker}
                      onOpenChange={setOpenDatePicker}
                    >
                      <PopoverTrigger
                        render={
                          <Button
                            variant="outline"
                            className="justify-start font-normal w-full"
                            aria-invalid={fieldState.invalid}
                          >
                            {date ? date.toLocaleDateString() : "Select date"}
                          </Button>
                        }
                      />
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={date}
                          defaultMonth={date}
                          captionLayout="dropdown"
                          onSelect={(selectedDate) => {
                            setDate(selectedDate);
                            setOpenDatePicker(false);
                            if (selectedDate) {
                              form.setValue("date_of_birth", selectedDate);
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

              <Controller
                control={form.control}
                name="address"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.error}>
                    <FieldLabel>
                      Address<span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input type="text" {...field} />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.error}>
                    <FieldLabel>
                      Email <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input type="email" {...field} />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="contact_number"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.error}>
                    <FieldLabel>
                      Contact Number <span className="text-red-600">*</span>
                    </FieldLabel>
                    <PatternFormat
                      customInput={Input}
                      format="#### ### ####"
                      placeholder="Ex: +63 912 345 6789"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="grade_level"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.error}>
                    <FieldLabel>
                      Grade Level <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="grade1">Grade 1</SelectItem>
                          <SelectItem value="grade2">Grade 2</SelectItem>
                          <SelectItem value="grade3">Grade 3</SelectItem>
                          <SelectItem value="grade4">Grade 4</SelectItem>
                          <SelectItem value="grade5">Grade 5</SelectItem>
                          <SelectItem value="grade6">Grade 6</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="school_year"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.error}>
                    <FieldLabel>
                      School Year <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input type="text" {...field} />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup className="flex-row gap-4 mt-6">
              <Button
                type="submit"
                className={"bg-blue-600 hover:bg-sky-800"}
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>

              <Dialog>
                <DialogTrigger
                  render={
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Check className="mr-2 h-4 w-4" />
                      Save and Approve
                    </Button>
                  }
                />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Approve Application</DialogTitle>
                    <DialogDescription>
                      This will save all changes and create an official Student
                      record.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose
                      render={<Button variant="outline">Cancel</Button>}
                    />
                    <Button
                      disabled={isSavingAndApproving}
                      onClick={handleSaveAndApprove}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSavingAndApproving
                        ? "Saving and Approving..."
                        : "Save and Approve"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger
                  render={
                    <Button variant="destructive">
                      <X className="mr-2 h-4 w-4" />
                      Deny
                    </Button>
                  }
                />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Deny Application</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to deny this application?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose
                      render={<Button variant="outline">Cancel</Button>}
                    />
                    <Button
                      variant="destructive"
                      disabled={isDeclining}
                      onClick={handleDecline}
                    >
                      {isDeclining ? "Denying..." : "Deny"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </FieldGroup>
          </FieldSet>
        </form>
      </Card>
    </div>
  );
}
