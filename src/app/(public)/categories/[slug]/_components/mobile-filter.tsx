import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterIcon } from "lucide-react";
import FilterWrapper from "./filter-wrapper";

interface MobileFilterProps {
  setLisenceType: React.Dispatch<
    React.SetStateAction<"KAGOZ" | "Verified Lisence" | "None">
  >;
  setAvalibility: React.Dispatch<
    React.SetStateAction<"Now Open" | "Now Closed">
  >;
  lisenceType: "KAGOZ" | "Verified Lisence" | "None";
  avalibility: "Now Open" | "Now Closed";
  sortBy: string,
  setSortBy: React.Dispatch<React.SetStateAction<string>>
}

const sortBy = [
  {
    name: "Recommended",
    value: "recommended",
  },
  {
    name: "Newest",
    value: "newest",
  }, {
    name: "Oldest",
    value: "oldest",
  },
  {
    name: "Ratings",
    value: "ratings",
  },
];

export const MobileFilter: React.FC<MobileFilterProps> = ({
  lisenceType,
  setLisenceType,
  setAvalibility,
  avalibility,
  setSortBy,
  sortBy: sortValue
}) => {
  return (
    <div className="md:hidden w-full my-4">
      <DropdownMenu>
        <DropdownMenuTrigger className="border border-muted py-4 w-full rounded-md">
          <div className="w-full flex justify-between px-12 items-center">
            <p>Filters</p>
            <FilterIcon />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[32rem] py-6 space-y-6 md:hidden px-4">
          <FilterWrapper title="Licensed & Trusted">
            <div className="flex items-center px-[1rem] py-[.6rem] text-muted space-x-2">
              <Checkbox
                className="w-8 h-8 rounded-[.4rem] border-muted"
                checked={lisenceType === "KAGOZ"}
                onCheckedChange={(e) => {
                  if (lisenceType === "None") {
                    setLisenceType("KAGOZ")
                  } else {
                    setLisenceType("None")
                  };
                }}
              />
              <p>Trusted By KAGOZ</p>
            </div>
            <div className="flex items-center px-[1rem] py-[.6rem] text-muted space-x-2">
              <Checkbox
                className="w-8 h-8 rounded-[.4rem] border border-muted"
                checked={lisenceType === "Verified Lisence"}
                onCheckedChange={(e) => {
                  if (lisenceType === "None") {
                    setLisenceType("Verified Lisence")
                  } else {
                    setLisenceType("None")
                  };
                }}
              />
              <p>Verified License</p>
            </div>
          </FilterWrapper>

          <FilterWrapper title="Licensed & Trusted">
            <div className="flex items-center px-[1rem] py-[.6rem] text-muted space-x-2">
              <Checkbox
                className="w-8 h-8 rounded-[.4rem] border-muted"
                checked={avalibility === "Now Open"}
                onCheckedChange={(e) => {
                  setAvalibility("Now Open");
                }}
              />
              <p>Now Open</p>
            </div>
            <div className="flex items-center px-[1rem] py-[.6rem] text-muted space-x-2">
              <Checkbox
                className="w-8 h-8 rounded-[.4rem] border border-muted"
                checked={avalibility === "Now Closed"}
                onCheckedChange={(e) => {
                  setAvalibility("Now Closed");
                }}
              />
              <p>Now Closed</p>
            </div>
          </FilterWrapper>

          <FilterWrapper title="Sort By">
            <div className="px-[1rem] py-[.6rem] w-full">
              <Select value={sortValue} onValueChange={setSortBy} defaultValue="Recommended">
                <SelectTrigger className="border-none bg-transparent text-muted flex w-full !justify-between">
                  <SelectValue
                    placeholder="Sort By"
                    className="flex justify-between text-muted w-full"
                  />
                </SelectTrigger>
                <SelectContent className="w-full border-none px-4 py-4 shadow-md">
                  {sortBy.map((option) => (
                    <SelectItem
                      className="cursor-pointer text-muted my-4"
                      value={option.value}
                      key={option.value}
                    >
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </FilterWrapper>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
