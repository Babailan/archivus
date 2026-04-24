"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface DataTablePaginationProps {
  page: number;
  totalPages: number;
}

export function DataTablePagination({
  page,
  totalPages,
}: DataTablePaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handlePageChange = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    pageNumber: number,
  ) => {
    e.preventDefault();
    router.push(createPageUrl(pageNumber));
  };

  if (totalPages <= 1) return null;

  return (
    <Pagination className="my-5">
      <PaginationContent>
        {page > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={createPageUrl(page - 1)}
              onClick={(e) => handlePageChange(e, page - 1)}
            />
          </PaginationItem>
        )}

        {totalPages <= 7 ? (
          Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                href={createPageUrl(p)}
                isActive={page === p}
                onClick={(e) => handlePageChange(e, p)}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))
        ) : (
          <>
            {page > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {page <= 3
              ? [1, 2, 3, 4].map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href={createPageUrl(p)}
                      isActive={page === p}
                      onClick={(e) => handlePageChange(e, p)}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))
              : page >= totalPages - 2
                ? [
                    totalPages - 3,
                    totalPages - 2,
                    totalPages - 1,
                    totalPages,
                  ].map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href={createPageUrl(p)}
                        isActive={page === p}
                        onClick={(e) => handlePageChange(e, p)}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))
                : [page - 1, page, page + 1].map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href={createPageUrl(p)}
                        isActive={page === p}
                        onClick={(e) => handlePageChange(e, p)}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

            {page < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {page < totalPages && (
          <PaginationItem>
            <PaginationNext
              href={createPageUrl(page + 1)}
              onClick={(e) => handlePageChange(e, page + 1)}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
