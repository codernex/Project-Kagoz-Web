"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { locationData } from "../location";

type SearchProps = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  ref?: React.LegacyRef<HTMLDivElement> | undefined;
  handleFocus: () => void;
  location: string
  setLocation: React.Dispatch<React.SetStateAction<string>>
};
const Search: React.FC<SearchProps> = React.memo(({ ref, searchTerm, setSearchTerm, handleFocus, location, setLocation }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div
      onClick={() => {
        inputRef?.current?.focus();
      }}
      ref={ref}
      className="bg-white rounded-2xl h-[6rem] lg:h-[8rem] flex items-center pl-6 pr-2 w-full shadow-lg hover:shadow-xl focus-within:shadow-2xl transition-all duration-300 z-10 relative border border-gray-100"
    >
      <div className="h-full w-full flex items-center space-x-4">
        <div className="flex-shrink-0">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-400 transition-colors duration-200"
          >
            <path
              d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <Input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          ref={inputRef}
          onFocus={handleFocus}
          className="h-fit text-gray-700 placeholder:text-gray-400 outline-none focus:outline-none ring-0 border-none bg-transparent text-lg font-medium"
          placeholder="Search what you are looking for..."
        />
      </div>
      
      <div className="w-px h-12 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200 relative z-10 mx-2" />
      
      <Select
        value={location}
        defaultValue={location}
        onValueChange={(e) => setLocation(e)}
      >
        <SelectTrigger className="text-gray-600 border-0 bg-transparent hover:bg-gray-50 rounded-xl px-4 py-2 transition-colors duration-200">
          <div className="flex items-center space-x-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-500"
            >
              <path
                d="M10 0C7.23858 0 5 2.23858 5 5C5 8.5 10 15 10 15C10 15 15 8.5 15 5C15 2.23858 12.7614 0 10 0ZM10 6.5C9.17157 6.5 8.5 5.82843 8.5 5C8.5 4.17157 9.17157 3.5 10 3.5C10.8284 3.5 11.5 4.17157 11.5 5C11.5 5.82843 10.8284 6.5 10 6.5Z"
                fill="currentColor"
              />
            </svg>
            <SelectValue placeholder="Location" />
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-xl border-gray-200 shadow-xl py-3 px-4 max-h-60">
          {
            locationData.map(l => {
              return (
                <SelectItem 
                  key={l} 
                  className="cursor-pointer hover:bg-blue-50 rounded-lg px-3 py-2 transition-colors duration-150" 
                  value={l}
                >
                  {l}
                </SelectItem>
              )
            })
          }
        </SelectContent>
      </Select>
    </div>
  );
});

export default Search;
Search.displayName = "Search";
