"use client";

import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis, RotateCcw, Search } from "lucide-react";
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
import { SearchSubjectResult } from "@/services/subject.service";
import RestoreSubjectDialog from "./restore-subject-dialog";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

export function InactiveSubjectListForm({
  subjectsPromise,
}: {
  subjectsPromise: Promise<SearchSubjectResult>;
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
                <TableHead>Date Deactivated</TableHead>
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
