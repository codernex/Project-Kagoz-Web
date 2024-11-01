import React from "react";
type FilterWrapperProps = {
  title: string;
} & React.PropsWithChildren;

const FilterWrapper: React.FC<FilterWrapperProps> = ({ children, title }) => {
  return (
    <div className="space-y-[.6rem] w-full md:w-fit">
      <p className="font-medium text-black pl-2">{title}</p>
      <div className="border border-[#EBEBEB] bg-[#FAFAFA] w-full p-[.4rem] rounded-md flex flex-col sm:flex-row sm:rounded-xl flex-wrap">
        {children}
      </div>
    </div>
  );
};

export default FilterWrapper;
