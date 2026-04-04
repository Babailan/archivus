import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { CurriculumListForm } from "./curriculum-list-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { queryFirst } from "@/lib/utils";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { searchCurriculum } from "@/services/curriculum.service";
import { SearchInput } from "@/components/ui/search-input";

export default async function CurriculumPage({
  searchParams,
}: PageProps<"/curriculum">) {
  let { q } = await searchParams;
  q = queryFirst(q);
  const curriculums = searchCurriculum(q);
  return (
    <div className="p-10">
      <Breadcrumb className="mb-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              render={<Link href="/dashboard">Home</Link>}
            ></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Curriculum</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl font-bold">List of Curriculum</h1>
        </div>
        <div>
          <Link href={"/curriculum/create"}>
            <Button className="cursor-pointer">
              <Plus /> New Curriculum
            </Button>
          </Link>
        </div>
      </div>
      <SearchInput pathname="/curriculum" />
      <Suspense key={q} fallback={<SkeletonTable />}>
        <CurriculumListForm curriculumsPromise={curriculums} />
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
