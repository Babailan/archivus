"use client";

import { use, useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  createEnrollmentRollbackAction,
  cancelEnrollmentRollbackAction,
} from "@/app/(dashboard)/enrollments/rollback-action";
import { AlertTriangle, ArrowLeft, XCircle } from "lucide-react";

type EnrollmentData = {
  id: number;
  reference_code: string;
  school_year: string;
  status: string;
  grade_level: string;
  total_tuition_snapshot: number;
  total_paid: number;
  balance: number;
  payment_status: string;
  hasPendingRollbackRequest: boolean;
  pendingRollbackRequestId: number | null;
};

type StudentData = {
  first_name: string;
  last_name: string;
  middle_name: string;
};

interface EnrollmentRollbackFormProps {
  enrollment: EnrollmentData;
  student: StudentData;
}

export function EnrollmentRollbackForm({
  enrollment,
  student,
}: EnrollmentRollbackFormProps) {
  const router = useRouter();
  const [reason, setReason] = useState("");

  const { executeAsync: createAsync, isExecuting: isCreating } = useAction(
    createEnrollmentRollbackAction,
  );
  const { executeAsync: cancelAsync, isExecuting: isCancelling } = useAction(
    cancelEnrollmentRollbackAction,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("enrollment_id", enrollment.id.toString());
    formData.set("reason", reason);

    const { data } = await createAsync(formData);
    if (data?.success) {
      toast.success("Rollback request submitted successfully");
      router.push(`/enrollments/${enrollment.id}/student`);
    } else {
      toast.error(data?.error ?? "Failed to submit rollback request");
    }
  };

  const handleCancel = async () => {
    if (!enrollment.pendingRollbackRequestId) return;
    const formData = new FormData();
    formData.set("id", enrollment.pendingRollbackRequestId.toString());
    formData.set("enrollment_id", enrollment.id.toString());

    const { data } = await cancelAsync(formData);
    if (data?.success) {
      toast.success("Rollback request cancelled");
      router.push(`/enrollments/${enrollment.id}/student`);
    } else {
      toast.error(data?.error ?? "Failed to cancel rollback request");
    }
  };

  const fullName = `${student.last_name}, ${student.first_name} ${student.middle_name}`;

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-amber-500">
            Important: Enrollment Cancellation Request
          </p>
          <p className="text-sm text-muted-foreground">
            Submitting a rollback request will flag this enrollment for admin
            review. If approved, the enrollment status will be changed to{" "}
            <strong>Cancelled</strong>. This action cannot be automatically
            undone — the admin must take action.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Enrollment Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Summary</CardTitle>
            <CardDescription>
              Details of the enrollment to be rolled back
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Student</dt>
                <dd className="font-medium">{fullName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Reference Code</dt>
                <dd className="font-mono font-medium">
                  {enrollment.reference_code}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Grade Level</dt>
                <dd className="font-medium">{enrollment.grade_level}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">School Year</dt>
                <dd className="font-medium">{enrollment.school_year}</dd>
              </div>
              <div className="flex justify-between border-t pt-3">
                <dt className="text-muted-foreground">Total Tuition</dt>
                <dd className="font-semibold">
                  ₱{enrollment.total_tuition_snapshot.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Total Paid</dt>
                <dd className="font-semibold text-green-600">
                  ₱{enrollment.total_paid.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Balance</dt>
                <dd
                  className={`font-semibold ${enrollment.balance > 0 ? "text-red-600" : "text-green-600"}`}
                >
                  ₱{enrollment.balance.toLocaleString()}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Request Form or Pending State */}
        <Card>
          <CardHeader>
            <CardTitle>
              {enrollment.hasPendingRollbackRequest
                ? "Pending Request"
                : "Rollback Request"}
            </CardTitle>
            <CardDescription>
              {enrollment.hasPendingRollbackRequest
                ? "A rollback request is currently pending admin review"
                : "Provide a reason for cancelling this enrollment"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {enrollment.hasPendingRollbackRequest ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
                  <XCircle className="h-5 w-5 shrink-0 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium text-yellow-600">
                      Awaiting Admin Review
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Your rollback request has been submitted and is waiting
                      for admin approval.
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCancel}
                  disabled={isCancelling}
                >
                  {isCancelling ? "Cancelling..." : "Cancel This Request"}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel>
                      Reason for Rollback{" "}
                      <span className="text-muted-foreground text-xs">
                        (min. 10 characters)
                      </span>
                    </FieldLabel>
                    <Textarea
                      id="reason"
                      name="reason"
                      placeholder="Describe why this enrollment should be cancelled..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={5}
                      required
                      minLength={10}
                      className="resize-none"
                    />
                  </Field>
                </FieldGroup>
                <Button
                  type="submit"
                  variant="destructive"
                  className="w-full"
                  disabled={isCreating || reason.trim().length < 10}
                >
                  {isCreating ? "Submitting..." : "Submit Rollback Request"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      <Button
        variant="ghost"
        onClick={() => router.push(`/enrollments/${enrollment.id}/student`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Student Details
      </Button>
    </div>
  );
}
