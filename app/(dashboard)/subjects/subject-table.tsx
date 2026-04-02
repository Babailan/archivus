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
import { use, useEffect } from "react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import EditSubjectDialog from "./edit-subject-dialog";
import { useSearchParams, useRouter } from "next/navigation";
import { GetSubjectResult } from "@/services/subject.service";

export function SubjectListForm({
  subjectsPromise,
}: {
  subjectsPromise: Promise<GetSubjectResult>;
}) {
  const subjects = use(subjectsPromise);

  async function deleteSubject() {}
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      {!subjects.subjects.length && (
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
      {!!subjects.subjects.length && (
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
            {subjects.subjects.map((subject) => (
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
import { useDebouncedCallback } from "use-debounce";

export function SearchInput() {
  const params = useSearchParams();
  const router = useRouter();
  const debounced = useDebouncedCallback((value: string) => {
    router.push(`/subjects?q=${value}`);
  }, 300);

  return (
    <Field>
      <Input
        placeholder="Search for subjects"
        name="q"
        defaultValue={params.get("q") || ""}
        onChange={(e) => {
          debounced(e.currentTarget.value);
        }}
      />
    </Field>
  );
}
