"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type PaginateProps = {
  totalPages: number;
  page: number;
  setPage: (page: number) => void;
  className?: string;
  dataLength?: number;
};

export const Pagination: React.FC<PaginateProps> = ({ totalPages, page: currentPage, setPage, className, dataLength = 0 }) => {
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
    <div className={cn(
      "flex justify-start md:justify-center max-w-7xl mx-auto gap-x-[2rem] gap-y-[1rem] items-center flex-wrap px-[2rem] py-[6rem]",
      className
    )}>
      <button
        onClick={() => updatePage(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center py-4  space-x-[1.2rem] max-w-[17rem]"
      >
       <ChevronLeft />

      </button>

      {pagination.map((pageNumber, index) => (
        typeof pageNumber === "number" ? (
          <button
            key={index}
            onClick={() => updatePage(pageNumber)}
            className={cn(
              "[&.active]:bg-primary bg-transparent !min-w-[3.8rem] !h-[3.8rem] rounded-[8px] [&.active]:text-white text-muted font-medium",
              currentPage === pageNumber ? "active" : ""
            )}
          >
            {pageNumber}
          </button>
        ) : (
          <span key={index} className="text-muted font-medium">{pageNumber}</span>
        )
      ))}

      <button
        onClick={() => updatePage(currentPage + 1)}
        disabled={currentPage === totalPages || dataLength < 9}
        className={`flex items-center justify-center py-4 space-x-[1.2rem] max-w-[17rem] ${
          currentPage === totalPages || dataLength < 9 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-gray-100'
        }`}
      >
        <ChevronRight />
      </button>
    </div>
  );
};