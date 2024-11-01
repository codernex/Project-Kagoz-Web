"use client";
import { ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type SearchProps = {
  searchTerm?: string;
  setSearchTerm?: React.Dispatch<React.SetStateAction<string>>;
  searchedResults?: any[];
  ref?: React.LegacyRef<HTMLDivElement> | undefined;
};
const NavSearch: React.FC<SearchProps> = React.memo(({ ref }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [location, setLocation] = useState("Dhaka");
  const [searchDropdown, setSearchDropdown] = useState(false);

  return (
    <div
      onClick={() => {
        inputRef?.current?.focus();
      }}
      ref={ref}
      className="bg-white rounded-xl h-[4rem] lg:h-[5rem] flex items-center pl-[3.2rem] pr-[.8rem] w-full shadow-none z-10 relative"
    >
      <div className="h-full w-full flex items-center space-x-2">
        <svg
          width="21"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_73_27)">
            <path
              d="M20.2556 18.5774L14.5682 12.89C15.6699 11.5292 16.3332 9.80003 16.3332 7.91672C16.3332 3.55177 12.7815 0.00012207 8.41656 0.00012207C4.05161 0.00012207 0.5 3.55173 0.5 7.91669C0.5 12.2816 4.05165 15.8333 8.4166 15.8333C10.2999 15.8333 12.0291 15.17 13.3899 14.0683L19.0773 19.7558C19.2398 19.9182 19.4531 19.9999 19.6665 19.9999C19.8799 19.9999 20.0932 19.9182 20.2557 19.7558C20.5815 19.4299 20.5815 18.9033 20.2556 18.5774ZM8.4166 14.1666C4.96996 14.1666 2.16666 11.3633 2.16666 7.91669C2.16666 4.47004 4.96996 1.66675 8.4166 1.66675C11.8632 1.66675 14.6665 4.47004 14.6665 7.91669C14.6665 11.3633 11.8632 14.1666 8.4166 14.1666Z"
              fill="#6E6777"
            />
          </g>
          <defs>
            <clipPath id="clip0_73_27">
              <rect
                width="20"
                height="20"
                fill="white"
                transform="translate(0.5)"
              />
            </clipPath>
          </defs>
        </svg>

        <Input
          ref={inputRef}
          className="h-fit text-muted outline-none focus:outline-none ring-0 border-none"
          placeholder="Search what you are looking for..."
        />
      </div>
      <div className="w-[1px] h-[40%] border-r-[1px solid] bg-[#6E6777] relative z-10" />
      <Select
        value={location}
        defaultValue={location}
        onValueChange={(e) => setLocation(e)}
      >
        <SelectTrigger className="text-muted border-0">
          <div className="flex items-center space-x-2">
            <svg
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_73_34)">
                <path
                  d="M10.5 0C8.51169 0.00263755 6.60556 0.793661 5.19961 2.19961C3.79366 3.60556 3.00264 5.51169 3 7.5C3 12.8844 9.9875 19.6281 10.2844 19.9125C10.3421 19.9686 10.4195 20 10.5 20C10.5805 20 10.6579 19.9686 10.7156 19.9125C11.0125 19.6281 18 12.8844 18 7.5C17.9974 5.51169 17.2063 3.60556 15.8004 2.19961C14.3944 0.793661 12.4883 0.00263755 10.5 0ZM10.5 10.9375C9.82013 10.9375 9.15552 10.7359 8.59023 10.3582C8.02493 9.98046 7.58434 9.4436 7.32416 8.81548C7.06399 8.18736 6.99591 7.49619 7.12855 6.82938C7.26119 6.16257 7.58858 5.55006 8.06932 5.06932C8.55006 4.58858 9.16257 4.26119 9.82938 4.12855C10.4962 3.99591 11.1874 4.06399 11.8155 4.32416C12.4436 4.58434 12.9805 5.02493 13.3582 5.59023C13.7359 6.15552 13.9375 6.82013 13.9375 7.5C13.937 8.41152 13.5746 9.28554 12.9301 9.93008C12.2855 10.5746 11.4115 10.937 10.5 10.9375Z"
                  fill="#6E6777"
                />
              </g>
              <defs>
                <clipPath id="clip0_73_34">
                  <rect
                    width="20"
                    height="20"
                    fill="white"
                    transform="translate(0.5)"
                  />
                </clipPath>
              </defs>
            </svg>

            <SelectValue placeholder="Location" />
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-[8px] border-purple-500 py-2 md:py-8 px-6">
          <SelectItem className="cursor-pointer" value="Dhaka">
            Dhaka
          </SelectItem>
        </SelectContent>
      </Select>

      <div className="w-fit h-full flex items-center justify-center">
        <Button className=" h-[4rem] w-[4rem] md:h-[5rem] md:w-[5rem] rounded-full p-0">
          <ArrowRight />
        </Button>
      </div>

      {searchDropdown ? (
        <div className="absolute left-0 -bottom-32 w-full bg-white rounded-xs p-[2rem] shadow-md">
          <div className="flex">
            <Button>By Categories</Button>
            <Button>By Business</Button>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
});

export default NavSearch;
NavSearch.displayName = "NavSearch";
