"use client";

import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { searchSubjectAction } from "./action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ArrowUp,
  Ellipsis,
  Folder,
  PiIcon,
  Search,
  SearchX,
  ShieldAlert,
} from "lucide-react";
import { format, sub } from "date-fns";
import { NumericFormat } from "react-number-format";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import EditSubjectDialog from "./edit-subject-dialog";

export function SubjectListForm() {
  const { execute, isExecuting, result, status } =
    useAction(searchSubjectAction);

  useEffect(() => {
    execute({ q: undefined });
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        execute(new FormData(e.target));
      }}
    >
      <Field>
        <Input placeholder="Search for subjects" name="q" />
      </Field>

      {(status == "idle" || isExecuting) && <SkeletonTable />}
      {!result.data?.subjects.length && status != "idle" && !isExecuting && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search />
            </EmptyMedia>
            <EmptyTitle>No data</EmptyTitle>
            <EmptyDescription>Subject doesn't exist.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
      {!!(!isExecuting && result.data?.subjects.length) && (
        <Table className="mt-5">
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
            {result.data?.subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell>{subject.subject_code.toUpperCase()}</TableCell>
                <TableCell>{subject.subject_name.toUpperCase()}</TableCell>
                <TableCell>
                  <NumericFormat
                    displayType="text"
                    prefix="₱"
                    value={subject.prices[0]?.price}
                    thousandSeparator
                  />
                </TableCell>
                <TableCell>
                  {format(subject.created_at, "MMM, d yyyy")}
                </TableCell>
                <TableCell className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size={"icon-sm"} variant={"ghost"}>
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <EditSubjectDialog {...subject} />
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem variant="destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </form>
  );
}

function SkeletonTable() {
  return (
    <div className="flex w-full flex-col gap-2 mt-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div className="flex gap-4" key={index}>
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-20" />
        </div>
      ))}
    </div>
  );
}
