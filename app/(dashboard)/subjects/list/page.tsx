import { Button } from "@/components/ui/button";
import { Ellipsis, Plus } from "lucide-react";
import { searchSubjectAction } from "./action";
import Link from "next/link";
import { SearchInput } from "./search-input";

import { format } from "date-fns";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SubjectTableList } from "./subject-table";
import { Spinner } from "@/components/ui/spinner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function SubjectListPage({
  searchParams,
}: PageProps<"/subjects/list">) {
  const t = new URLSearchParams((await searchParams) as Record<string, string>);
  const q = t.get("q") ?? "";
  console.log(t);
  return (
    <div className="p-10">
      <Breadcrumb className="mb-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/home">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Subjects</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl font-bold">List of subjects</h1>
        </div>
        <div>
          <Link href={"/subjects/create"}>
            <Button className="cursor-pointer" size={"sm"}>
              <Plus /> New Subject
            </Button>
          </Link>
        </div>
      </div>
      <SearchInput />

      <Suspense key={q} fallback={<Spinner className="size-8 m-auto" />}>
        <SubjectTableList q={q} />
      </Suspense>
    </div>
  );
}
