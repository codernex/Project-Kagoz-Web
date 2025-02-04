"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

type PaginateProps = {
  totalPages: number;
  page: number;
  setPage: (page: number) => void;
};

export const Pagination: React.FC<PaginateProps> = ({ totalPages, page: currentPage, setPage }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updatePage = (pageNumber: number) => {
    setPage(pageNumber);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    router.push(`?${params.toString()}`, { scroll: false });
    window.scrollTo({
      behavior: 'smooth',
      top: 400
    })
  };

  // Pagination logic to show 7-8 pages at a time with ellipses
  const pagination = [];
  if (totalPages <= 8) {
    pagination.push(...Array.from({ length: totalPages }, (_, i) => i + 1));
  } else {
    pagination.push(1);
    if (currentPage > 4) pagination.push("...");

    const startPage = Math.max(2, currentPage - 3);
    const endPage = Math.min(totalPages - 1, currentPage + 3);

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(i);
    }

    if (currentPage < totalPages - 4) pagination.push("...");
    pagination.push(totalPages);
  }

  return (
    <div className="flex px-[2rem] justify-start md:justify-center max-w-7xl mx-auto py-[6rem] gap-x-[2rem] gap-y-[1rem] items-center flex-wrap">
      <Button
        onClick={() => updatePage(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center py-4 disabled:bg-[#6F00FF1A] space-x-[1.2rem] max-w-[17rem]"
      >
        <ArrowLeft />
        <span>Prev Page</span>
      </Button>

      {pagination.map((pageNumber, index) => (
        typeof pageNumber === "number" ? (
          <button
            key={index}
            onClick={() => updatePage(pageNumber)}
            className={cn(
              "[&.active]:bg-primary bg-transparent !min-w-[3.8rem] !h-[3.8rem] rounded-full [&.active]:text-white text-muted font-medium",
              currentPage === pageNumber ? "active" : ""
            )}
          >
            {pageNumber}
          </button>
        ) : (
          <span key={index} className="text-muted font-medium">{pageNumber}</span>
        )
      ))}

      <Button
        onClick={() => updatePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center py-4 disabled:bg-[#6F00FF1A] space-x-[1.2rem] max-w-[17rem]"
      >
        <span>Next Page</span>
        <ArrowRight />
      </Button>
    </div>
  );
};