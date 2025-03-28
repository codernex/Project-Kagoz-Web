"use client";
import Search from "@/components/shared/search";
import Image from "next/image";
// import Swiper core and required modules
import { Autoplay, Parallax } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import { Button } from "@/components/ui/button";
import { cn, normalizeLocation } from "@/lib/utils";
import { useLazyGetBusinessQuery } from "@/redux/api";
import { useLazyGetCategoriesQuery } from "@/redux/api/category";
import Fuse from "fuse.js";
import { ChevronRight, Loader } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

type SearchResult = {
  id: string;
  name: string;
  slug: string
};




const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedTab, setSelectedTab] = useState<'categories' | 'business'>('categories')
  const [searchDropdown, setSearchDropdown] = useState(false)
  const [location, setLocation] = useState('Dhaka')
  const searchRef = useRef<HTMLDivElement>(null)

  const [categoryAction, { data: categories, isLoading: categoryLoading }] = useLazyGetCategoriesQuery()
  const [businessAction, { data: business, isLoading: businessLoading }] = useLazyGetBusinessQuery()

  // Debounced search term to reduce excessive filtering
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Adjust debounce delay as needed

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

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (dropdownRef.current && dropdownRef.current.contains(event.relatedTarget as Node)) {
      return; // Prevent hiding when clicking inside the dropdown
    }
    setSearchDropdown(false);
  };

  useEffect(() => {
    if (searchTerm.length) {
      setSearchDropdown(true);
    } else {
      setSearchDropdown(false)
    }
  }, [searchTerm])

  useEffect(() => {
    if (selectedTab === 'categories') {
      categoryAction()
    } else {
      businessAction({ name: searchTerm, location })
    }
  }, [debouncedSearchTerm])

  return (
    <section id="hero" className="container ">
      <div className="hero_gradient rounded-[2.8rem] relative text-white w-full shadow-md px-4">
        <div className="w-full max-w-2xl md:max-w-5xl lg:max-w-7xl mx-auto pt-[9.6rem] text-center ">
          <h1 className=" text-md md:text-xl text-white font-bold md:leading-[5.56rem] ">
            Welcome to KAGOZ –
            The Best Free Business Directory in Bangladesh
          </h1>
          <p className="text-xs md:text-sm text-white md:leading-[3rem] mt-[1.6rem]">
            We are here to help businesses grow and connect with more customers. Our platform is built with experience, expertise, and trust. Whether you are a small business owner, a service provider, or a customer looking for the best options, we make it easy for you.
          </p>

          {/**Tabs */}
          <div className="mt-[4rem]">
            <div onBlur={handleBlur}>
              <div className="bg-black pt-6 px-4 pb-0 rounded-b-none w-[80%] mx-auto md:bg-transparent md:space-y-0 flex flex-col justify-center items-center md:flex-row md:!space-x-4 mb-0 md:pt-0 h-fit">
                <Button onClick={() => {
                  setSelectedTab('categories')
                  searchRef.current?.click()
                }} className={
                  cn("!ml-0 h-[4.8rem] max-w-full rounded-xs border border-primary !px-[2.8rem] py-[1.6rem] !text-center md:w-fit md:!rounded-b-none md:border-0 md:bg-[#0000004D]", selectedTab === 'categories' ? "!bg-primary" : "bg-transparent")
                }>
                  Find By Category
                </Button>
                <Button
                  onClick={() => {
                    setSelectedTab('business')
                    searchRef.current?.click()
                  }}
                  className={
                    cn("!ml-0 h-[4.8rem] max-w-full rounded-xs border border-primary !px-[2.8rem] py-[1.6rem] !text-center md:w-fit md:!rounded-b-none md:border-0 md:bg-[#0000004D] ", selectedTab === 'business' ? "!bg-primary" : "bg-transparent")
                  }>
                  Find by Business Name
                </Button>
              </div>
              <div className="relative">
                <Search
                  handleFocus={() => {
                    setSearchDropdown(true)
                  }} searchTerm={searchTerm} setSearchTerm={setSearchTerm} ref={searchRef} location={location} setLocation={setLocation} />
                {searchDropdown && searchTerm.length ? (
                  <div ref={dropdownRef} className="absolute left-0 top-[120%] w-full bg-white rounded-xs p-[2rem] shadow-md overflow-y-scroll max-h-[30rem] z-[99] grid !gap-y-3">
                    {
                      (loading || categoryLoading || businessLoading) ? (
                        <div className="w-full h-full flex justify-center items-center">
                          <Loader className="animate-spin" />
                        </div>
                      ) : searchResults.length > 0 ? (
                        searchResults.map((result) => (
                          <Link
                            href={selectedTab === 'business' ? `/business/${result.slug}` : `/categories/${result.slug}-in-${normalizeLocation(location)}`}
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
                ) : null}
              </div>
            </div>
          </div>
        </div>
        {
          <div className="w-full py-[8rem] max-w-[70%] mx-auto">
            <Swiper
              slidesPerView={9}
              className="mb-2"
              autoplay
              modules={[Parallax, Autoplay]}
              breakpoints={{
                320: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 5,
                },
                1024: {
                  slidesPerView: 7,
                },
                1280: {
                  slidesPerView: 9,
                },
              }}
            >
              {Array.from({ length: 20 }).map((_, index) => {
                return (
                  <SwiperSlide key={index}>
                    <div className="flex justify-center w-full">
                      <div className="relative rounded-full w-full h-[8rem] max-w-[8rem] overflow-hidden">
                        <Image
                          alt="Logo"
                          src={"/images/featured/logo.png"}
                          fill
                          sizes="100%"
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
            <p className="font-normal text-center">Featured Business</p>
          </div>
        }
      </div>
    </section>
  );
};

export default Hero;
