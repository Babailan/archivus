"use client";

import { use, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useAction } from "next-safe-action/hooks";
import {
  approveStudentVerificationAction,
  declineStudentVerificationAction,
} from "./action";
import { toast } from "sonner";
import { Ellipsis, Check, X, PencilLine } from "lucide-react";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { format } from "date-fns";
import { StudentVerification } from "@/app/generated/prisma";

export function StudentVerificationList({
  dataPromise,
}: {
  dataPromise: Promise<{
    studentVerifications: StudentVerification[];
    total: number;
    page: number;
    pageSize: number;
  }>;
}) {
  const { studentVerifications, total, page, pageSize } = use(dataPromise);
  const totalPages = Math.ceil(total / pageSize);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) {
      params.set("q", debouncedSearch);
    } else {
      params.delete("q");
    }
    params.delete("page");
    router.push(`/student-verification?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, router]); // purposely omitting searchParams to avoid infinite loops

  const [acceptDialogId, setAcceptDialogId] = useState<number | null>(null);
  const [denyDialogId, setDenyDialogId] = useState<number | null>(null);

  const { executeAsync: approveAsync } = useAction(
    approveStudentVerificationAction,
  );
  const { executeAsync: declineAsync } = useAction(
    declineStudentVerificationAction,
  );

  const handleAccept = async (id: number) => {
    const formData = new FormData();
    formData.append("id", id.toString());
    const { data } = await approveAsync(formData);
    if (data?.success) {
      toast.success("Verification approved! Student ID assigned.");
    } else {
      toast.error("Failed to approve verification");
    }
  };

  const handleDeny = async (id: number) => {
    const formData = new FormData();
    formData.append("id", id.toString());
    const { data } = await declineAsync(formData);
    if (data?.success) {
      toast.success("Verification declined");
    } else {
      toast.error("Failed to decline verification");
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search verifications..."
        className="max-w-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>Reference Code</TableHead>
            <TableHead>Student Name</TableHead>
            <TableHead>Grade Level</TableHead>
            <TableHead>School Year</TableHead>
            <TableHead>Date Verified</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {studentVerifications.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-8 text-center text-muted-foreground"
              >
                No pending verifications found
              </TableCell>
            </TableRow>
          ) : (
            studentVerifications.map((item: StudentVerification) => (
              <TableRow key={item.id}>
                <TableCell>{item.reference_code}</TableCell>
                <TableCell>
                  {item.last_name}, {item.first_name} {item.middle_name}
                </TableCell>
                <TableCell className="capitalize">{item.grade_level}</TableCell>
                <TableCell>{item.school_year}</TableCell>
                <TableCell>
                  {format(new Date(item.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button size="sm" variant="ghost">
                          <Ellipsis className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/student-verification/${item.id}`)
                        }
                      >
                        <PencilLine className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setAcceptDialogId(item.id)}
                        className="text-green-600"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Accept
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDenyDialogId(item.id)}
                        className="text-red-600"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Deny
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <DataTablePagination page={page} totalPages={totalPages} />

      <Dialog
        open={acceptDialogId !== null}
        onOpenChange={(open) => !open && setAcceptDialogId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Application</DialogTitle>
            <DialogDescription>
              This will create an official Student record and assign a Student
              ID.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                if (acceptDialogId !== null) handleAccept(acceptDialogId);
                setAcceptDialogId(null);
              }}
            >
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={denyDialogId !== null}
        onOpenChange={(open) => !open && setDenyDialogId(null)}
      >
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
              onClick={() => {
                if (denyDialogId !== null) handleDeny(denyDialogId);
                setDenyDialogId(null);
              }}
            >
              Deny
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
