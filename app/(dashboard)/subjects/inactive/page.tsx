import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { InactiveSubjectListForm } from "./inactive-subject-list-table";
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
import { searchInactiveSubject } from "@/services/subject.service";
import { SearchInput } from "@/components/ui/search-input";

export const metadata: Metadata = {
  title: "Inactive Subjects",
};

export default async function InactiveSubjectListPage({
  searchParams,
}: PageProps<"/subjects/inactive">) {
  let { q, page } = await searchParams;
  q = queryFirst(q);
  page = queryFirst(page);
  const pageNum = page ? parseInt(page) : 1;
  const subjects = searchInactiveSubject(q, pageNum);

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
            <BreadcrumbLink render={<Link href="/subjects" />}>
              Subjects
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Inactive</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl font-bold">List of Inactive Subjects</h1>
        </div>
        <div>
          <Link href={"/subjects"}>
            <Button variant="outline" className="cursor-pointer">
              <ArrowLeft /> Back
            </Button>
          </Link>
        </div>
      </div>
      <SearchInput pathname="/subjects/inactive" />
      <Suspense key={`${q}-${page}`} fallback={<SkeletonTable />}>
        <InactiveSubjectListForm subjectsPromise={subjects} />
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
