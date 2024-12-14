import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Checkbox } from "@radix-ui/react-checkbox";
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

export const OtherFilter: React.FC<MobileFilterProps> = ({
  activeSearchType,
  setActiveSearchType,
  lisenceType,
  setLisenceType,
  setAvalibility,
  avalibility,
}) => {
  return (
    <div className="hidden md:flex py-[3rem] flex-wrap md:space-x-0 gap-x-4 gap-y-6">
      <FilterWrapper title="Search Type">
        <button
          className={cn(
            "px-[2rem] py-[1.2rem]  text-muted rounded-full",
            activeSearchType === "Category" ? "bg-primary text-white" : "",
          )}
        >
          Categories
        </button>
        <button
          className={cn(
            "px-[2rem] py-[1.2rem]  text-muted rounded-full",
            activeSearchType === "Business" ? "bg-primary text-white" : "",
          )}
        >
          Business
        </button>
      </FilterWrapper>
      <FilterWrapper title="Licensed & Trusted">
        <div className="flex items-center py-[1.2rem] px-[2rem] text-muted space-x-2">
          <Checkbox
            className="w-8 h-8 rounded-[.4rem] border-muted"
            checked={lisenceType === "KAGOZ"}
            onCheckedChange={(e) => {
              setLisenceType("KAGOZ");
            }}
          />
          <p>Trusted By KAGOZ</p>
        </div>
        <div className="flex items-center py-[1.2rem] px-[2rem] text-muted space-x-2">
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
        <div className="flex items-center py-[1.2rem] px-[2rem] text-muted space-x-2">
          <Checkbox
            className="w-8 h-8 rounded-[.4rem] border-muted"
            checked={avalibility === "Now Open"}
            onCheckedChange={(e) => {
              setAvalibility("Now Open");
            }}
          />
          <p>Now Open</p>
        </div>
        <div className="flex items-center py-[1.2rem] px-[2rem] text-muted space-x-2">
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
        <div className="px-[2rem] py-[1.2rem] w-full">
          <Select defaultValue="Recommended">
            <SelectTrigger className="border-none bg-transparent min-w-[15rem] text-muted">
              <SelectValue
                placeholder="Sort By"
                className="flex justify-between text-muted"
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
    </div>
  );
};
