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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { use, useState } from "react";
import { SearchInactiveDocumentResult } from "@/services/document.service";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import RestoreDocumentDialog from "./restore-document-dialog";

export function InactiveDocumentListTable({
  documentsPromise,
}: {
  documentsPromise: Promise<SearchInactiveDocumentResult>;
}) {
  const { documents, total, page, pageSize } = use(documentsPromise);
  const [restoringId, setRestoringId] = useState<number | null>(null);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      {!documents.length && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search />
            </EmptyMedia>
            <EmptyTitle>No data</EmptyTitle>
            <EmptyDescription>No inactive documents found.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
      {!!documents.length && (
        <>
          <Table className="my-5 border">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.id}</TableCell>
                  <TableCell>{doc.name.toUpperCase()}</TableCell>
                  <TableCell>{doc.description ?? "—"}</TableCell>
                  <TableCell>{format(doc.created_at, "MMM, d yyyy")}</TableCell>
                  <TableCell className="flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => setRestoringId(doc.id)}
                    >
                      <RotateCcw /> Undo
                    </Button>
                    <RestoreDocumentDialog
                      id={doc.id}
                      open={restoringId === doc.id}
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
