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
import { ArrowLeft, Check, X, UserRoundPen } from "lucide-react";
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
  updatePreEnrollmentAction,
  approvePreEnrollmentAction,
  declinePreEnrollmentAction,
  fetchPreEnrollmentById,
} from "../action";
import { toast } from "sonner";
import { useState } from "react";

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
});

type PreEnrollment = Awaited<ReturnType<typeof fetchPreEnrollmentById>>;

type PreEnrollmentEditFormProps = {
  preEnrollment: PreEnrollment;
  approveAction: typeof approvePreEnrollmentAction;
  declineAction: typeof declinePreEnrollmentAction;
};

export function PreEnrollmentEditForm({
  preEnrollment,
  approveAction,
  declineAction,
}: PreEnrollmentEditFormProps) {
  const router = useRouter();
  const { executeAsync: updateAsync, isExecuting: isUpdating } = useAction(
    updatePreEnrollmentAction,
  );
  const { executeAsync: approveAsync, isExecuting: isApproving } = useAction(
    approveAction,
  );
  const { executeAsync: declineAsync, isExecuting: isDeclining } = useAction(
    declineAction,
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: preEnrollment.id,
      first_name: preEnrollment.first_name,
      last_name: preEnrollment.last_name,
      middle_name: preEnrollment.middle_name || "",
      date_of_birth: new Date(preEnrollment.date_of_birth),
      gender: preEnrollment.gender,
      address: preEnrollment.address,
      email: preEnrollment.email,
      grade_level: preEnrollment.grade_level,
      school_year: preEnrollment.school_year,
    },
  });

  const [date, setDate] = useState<Date | undefined>(
    new Date(preEnrollment.date_of_birth),
  );
  const [openDatePicker, setOpenDatePicker] = useState(false);

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

    const { data: result } = await updateAsync(formData);

    if (result?.success) {
      toast.success("Updated successfully!");
    } else {
      toast.error("Failed to update");
    }
  }

  const handleApprove = async () => {
    const formData = new FormData();
    formData.append("id", preEnrollment.id.toString());
    const { data } = await approveAsync(formData);
    if (data?.success) {
      toast.success("Application approved!");
      router.push("/pre-enrollments");
    } else {
      toast.error("Failed to approve");
    }
  };

  const handleDecline = async () => {
    const formData = new FormData();
    formData.append("id", preEnrollment.id.toString());
    const { data } = await declineAsync(formData);
    if (data?.success) {
      toast.success("Application denied");
      router.push("/pre-enrollments");
    } else {
      toast.error("Failed to deny");
    }
  };

  return (
    <div className="mb-10">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to List
      </Button>

      <div className="bg-secondary p-6 rounded-lg">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldLegend variant="legend" className="flex gap-2 items-center">
              <UserRoundPen />
              Pre-Enrollment Details
            </FieldLegend>
            <p className="text-sm text-muted-foreground mb-6">
              Review and modify the applicant&apos;s information.
            </p>

            <FieldGroup>
              <Controller
                control={form.control}
                name="first_name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.error}>
                    <FieldLabel>First Name</FieldLabel>
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
                    <FieldLabel>Last Name</FieldLabel>
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
                    <FieldLabel>Gender</FieldLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <FieldLabel>Date of Birth</FieldLabel>
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
                    <FieldLabel>Address</FieldLabel>
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
                    <FieldLabel>Email</FieldLabel>
                    <Input type="email" {...field} />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="grade_level"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.error}>
                    <FieldLabel>Grade Level</FieldLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <FieldLabel>School Year</FieldLabel>
                    <Input type="text" {...field} />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup className="flex-row gap-4 mt-6">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </FieldGroup>
          </FieldSet>
        </form>

        <div className="mt-8 pt-6 border-t">
          <h3 className="text-lg font-semibold mb-4">Review Decision</h3>
          <div className="flex gap-4">
            <Dialog>
              <DialogTrigger
                render={
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Check className="mr-2 h-4 w-4" />
                    Accept
                  </Button>
                }
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Approve Application</DialogTitle>
                  <DialogDescription>
                    Confirming this will create an official Student record
                    and assign a permanent ID.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline">Cancel</Button>} />
                  <Button
                    disabled={isApproving}
                    onClick={handleApprove}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isApproving ? "Approving..." : "Approve"}
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
                  <DialogClose render={<Button variant="outline">Cancel</Button>} />
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
          </div>
        </div>
      </div>
    </div>
  );
}