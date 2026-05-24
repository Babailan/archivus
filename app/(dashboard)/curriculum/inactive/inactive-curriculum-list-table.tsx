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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { use, useState } from "react";
import { SearchInactiveCurriculumResult } from "@/services/curriculum.service";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useAction } from "next-safe-action/hooks";
import { undoCurriculumAction } from "../action";
import { toast } from "sonner";

export function InactiveCurriculumListForm({
  curriculumsPromise,
}: {
  curriculumsPromise: Promise<SearchInactiveCurriculumResult>;
}) {
  const { curriculums, total, page, pageSize } = use(curriculumsPromise);
  const [undoingId, setUndoingId] = useState<number | null>(null);
  const { executeAsync } = useAction(undoCurriculumAction);
  const totalPages = Math.ceil(total / pageSize);

  const handleUndo = async (id: number) => {
    setUndoingId(id);
    const { data } = await executeAsync({ id });
    if (data) {
      toast.success("Curriculum restored successfully");
    }
    setUndoingId(null);
  };

  return (
    <>
      {!curriculums.length && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search />
            </EmptyMedia>
            <EmptyTitle>No data</EmptyTitle>
            <EmptyDescription>No inactive curriculum found.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
      {!!curriculums.length && (
        <>
          <Table className="my-5 border">
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
                    <Button
                      size="sm"
                      variant="outline"
                      className="cursor-pointer"
                      disabled={undoingId === curriculum.id}
                      onClick={() => handleUndo(curriculum.id)}
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
