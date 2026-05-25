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
import { searchInactiveDocument } from "@/services/document.service";
import { SearchInput } from "@/components/ui/search-input";
import { InactiveDocumentListTable } from "./inactive-document-list-table";

export const metadata: Metadata = {
  title: "Inactive Documents",
};

export default async function InactiveDocumentListPage({
  searchParams,
}: PageProps<"/documents/inactive">) {
  let { q, page } = await searchParams;
  q = queryFirst(q);
  page = queryFirst(page);
  const pageNum = page ? parseInt(page) : 1;
  const documents = searchInactiveDocument(q, pageNum);

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
            <BreadcrumbLink render={<Link href="/documents" />}>
              Documents
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Inactive Documents</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl font-bold">Inactive Documents</h1>
          <p className="text-sm text-muted-foreground">
            List of documents that are currently deactivated.
          </p>
        </div>
        <div>
          <Link href={"/documents"}>
            <Button variant="outline" className="cursor-pointer">
              <ArrowLeft /> Back to Documents
            </Button>
          </Link>
        </div>
      </div>
      <SearchInput pathname="/documents/inactive" />
      <Suspense key={`${q}-${page}`} fallback={<SkeletonTable />}>
        <InactiveDocumentListTable documentsPromise={documents} />
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
