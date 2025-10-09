'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'

interface SearchBoxProps {
  businesses: string[];
  onSearch?: (query: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ businesses, onSearch }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (onSearch) {
      onSearch(query);
    }
  }, [query, onSearch]);

  return (
    <div className="relative max-w-[585px] sm:p-0 p-2 mx-auto">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="absolute inset-y-0 left-0 pl-[12px] flex items-center pointer-events-none">
          <Image
            src="/serch.png"
            alt="Search icon"
            width={20}
            height={20}
            className="h-[20px] w-[20px] text-gray-400"
          />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Start typing your business name"
          className="w-full pl-[40px] pr-[16px] py-[11px] border border-gray-300 rounded-[35.2px] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-500"
        />
      </form>
    </div>
  )
}

export default SearchBox
