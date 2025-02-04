import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FilterWrapper from "./filter-wrapper";

interface MobileFilterProps {
  setLisenceType: React.Dispatch<
    React.SetStateAction<"KAGOZ" | "Verified Lisence" | "None">
  >;
  setAvalibility: React.Dispatch<
    React.SetStateAction<"Now Open" | "Now Closed" | "N/A">
  >;
  lisenceType: "KAGOZ" | "Verified Lisence" | "None";
  avalibility: "Now Open" | "Now Closed" | "N/A";
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

export const OtherFilter: React.FC<MobileFilterProps> = ({
  lisenceType,
  setLisenceType,
  setAvalibility,
  avalibility,
  setSortBy,
  sortBy: sortValue
}) => {
  return (
    <div className="hidden md:flex py-[3rem] flex-wrap md:space-x-0 gap-x-4 gap-y-6">

      <FilterWrapper title="Licensed & Trusted">
        <div className="flex items-center py-[1.2rem] px-[2rem] text-muted space-x-2">
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
        <div className="flex items-center py-[1.2rem] px-[2rem] text-muted space-x-2">
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
        <div className="flex items-center py-[1.2rem] px-[2rem] text-muted space-x-2">
          <Checkbox
            className="w-8 h-8 rounded-[.4rem] border-muted"
            checked={avalibility === "Now Open"}
            onCheckedChange={(e) => {
              setAvalibility(prev => prev === "Now Open" ? "N/A" : "Now Open");
            }}
          />
          <p>Now Open</p>
        </div>
        <div className="flex items-center py-[1.2rem] px-[2rem] text-muted space-x-2">
          <Checkbox
            className="w-8 h-8 rounded-[.4rem] border border-muted"
            checked={avalibility === "Now Closed"}
            onCheckedChange={(e) => {
              setAvalibility(prev => prev === "Now Closed" ? "N/A" : "Now Closed");
            }}
          />
          <p>Now Closed</p>
        </div>
      </FilterWrapper>

      <FilterWrapper title="Sort By">
        <div className="px-[2rem] py-[1.2rem] w-full">
          <Select
            value={sortValue}
            onValueChange={setSortBy}
          >
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
