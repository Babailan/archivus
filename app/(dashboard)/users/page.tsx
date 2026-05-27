import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { UserListForm } from "./user-list-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { queryFirst } from "@/lib/helper";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { searchUsers } from "@/services/user.service";
import { SearchInput } from "@/components/ui/search-input";

export const metadata: Metadata = {
  title: "Users",
};

export default async function UserListPage({
  searchParams,
}: PageProps<"/users">) {
  let { q, page } = await searchParams;
  q = queryFirst(q);
  page = queryFirst(page);
  const pageNum = page ? parseInt(page) : 1;
  const users = searchUsers(q, pageNum);

  return (
    <div className="p-10">
      <Breadcrumb className="mb-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard" />}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Users</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl font-bold">List of Users</h1>
        </div>
        <div className="flex gap-2">
          <Link href={"/users/inactive"}>
            <Button variant="outline" className="cursor-pointer">
              View Inactive Users
            </Button>
          </Link>
          <Link href={"/users/create"}>
            <Button className="cursor-pointer">
              <Plus /> New User
            </Button>
          </Link>
        </div>
      </div>
      <SearchInput pathname="/users" />
      <Suspense key={`${q}-${page}`} fallback={<SkeletonTable />}>
        <UserListForm usersPromise={users} />
      </Suspense>
    </div>
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
        </div>
      ))}
    </div>
  );
}
