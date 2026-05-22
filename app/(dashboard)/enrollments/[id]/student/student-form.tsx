"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { updateStudentAction } from "@/app/(dashboard)/enrollments/action";
import { ArrowLeft, Save } from "lucide-react";

type StudentData = {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  date_of_birth: string;
  address: string;
  gender: "male" | "female";
  email: string;
};

type EnrollmentData = {
  id: number;
  reference_code: string;
  school_year: string;
  status: string;
  grade_level: string;
  total_tuition_snapshot: number;
  total_misc_snapshot: number;
  total_paid: number;
  balance: number;
  payment_status: string;
};

interface StudentFormProps {
  student: StudentData;
  enrollment: EnrollmentData;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500",
  approved: "bg-blue-500",
  declined: "bg-gray-500",
  dropped: "bg-red-500",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  declined: "Declined",
  dropped: "Dropped",
};

const paymentStatusColors: Record<string, string> = {
  unpaid: "bg-red-500",
  partial: "bg-yellow-500",
  fully_paid: "bg-green-500",
};

const paymentStatusLabels: Record<string, string> = {
  unpaid: "Unpaid",
  partial: "Partial",
  fully_paid: "Fully Paid",
};

export function StudentForm({ student, enrollment }: StudentFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<StudentData>(student);
  const { executeAsync, isExecuting } = useAction(updateStudentAction);

  const handleChange = (field: keyof StudentData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async () => {
    const formDataToSend = new FormData();
    formDataToSend.set("id", student.id.toString());
    formDataToSend.set("first_name", formData.first_name);
    formDataToSend.set("last_name", formData.last_name);
    formDataToSend.set("middle_name", formData.middle_name);
    formDataToSend.set("date_of_birth", formData.date_of_birth);
    formDataToSend.set("address", formData.address);
    formDataToSend.set("gender", formData.gender);
    formDataToSend.set("email", formData.email);

    const { data } = await executeAsync(formDataToSend);
    if (data?.success) {
      toast.success("Student updated successfully");
    } else {
      toast.error("Failed to update student");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Student details - all fields are editable
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>First Name</FieldLabel>
                  <Input
                    value={formData.first_name}
                    onChange={(e) => handleChange("first_name", e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel>Last Name</FieldLabel>
                  <Input
                    value={formData.last_name}
                    onChange={(e) => handleChange("last_name", e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel>Middle Name</FieldLabel>
                  <Input
                    value={formData.middle_name}
                    onChange={(e) =>
                      handleChange("middle_name", e.target.value)
                    }
                  />
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel>Date of Birth</FieldLabel>
                  <Input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) =>
                      handleChange("date_of_birth", e.target.value)
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel>Gender</FieldLabel>
                  <Select
                    value={formData.gender}
                    onValueChange={(val) =>
                      handleChange("gender", val as "male" | "female")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel>Address</FieldLabel>
                  <Input
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enrollment Details</CardTitle>
            <CardDescription>Current enrollment information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Reference Code
                  </p>
                  <p className="font-medium">{enrollment.reference_code}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">School Year</p>
                  <p className="font-medium">{enrollment.school_year}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Grade Level</p>
                  <p className="font-medium">{enrollment.grade_level}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs text-white ${statusColors[enrollment.status]}`}
                  >
                    {statusLabels[enrollment.status]}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Financial Summary
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Tuition
                    </p>
                    <p className="font-medium text-lg">
                      ₱{enrollment.total_tuition_snapshot.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Miscellaneous
                    </p>
                    <p className="font-medium text-lg">
                      ₱{enrollment.total_misc_snapshot.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Paid</p>
                    <p className="font-medium text-lg text-green-600">
                      ₱{enrollment.total_paid.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p
                      className={`font-medium text-lg ${enrollment.balance > 0 ? "text-red-600" : "text-green-600"}`}
                    >
                      ₱{enrollment.balance.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs text-white ${paymentStatusColors[enrollment.payment_status]}`}
                  >
                    {paymentStatusLabels[enrollment.payment_status]}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog>
        <DialogTrigger
          render={
            <Button size="lg" className="w-full md:w-auto">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          }
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to save the changes to this student&apos;s
              information?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <DialogClose
              render={
                <Button onClick={onSubmit} disabled={isExecuting}>
                  Save
                </Button>
              }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
