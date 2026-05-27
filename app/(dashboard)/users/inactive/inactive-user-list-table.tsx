"use client";

import { use } from "react";
import { format } from "date-fns";
import { SearchInactiveUserResult } from "@/services/user.service";
import { Search } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import RestoreUserDialog from "./restore-user-dialog";
import { useState } from "react";

export function InactiveUserListForm({
  usersPromise,
}: {
  usersPromise: Promise<SearchInactiveUserResult>;
}) {
  const { users, total, page, pageSize } = use(usersPromise);
  const [restoringId, setRestoringId] = useState<number | null>(null);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      {!users.length && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search />
            </EmptyMedia>
            <EmptyTitle>No data</EmptyTitle>
            <EmptyDescription>No inactive users found.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
      {!!users.length && (
        <>
          <Table className="mt-5 border">
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                return (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {user.role.map((r) => (
                          <span
                            key={r.role}
                            className="px-2 py-1 text-xs bg-primary/10 rounded-md capitalize"
                          >
                            {r.role}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(user.created_at, "MMM, d yyyy")}
                    </TableCell>
                    <TableCell className="flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => setRestoringId(user.id)}
                      >
                        <RotateCcw /> Undo
                      </Button>
                      <RestoreUserDialog
                        id={user.id}
                        open={restoringId === user.id}
                        onOpenChange={(open) => {
                          if (!open) setRestoringId(null);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <DataTablePagination page={page} totalPages={totalPages} />
        </>
      )}
    </>
  );
}
