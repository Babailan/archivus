"use client";

import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
<<<<<<< HEAD
import { Button } from "@/components/ui/button";
import { RotateCcw, Search } from "lucide-react";
=======
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis, RotateCcw, Search } from "lucide-react";
>>>>>>> 5af488d21300c90329e780965d846f9ab0eec2b0
import { format } from "date-fns";
import { NumericFormat } from "react-number-format";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { use, useState } from "react";
<<<<<<< HEAD
import { SearchInactiveSubjectResult } from "@/services/subject.service";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useAction } from "next-safe-action/hooks";
import { undoSubjectAction } from "../action";
import { toast } from "sonner";
=======
import { SearchSubjectResult } from "@/services/subject.service";
import RestoreSubjectDialog from "./restore-subject-dialog";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
>>>>>>> 5af488d21300c90329e780965d846f9ab0eec2b0

export function InactiveSubjectListForm({
  subjectsPromise,
}: {
<<<<<<< HEAD
  subjectsPromise: Promise<SearchInactiveSubjectResult>;
}) {
  const { subjects: subj, total, page, pageSize } = use(subjectsPromise);
  const [undoingId, setUndoingId] = useState<number | null>(null);
  const { executeAsync } = useAction(undoSubjectAction);
  const totalPages = Math.ceil(total / pageSize);

  const handleUndo = async (id: number) => {
    setUndoingId(id);
    const { data } = await executeAsync({ id });
    if (data) {
      toast.success("Subject restored successfully");
    }
    setUndoingId(null);
  };

=======
  subjectsPromise: Promise<SearchSubjectResult>;
}) {
  const { subjects: subj, total, page, pageSize } = use(subjectsPromise);
  const [restoringId, setRestoringId] = useState<number | null>(null);
  const totalPages = Math.ceil(total / pageSize);

>>>>>>> 5af488d21300c90329e780965d846f9ab0eec2b0
  return (
    <>
      {!subj.length && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search />
            </EmptyMedia>
            <EmptyTitle>No data</EmptyTitle>
            <EmptyDescription>No inactive subjects found.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
      {!!subj.length && (
        <>
          <Table className="my-5 border">
            <TableHeader>
              <TableRow>
                <TableHead>Subject Code</TableHead>
                <TableHead>Subject Name</TableHead>
                <TableHead>Price</TableHead>
<<<<<<< HEAD
                <TableHead>Date Created</TableHead>
=======
                <TableHead>Date Deactivated</TableHead>
>>>>>>> 5af488d21300c90329e780965d846f9ab0eec2b0
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subj.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>{subject.subject_code.toUpperCase()}</TableCell>
                  <TableCell>{subject.subject_name.toUpperCase()}</TableCell>
                  <TableCell>
                    <NumericFormat
                      displayType="text"
                      prefix="₱ "
                      value={subject.prices[0]?.price}
                      thousandSeparator
                    />
                  </TableCell>
                  <TableCell>
<<<<<<< HEAD
                    {format(subject.created_at, "MMM, d yyyy")}
                  </TableCell>
                  <TableCell className="flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      className="cursor-pointer"
                      disabled={undoingId === subject.id}
                      onClick={() => handleUndo(subject.id)}
                    >
                      <RotateCcw /> Undo
                    </Button>
=======
                    {format(subject.updated_at, "MMM, d yyyy")}
                  </TableCell>
                  <TableCell className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button size={"icon-sm"} variant={"ghost"}>
                            <Ellipsis />
                          </Button>
                        }
                      />
                      <DropdownMenuContent>
                        <DropdownMenuGroup>
                          <DropdownMenuItem onClick={() => setRestoringId(subject.id)}>
                            <RotateCcw/>
                            Restore
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <RestoreSubjectDialog
                      id={subject.id}
                      open={restoringId === subject.id}
                      onOpenChange={(open) => { if (!open) setRestoringId(null); }}
                    />
>>>>>>> 5af488d21300c90329e780965d846f9ab0eec2b0
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DataTablePagination page={page} totalPages={totalPages} />
        </>
      )}
    </>
  );
}
