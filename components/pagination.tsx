"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function Pagination({ pagination }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/orders?${params.toString()}`);
  };

  if (pagination.totalPages <= 1) {
    return null;
  }

  const startItem = (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(pagination.page * pagination.limit, pagination.totalCount);

  return (
    <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        Showing {startItem} to {endItem} of {pagination.totalCount} orders
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => goToPage(pagination.page - 1)}
          disabled={!pagination.hasPrevPage}
          className="btn disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
            let pageNum;
            if (pagination.totalPages <= 5) {
              pageNum = i + 1;
            } else if (pagination.page <= 3) {
              pageNum = i + 1;
            } else if (pagination.page >= pagination.totalPages - 2) {
              pageNum = pagination.totalPages - 4 + i;
            } else {
              pageNum = pagination.page - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`btn ${
                  pageNum === pagination.page
                    ? "btn-primary"
                    : ""
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        
        <button
          onClick={() => goToPage(pagination.page + 1)}
          disabled={!pagination.hasNextPage}
          className="btn disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
