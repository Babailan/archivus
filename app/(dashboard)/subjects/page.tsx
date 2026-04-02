import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { SearchInput, SubjectListForm } from "./subject-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import prisma from "@/lib/dbClient";
import { queryFirst, sleep } from "@/lib/utils";
import { SubjectFindManyArgs } from "@/app/generated/prisma/models";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function SubjectListPage({
  searchParams,
}: PageProps<"/subjects">) {
  let { q } = await searchParams;
  q = queryFirst(q);
  const subjects = searchSubject(q);

  return (
    <div className="p-10">
      <Breadcrumb className="mb-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Home</Link>
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
        <div>
          <Link href={"/subjects/create"}>
            <Button className="cursor-pointer">
              <Plus /> New Subject
            </Button>
          </Link>
        </div>
      </div>
      <SearchInput />
      <Suspense key={q} fallback={<SkeletonTable />}>
        <SubjectListForm subjectsPromise={subjects} />
      </Suspense>
    </div>
  );
}

export type SearchSubjectResult = Awaited<ReturnType<typeof searchSubject>>;

async function searchSubject(q: string) {
  await sleep(3000);
  const select: SubjectFindManyArgs = {};
  if (q) {
    select.where = { OR: [{ subject_code: q }, { subject_name: q }] };
  }

  let find = await prisma.subject.findMany({
    ...select,
    include: {
      prices: {
        take: 1,
        orderBy: {
          created_at: "desc",
        },
      },
    },
  });

  return {
    subjects: find.map((v) => ({
      ...v,
      prices: v.prices.map((p) => ({ ...p, price: p.price.toNumber() })),
    })),
  };
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
