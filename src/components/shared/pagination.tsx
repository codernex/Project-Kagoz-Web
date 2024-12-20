"use client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

type PaginateProps = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  currentPage: number;
};

export const Pagination: React.FC<PaginateProps> = ({
  page,
  setPage,
  totalPages,
  currentPage,
}) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
  };

  return (
    <div className="flex px-[2rem] justify-start md:justify-center max-w-7xl mx-auto py-[6rem] gap-x-[2rem] gap-y-[1rem] items-center flex-wrap">
      <Button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className="flex items-center justify-center py-4 disabled:bg-[#6F00FF1A] space-x-[1.2rem] max-w-[17rem]"
      >
        <ArrowLeft />
        <span>Prev Page</span>
      </Button>

      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => handlePageClick(index + 1)}
          className={cn(
            "[&.active]:bg-primary bg-transparent !min-w-[3.8rem] !h-[3.8rem] rounded-full [&.active]:text-white text-muted font-medium",
            currentPage === index + 1 ? "active" : ""
          )}
        >
          {index + 1}
        </button>
      ))}

      <Button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center py-4 disabled:bg-[#6F00FF1A] space-x-[1.2rem] max-w-[17rem]"
      >
        <span>Next Page</span>
        <ArrowRight />
      </Button>
    </div>
  );
};
