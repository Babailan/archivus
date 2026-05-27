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
import { Ellipsis, Pencil, Search, Trash } from "lucide-react";
import { format } from "date-fns";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { use, useState } from "react";
import { SearchDocumentResult } from "@/services/document.service";
import EditDocumentDialog from "./edit-document-dialog";
import DeleteDocumentDialog from "./delete-document-dialog";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

export function DocumentListTable({
  documentsPromise,
}: {
  documentsPromise: Promise<SearchDocumentResult>;
}) {
  const { documents, total, page, pageSize } = use(documentsPromise);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
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
            <EmptyDescription>No documents found.</EmptyDescription>
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
                          <DropdownMenuItem
                            onClick={() => setEditingId(doc.id)}
                          >
                            <Pencil />
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setDeletingId(doc.id)}
                          >
                            <Trash />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <EditDocumentDialog
                      id={doc.id}
                      name={doc.name}
                      description={doc.description}
                      open={editingId === doc.id}
                      onOpenChange={(open) => {
                        if (!open) setEditingId(null);
                      }}
                    />
                    <DeleteDocumentDialog
                      id={doc.id}
                      open={deletingId === doc.id}
                      onOpenChange={(open) => {
                        if (!open) setDeletingId(null);
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
