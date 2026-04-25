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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis, Search } from "lucide-react";
import { format } from "date-fns";
import { NumericFormat } from "react-number-format";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useRouter, useSearchParams } from "next/navigation";
import { use } from "react";
import { SearchSubjectResult } from "@/services/subject.service";
import EditSubjectDialog from "./edit-subject-dialog";
import DeleteSubjectDialog from "./delete-subject-dialog";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

export function SubjectListForm({
  subjectsPromise,
}: {
  subjectsPromise: Promise<SearchSubjectResult>;
}) {
  const { subjects: subj, total, page, pageSize } = use(subjectsPromise);
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
            <EmptyDescription>Subject doesn&apos;t exist.</EmptyDescription>
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
                          <EditSubjectDialog {...subject} />
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DeleteSubjectDialog id={subject.id} />
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
