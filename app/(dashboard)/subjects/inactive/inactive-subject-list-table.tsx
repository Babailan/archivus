"use client";

import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RotateCcw, Search } from "lucide-react";
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
import { SearchInactiveSubjectResult } from "@/services/subject.service";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useAction } from "next-safe-action/hooks";
import { undoSubjectAction } from "../action";
import { toast } from "sonner";

export function InactiveSubjectListForm({
  subjectsPromise,
}: {
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
                <TableHead>Date Created</TableHead>
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
