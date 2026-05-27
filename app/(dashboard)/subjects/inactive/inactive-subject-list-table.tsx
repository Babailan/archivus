"use client";

import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { Search } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import RestoreSubjectDialog from "./restore-subject-dialog";

export function InactiveSubjectListForm({
  subjectsPromise,
}: {
  subjectsPromise: Promise<SearchInactiveSubjectResult>;
}) {
  const { subjects: subj, total, page, pageSize } = use(subjectsPromise);
  const [restoringId, setRestoringId] = useState<number | null>(null);
  const totalPages = Math.ceil(total / pageSize);

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
                      onClick={() => setRestoringId(subject.id)}
                    >
                      <RotateCcw /> Undo
                    </Button>
                    <RestoreSubjectDialog
                      id={subject.id}
                      open={restoringId === subject.id}
                      onOpenChange={(open) => {
                        if (!open) setRestoringId(null);
                      }}
                    />
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
