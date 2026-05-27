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
import { Trash2, RotateCcw, Clock } from "lucide-react";
import Link from "next/link";

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
  hasPendingRollbackRequest: boolean;
  pendingRollbackRequestId: number | null;
};

interface StudentFormProps {
  student: StudentData;
  enrollment: EnrollmentData;
}

const statusColors: Record<string, string> = {
  approved: "bg-blue-500",
  dropped: "bg-red-500",
  cancelled: "bg-gray-500",
};

const statusLabels: Record<string, string> = {
  approved: "Approved",
  dropped: "Dropped",
  cancelled: "Cancelled",
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

  const isActive = enrollment.status === "approved";
  const isCancelled = enrollment.status === "cancelled";
  const isDropped = enrollment.status === "dropped";
  const hasPending = enrollment.hasPendingRollbackRequest;

  return (
    <div className="space-y-6">
      {/* Pending Rollback Banner */}
      {hasPending && (
        <div className="flex items-center gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3">
          <Clock className="h-4 w-4 shrink-0 text-yellow-500" />
          <p className="text-sm text-yellow-600 font-medium">
            A rollback request is pending admin review for this enrollment.{" "}
            <Link
              href={`/enrollments/${enrollment.id}/rollback`}
              className="underline underline-offset-2"
            >
              View or cancel the request
            </Link>
          </p>
        </div>
      )}

      {/* Cancelled Banner */}
      {isCancelled && (
        <div className="flex items-center gap-3 rounded-lg border border-gray-500/30 bg-gray-500/10 px-4 py-3">
          <RotateCcw className="h-4 w-4 shrink-0 text-gray-500" />
          <p className="text-sm text-muted-foreground font-medium">
            This enrollment has been cancelled. No further actions are
            available.
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Student details — read only</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>First Name</FieldLabel>
                  <Input value={student.first_name} disabled />
                </Field>
                <Field>
                  <FieldLabel>Last Name</FieldLabel>
                  <Input value={student.last_name} disabled />
                </Field>
                <Field>
                  <FieldLabel>Middle Name</FieldLabel>
                  <Input value={student.middle_name} disabled />
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel>Date of Birth</FieldLabel>
                  <Input type="date" value={student.date_of_birth} disabled />
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
                  <Input value={student.address} disabled />
                </Field>
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input type="email" value={student.email} disabled />
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
                    className={`inline-block px-2 py-1 rounded-full text-xs text-white ${statusColors[enrollment.status] ?? "bg-gray-400"}`}
                  >
                    {statusLabels[enrollment.status] ?? enrollment.status}
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

      {/* Actions — only shown for active, non-pending enrollments */}
      {isActive && !hasPending && (
        <div className="flex flex-wrap gap-3">
          {/* Request Rollback */}
          <Link href={`/enrollments/${enrollment.id}/rollback`}>
            <Button
              variant="outline"
              size="lg"
              className="border-orange-500 text-orange-600 hover:bg-orange-50"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Request Rollback
            </Button>
          </Link>

          {/* Drop Enrollment */}
          <Dialog>
            <DialogTrigger
              render={
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Drop Enrollment
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Drop Enrollment</DialogTitle>
                <DialogDescription>
                  Are you sure you want to drop this enrollment? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose
                  render={<Button variant="outline">Cancel</Button>}
                />
                <DialogClose
                  render={
                    <Button
                      onClick={onDrop}
                      disabled={isExecuting}
                      variant="destructive"
                    >
                      Drop Enrollment
                    </Button>
                  }
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Pending rollback — show link to manage request */}
      {isActive && hasPending && (
        <Button variant="outline" size="lg">
          <Link href={`/enrollments/${enrollment.id}/rollback`}>
            <Clock className="mr-2 h-4 w-4" />
            Manage Rollback Request
          </Link>
        </Button>
      )}

      {/* Dropped / Cancelled — no actions */}
      {(isDropped || isCancelled) && (
        <p className="text-sm text-muted-foreground">
          No actions available for this enrollment.
        </p>
      )}
    </div>
  );
}
