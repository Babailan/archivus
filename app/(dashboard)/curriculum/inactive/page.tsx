import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
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
import { searchInactiveCurriculum } from "@/services/curriculum.service";
import { SearchInput } from "@/components/ui/search-input";
import { InactiveCurriculumListForm } from "./inactive-curriculum-list-table";

export const metadata: Metadata = {
  title: "Inactive Curriculum",
};

export default async function InactiveCurriculumPage({
  searchParams,
}: PageProps<"/curriculum/inactive">) {
  let { q, page } = await searchParams;
  q = queryFirst(q);
  page = queryFirst(page);
  const pageNum = page ? parseInt(page) : 1;
  const curriculums = searchInactiveCurriculum(q, pageNum);

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
            <BreadcrumbLink render={<Link href="/curriculum" />}>
              Curriculum
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Inactive Curriculum</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl font-bold">Inactive Curriculum</h1>
          <p className="text-sm text-muted-foreground">
            List of curriculum that are currently deactivated.
          </p>
        </div>
        <div>
          <Link href={"/curriculum"}>
            <Button variant="outline" className="cursor-pointer">
              <ArrowLeft /> Back to Curriculum
            </Button>
          </Link>
        </div>
      </div>
      <SearchInput pathname="/curriculum/inactive" />
      <Suspense key={`${q}-${page}`} fallback={<SkeletonTable />}>
        <InactiveCurriculumListForm curriculumsPromise={curriculums} />
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
