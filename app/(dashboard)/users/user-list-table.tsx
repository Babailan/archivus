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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { Roles } from "@/app/generated/prisma/enums";

const ADMIN_ROLE = "admin" as const;

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
            <EmptyDescription>User doesn&apos;t exist.</EmptyDescription>
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
            {users.map((user) => {
              const isAdmin = user.role.some((r) => r.role === ADMIN_ROLE);
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
                  <TableCell>
                    {!isAdmin ? (
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
                            <Link
                              href={`/users/edit/${user.id}`}
                              className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                            >
                              Edit
                            </Link>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : null}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </>
  );
}
