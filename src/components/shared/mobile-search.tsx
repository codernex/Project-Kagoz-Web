"use client";
import { useMobileSearch } from "@/hooks/mobileSearch";
import { useLazyGetBusinessQuery } from "@/redux/api";
import { useLazyGetCategoriesQuery } from "@/redux/api/category";
import Fuse from "fuse.js";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

type SearchResult = {
    id: string;
    name: string;
    slug: string
};



const MobileSearch: React.FC = React.memo(() => {
    const { setOpen } = useMobileSearch()
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [location, setLocation] = useState("Dhaka");
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [selectedTab, setSelectedTab] = useState<"categories" | "business">("categories");
    const [searchDropdown, setSearchDropdown] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [categoryAction, { data: categories }] = useLazyGetCategoriesQuery()
    const [businessAction, { data: business }] = useLazyGetBusinessQuery()

    // Debounced search term to reduce excessive filtering
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(searchTerm);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300); // Adjust debounce delay as needed

        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Fuse.js configuration for efficient fuzzy search
    const fuseOptions = useMemo(
        () => ({
            keys: ["name"],
            threshold: 0.3, // Adjust for more or less fuzzy matching
        }),
        []
    );

    const fuseCategories = useMemo(() => new Fuse(categories || [], fuseOptions), [categories, fuseOptions]);
    const fuseBusiness = useMemo(() => new Fuse(business || [], fuseOptions), [business, fuseOptions]);

    useEffect(() => {
        if (debouncedSearchTerm) {
            setLoading(true); // Start loading
            const fuse = selectedTab === "categories" ? fuseCategories : fuseBusiness;
            const results = fuse.search(debouncedSearchTerm).slice(0, 5).map(result => result.item);
            setSearchResults(results as any[]);
            setLoading(false); // Stop loading
        } else {
            setSearchResults([]);
            setLoading(false); // Ensure loading stops if search term is cleared
        }
    }, [debouncedSearchTerm, selectedTab, fuseCategories, fuseBusiness]);

    return (
        <div
            className="bg-white rounded-xl h-[5rem]  flex items-center pl-[3.2rem] pr-[.8rem] w-full shadow-none z-10 relative"
            tabIndex={-1} // Ensure focusable behavior for blur handling
        >
            <div className="h-full w-full flex items-center space-x-2">
                <svg
                    width="21"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Search Icon */}
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    onFocus={() => {
                        setSearchDropdown(true)
                        categoryAction()
                        businessAction({ name: searchTerm })
                    }}
                    className="h-fit text-muted outline-none focus:outline-none ring-0 border-none selection:bg-primary selection:text-white"
                />
            </div>

            <div className="w-[1px] h-[40%] border-r-[1px solid] bg-[#6E6777] relative z-10" />

            <Select
                value={location}
                defaultValue={location}
                onValueChange={(e) => setLocation(e)}
            >
                <SelectTrigger className="text-muted border-0">
                    <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Dhaka">Dhaka</SelectItem>
                </SelectContent>
            </Select>

            {searchDropdown && (
                <div ref={dropdownRef} className="absolute left-0 top-[120%] w-full bg-white rounded-xs p-[2rem] shadow-md overflow-y-scroll max-h-[30rem]">
                    <div className="flex mb-4 py-2 gap-2 border-b border-[#ededed]">
                        <Button
                            variant={selectedTab === "categories" ? "default" : "outline"}
                            className="rounded-xs"
                            onClick={() => {
                                inputRef.current?.focus()
                                setSelectedTab("categories")
                                inputRef.current?.select()
                            }}
                        >
                            By Categories
                        </Button>
                        <Button
                            variant={selectedTab === "business" ? "default" : "outline"}
                            className="rounded-xs"
                            onClick={() => {
                                setSelectedTab("business")
                                inputRef.current?.focus()
                                inputRef.current?.select()
                            }}
                        >
                            By Business
                        </Button>
                    </div>
                    {
                        loading && (
                            <div>
                                loading
                            </div>
                        )
                    }
                    {!loading && searchResults.length > 0 ? (
                        searchResults.map((result) => (
                            <Link
                                onClick={() => setOpen(false)}
                                href={selectedTab === 'business' ? `/business/${result.slug}` : `/categories/${result.slug}`}
                                key={result.id}
                                className="cursor-pointer py-3 px-4 hover:bg-gray-50 bg-gray-50 rounded-[.6rem] border-b border-b-[#ededed] text-black font-medium flex justify-between items-center last:border-b-0"
                            >
                                {result.name}
                                <ChevronRight />
                            </Link>
                        ))
                    ) : (
                        <div className="text-muted text-center">No results found</div>
                    )}
                </div>
            )}
        </div>
    );
});

export default MobileSearch;
MobileSearch.displayName = "MobileSearch"
