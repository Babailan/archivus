import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DocumentListTable } from "./document-list-table";
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
import { searchDocument } from "@/services/document.service";
import { SearchInput } from "@/components/ui/search-input";

export const metadata: Metadata = {
  title: "Documents",
};

export default async function DocumentListPage({
  searchParams,
}: PageProps<"/documents">) {
  let { q, page } = await searchParams;
  q = queryFirst(q);
  page = queryFirst(page);
  const pageNum = page ? parseInt(page) : 1;
  const documents = searchDocument(q, pageNum);

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
            <BreadcrumbPage>Documents</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl font-bold">List of Documents</h1>
        </div>
        <div>
          <Link href={"/documents/create"}>
            <Button className="cursor-pointer">
              <Plus /> New Document
            </Button>
          </Link>
        </div>
      </div>
      <SearchInput pathname="/documents" />
      <Suspense key={`${q}-${page}`} fallback={<SkeletonTable />}>
        <DocumentListTable documentsPromise={documents} />
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
          <Skeleton className="h-10 w-20" />
        </div>
      ))}
    </div>
  );
}
