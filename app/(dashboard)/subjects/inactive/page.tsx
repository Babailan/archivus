import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
<<<<<<< HEAD
=======
import { InactiveSubjectListForm } from "./inactive-subject-list-table";
>>>>>>> 5af488d21300c90329e780965d846f9ab0eec2b0
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
<<<<<<< HEAD
import { InactiveSubjectListForm } from "./inactive-subject-list-table";
=======
>>>>>>> 5af488d21300c90329e780965d846f9ab0eec2b0

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
<<<<<<< HEAD
            <BreadcrumbPage>Inactive Subjects</BreadcrumbPage>
=======
            <BreadcrumbPage>Inactive</BreadcrumbPage>
>>>>>>> 5af488d21300c90329e780965d846f9ab0eec2b0
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between items-center mb-5">
        <div>
<<<<<<< HEAD
          <h1 className="text-xl font-bold">Inactive Subjects</h1>
          <p className="text-sm text-muted-foreground">
            List of subjects that are currently deactivated.
          </p>
=======
          <h1 className="text-xl font-bold">List of Inactive Subjects</h1>
>>>>>>> 5af488d21300c90329e780965d846f9ab0eec2b0
        </div>
        <div>
          <Link href={"/subjects"}>
            <Button variant="outline" className="cursor-pointer">
<<<<<<< HEAD
              <ArrowLeft /> Back to Subjects
=======
              <ArrowLeft /> Back
>>>>>>> 5af488d21300c90329e780965d846f9ab0eec2b0
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
