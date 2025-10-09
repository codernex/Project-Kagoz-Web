'use client'
import React, { useState } from 'react';
import MatchFoundCard from './_components/successMatch';
import SearchBox from './_components/searchbox';
import NotMatch from './_components/notMatch';
import Image from 'next/image';

const businesses = [
  'Rahman Electronics',
  'Molla Pharmacy',
  'Tech Solutions',
  'Green Grocers',
];

const Page: React.FC = () => {
  const [isMatch, setIsMatch] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.trim() === '') {
      setIsMatch(false);
      return;
    }
    const found = businesses.find(
      (name) => name.toLowerCase() === q.trim().toLowerCase()
    );
    setIsMatch(!!found);
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[900px] px-4 sm:px-6 py-8 sm:py-12">
        {/* Header Illustration */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <Image
            src="/images/Illustration1.png"
            alt="Business listing illustration"
            width={1000}
            height={1000}
            className="w-[220px] h-[142px] sm:w-[270px] sm:h-[174px]"
          />
        </div>
        {/* Main Content */}
        <div className="text-center ">
          <h1 className="heading mb-3 sm:mb-4 inter-font">
            Let's Check If Your Business is Already Listed
          </h1>
          <p className="Subheading inter-font">
            We'll avoid duplicates and help you take control of your listing if it already exists.
          </p>
          <div className="mt-6 sm:mt-8 ">
            <SearchBox businesses={businesses} onSearch={handleSearch} />
            <p className="mt-3 example-text inter-font">
              e.g. Rahman Electronics or Molla Pharmacy
            </p>

            {/* If empty query */}
            {query.trim() === '' && (
              <div className="">
                <div className="mt-8 mb-4 flex justify-center items-center">
                  <Image
                    src="/searchicon.png"
                    alt="Search icon"
                    width={1000}
                    height={1000}
                    className="size-16"
                  />
                </div>
                <p className="bottom-text inter-font">
                  Start typing to search for your business
                </p>
              </div>
            )}

            {/* If query is not empty and matched */}
            {query.trim() !== '' && isMatch && (
           
            <MatchFoundCard />
            )}

            {/* If query is not empty and not matched */}
            {query.trim() !== '' && !isMatch && (
              <NotMatch  />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
