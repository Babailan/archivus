import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Archive, Plus } from "lucide-react";
import Link from "next/link";
import { SubjectListForm } from "./subject-list-table";
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
import { searchSubject } from "@/services/subject.service";
import { SearchInput } from "@/components/ui/search-input";

export const metadata: Metadata = {
  title: "Subjects",
};

export default async function SubjectListPage({
  searchParams,
}: PageProps<"/subjects">) {
  let { q, page } = await searchParams;
  q = queryFirst(q);
  page = queryFirst(page);
  const pageNum = page ? parseInt(page) : 1;
  const subjects = searchSubject(q, pageNum);

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
            <BreadcrumbPage>Subjects</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl font-bold">List of Subjects</h1>
        </div>
        <div className="flex gap-2">
          <Link href={"/subjects/inactive"}>
            <Button variant="outline" className="cursor-pointer">
              <Archive /> Inactive
            </Button>
          </Link>
          <Link href={"/subjects/create"}>
            <Button className="cursor-pointer">
              <Plus /> New Subject
            </Button>
          </Link>
        </div>
      </div>
      <SearchInput pathname="/subjects" />
      <Suspense key={`${q}-${page}`} fallback={<SkeletonTable />}>
        <SubjectListForm subjectsPromise={subjects} />
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
          <Skeleton className="h-10 w-20" />
        </div>
      ))}
    </div>
  );
}
