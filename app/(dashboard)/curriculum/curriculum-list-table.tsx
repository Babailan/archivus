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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { use } from "react";
import { SearchSubjectResult } from "@/services/curriculum.service";
import EditCurriculumDialog from "./edit-curriculum-dialog";
import DeleteCurriculumDialog from "./delete-curriculum-dialog";

export function CurriculumListForm({
  curriculumsPromise,
}: {
  curriculumsPromise: Promise<SearchSubjectResult>;
}) {
  const data = use(curriculumsPromise);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      {!data.curriculums.length && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search />
            </EmptyMedia>
            <EmptyTitle>No data</EmptyTitle>
            <EmptyDescription>Curriculum doesn't exist.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
      {!!data.curriculums.length && (
        <Table className="mt-5">
          <TableHeader>
            <TableRow>
              <TableHead>Curriculum Code</TableHead>
              <TableHead>Curriculum Name</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.curriculums.map((curriculum) => (
              <TableRow key={curriculum.id}>
                <TableCell>
                  {curriculum.curriculum_code.toUpperCase()}
                </TableCell>
                <TableCell>
                  {curriculum.curriculum_name.toUpperCase()}
                </TableCell>
                <TableCell>
                  {format(curriculum.created_at, "MMM, d yyyy")}
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
                        <EditCurriculumDialog id={curriculum.id} />
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DeleteCurriculumDialog id={curriculum.id} />
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
