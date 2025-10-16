import React from "react";

const CategoryItemSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-y-[.5rem] rounded-sm bg-white px-[2.4rem] py-[1rem] lg:gap-y-[2rem] lg:py-[3.2rem] animate-pulse">
      {/* Icon Placeholder */}
      <div className="flex h-[6rem] w-[6rem] items-center justify-center rounded-full border-[1px] border-gray-200 bg-gray-100 lg:h-[8rem] lg:w-[8rem]" />

      {/* Title Placeholder */}
      <div className="h-4 w-24 rounded bg-gray-200 lg:h-5 lg:w-32" />

      {/* Business Count Placeholder */}
      <div className="flex h-[2.4rem] w-[5rem] items-center justify-center rounded-xl border-[1px] border-gray-200 bg-gray-100 lg:h-[3.4rem] lg:w-[6.8rem]">
        <div className="h-3 w-8 rounded bg-gray-200 lg:h-4 lg:w-10" />
      </div>
    </div>
  );
};

export default CategoryItemSkeleton;
