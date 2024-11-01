import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./button";

export const Pagination = () => {
  return (
    <div className="flex px-[2rem] justify-start md:justify-center max-w-7xl mx-auto py-[6rem] gap-x-[2rem] gap-y-[1rem] items-center flex-wrap">
      <Button
        disabled
        className="flex items-center justify-center py-4 disabled:bg-[#6F00FF1A] space-x-[1.2rem] max-w-[17rem]"
      >
        <ArrowLeft />
        <span>Prev Page</span>
      </Button>
      <button className="active [&.active]:bg-primary bg-transparent !min-w-[3.8rem] !h-[3.8rem] rounded-full [&.active]:text-white text-muted font-medium">
        1
      </button>
      <button className="[&.active]:bg-primary bg-transparent !min-w-[3.8rem] !h-[3.8rem] rounded-full [&.active]:text-white text-muted font-medium">
        2
      </button>
      <button className="[&.active]:bg-primary bg-transparent !min-w-[3.8rem] !h-[3.8rem] rounded-full [&.active]:text-white text-muted font-medium">
        3
      </button>
      <button className="[&.active]:bg-primary bg-transparent !min-w-[3.8rem] !h-[3.8rem] rounded-full [&.active]:text-white text-muted font-medium">
        ...
      </button>

      <button className="[&.active]:bg-primary bg-transparent !min-w-[3.8rem] !h-[3.8rem] rounded-full [&.active]:text-white text-muted font-medium">
        7
      </button>
      <Button className="flex items-center justify-center py-4 disabled:bg-[#6F00FF1A] space-x-[1.2rem] max-w-[17rem]">
        <span>Next Page</span>
        <ArrowRight />
      </Button>
    </div>
  );
};
