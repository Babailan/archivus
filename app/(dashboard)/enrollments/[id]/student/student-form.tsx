"use client";

import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { dropEnrollmentAction } from "@/app/(dashboard)/enrollments/action";
import { Trash2 } from "lucide-react";

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
  approved: "bg-blue-500",
  dropped: "bg-red-500",
};

const statusLabels: Record<string, string> = {
  approved: "Approved",
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
  const { executeAsync, isExecuting } = useAction(dropEnrollmentAction);

  const onDrop = async () => {
    const formData = new FormData();
    formData.set("id", enrollment.id.toString());

    const { data } = await executeAsync(formData);
    if (data?.success) {
      toast.success("Enrollment dropped successfully");
      router.push("/enrollments");
    } else {
      toast.error("Failed to drop enrollment");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Student details - read only
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>First Name</FieldLabel>
                  <Input
                    value={student.first_name}
                    disabled
                  />
                </Field>
                <Field>
                  <FieldLabel>Last Name</FieldLabel>
                  <Input
                    value={student.last_name}
                    disabled
                  />
                </Field>
                <Field>
                  <FieldLabel>Middle Name</FieldLabel>
                  <Input
                    value={student.middle_name}
                    disabled
                  />
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel>Date of Birth</FieldLabel>
                  <Input
                    type="date"
                    value={student.date_of_birth}
                    disabled
                  />
                </Field>
                <Field>
                  <FieldLabel>Gender</FieldLabel>
                  <Input
                    value={student.gender === "male" ? "Male" : "Female"}
                    disabled
                  />
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel>Address</FieldLabel>
                  <Input
                    value={student.address}
                    disabled
                  />
                </Field>
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    type="email"
                    value={student.email}
                    disabled
                  />
                </Field>
              </FieldGroup>
            </div>
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
            <Button size="lg" className="w-full md:w-auto bg-red-600 hover:bg-red-700">
              <Trash2 className="mr-2 h-4 w-4" />
              Drop Enrollment
            </Button>
          }
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Drop Enrollment</DialogTitle>
            <DialogDescription>
              Are you sure you want to drop this enrollment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <DialogClose
              render={
                <Button onClick={onDrop} disabled={isExecuting} variant="destructive">
                  Drop Enrollment
                </Button>
              }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
