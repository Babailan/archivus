"use client";

import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { use } from "react";
import { SearchUserResult } from "@/services/user.service";
import { Search } from "lucide-react";

export function UserListForm({
  usersPromise,
}: {
  usersPromise: Promise<SearchUserResult>;
}) {
  const { users } = use(usersPromise);
  return (
    <>
      {!users.length && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search />
            </EmptyMedia>
            <EmptyTitle>No data</EmptyTitle>
            <EmptyDescription>User doesn't exist.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
      {!!users.length && (
        <Table className="mt-5">
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Date Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
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
                <TableCell>{format(user.created_at, "MMM, d yyyy")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
