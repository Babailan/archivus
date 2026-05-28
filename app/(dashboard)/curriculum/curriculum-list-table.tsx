"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { use, useState } from "react";
import { format } from "date-fns";
import { SearchCurriculumResult } from "@/services/curriculum.service";
import EditCurriculumDialog from "./edit-curriculum-dialog";
import DeleteCurriculumDialog from "./delete-curriculum-dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Archive, Ellipsis, Pencil, Search } from "lucide-react";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import Link from "next/link";

export function CurriculumListForm({
  curriculumsPromise,
}: {
  curriculumsPromise: Promise<SearchCurriculumResult>;
}) {
  const { curriculums, total, page, pageSize } = use(curriculumsPromise);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      {!curriculums.length && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search />
            </EmptyMedia>
            <EmptyTitle>No data</EmptyTitle>
            <EmptyDescription>Curriculum doesn&apos;t exist.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
      {!!curriculums.length && (
        <>
          <Table className="mt-5 border">
            <TableHeader>
              <TableRow>
                <TableHead>Curriculum Code</TableHead>
                <TableHead>Curriculum Name</TableHead>
                <TableHead>Grade Level</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {curriculums.map((curriculum) => (
                <TableRow key={curriculum.id}>
                  <TableCell className="uppercase">
                    {curriculum.curriculum_code}
                  </TableCell>
                  <TableCell className="uppercase">
                    {curriculum.curriculum_name}
                  </TableCell>
                  <TableCell className="uppercase">
                    {curriculum.grade_level}
                  </TableCell>
                  <TableCell>
                    {format(curriculum.created_at, "MMM, d yyyy")}
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
                        <Link href={`/curriculum/edit/${curriculum.id}`}>
                        <DropdownMenuItem>
                          <Pencil />
                          Edit
                        </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setDeletingId(curriculum.id)}
                        >
                          <Archive /> Archived
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DeleteCurriculumDialog
            id={deletingId}
            open={deletingId != null}
            onOpenChange={(v) => !v && setDeletingId(null)}
          />
          <DataTablePagination page={page} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
