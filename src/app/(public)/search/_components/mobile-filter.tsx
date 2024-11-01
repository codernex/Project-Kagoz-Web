import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Checkbox } from "@radix-ui/react-checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FilterIcon } from "lucide-react";
import FilterWrapper from "./filter-wrapper";

interface MobileFilterProps {
  activeSearchType: "Business" | "Category";
  setActiveSearchType: React.Dispatch<
    React.SetStateAction<"Business" | "Category">
  >;
  setLisenceType: React.Dispatch<
    React.SetStateAction<"KAGOZ" | "Verified Lisence">
  >;
  setAvalibility: React.Dispatch<
    React.SetStateAction<"Now Open" | "Now Closed">
  >;
  lisenceType: "KAGOZ" | "Verified Lisence";
  avalibility: "Now Open" | "Now Closed";
}

const sortBy = [
  {
    name: "Relevance",
    value: "Relevance",
  },
  {
    name: "Recommended",
    value: "Recommended",
  },
  {
    name: "Newest",
    value: "Newest",
  },
  {
    name: "Ratings",
    value: "Ratings",
  },
];

export const MobileFilter: React.FC<MobileFilterProps> = ({
  activeSearchType,
  setActiveSearchType,
  lisenceType,
  setLisenceType,
  setAvalibility,
  avalibility,
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
          <FilterWrapper title="Search Type">
            <button
              className={cn(
                "px-[1rem] py-[.8rem]  text-muted rounded-full",
                activeSearchType === "Category" ? "bg-primary text-white" : "",
              )}
            >
              Categories
            </button>
            <button
              className={cn(
                "px-[1rem] py-[.8rem]  text-muted rounded-full",
                activeSearchType === "Business" ? "bg-primary text-white" : "",
              )}
            >
              Business
            </button>
          </FilterWrapper>
          <FilterWrapper title="Licensed & Trusted">
            <div className="flex items-center px-[1rem] py-[.6rem] text-muted space-x-2">
              <Checkbox
                className="w-8 h-8 rounded-[.4rem] border-muted"
                checked={lisenceType === "KAGOZ"}
                onCheckedChange={(e) => {
                  setLisenceType("KAGOZ");
                }}
              />
              <p>Trusted By KAGOZ</p>
            </div>
            <div className="flex items-center px-[1rem] py-[.6rem] text-muted space-x-2">
              <Checkbox
                className="w-8 h-8 rounded-[.4rem] border border-muted"
                checked={lisenceType === "Verified Lisence"}
                onCheckedChange={(e) => {
                  setLisenceType("Verified Lisence");
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
              <Select defaultValue="Recommended">
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
