'use client'
import Image from 'next/image'
import React, { useState, useEffect, useRef } from 'react'

interface BusinessItem { name: string; logoUrl?: string }

interface SearchBoxProps {
  businesses: BusinessItem[] | string[];
  onSearch?: (query: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ businesses, onSearch }) => {
  const [query, setQuery] = useState('');
	const [isFocused, setIsFocused] = useState(false);
  const onSearchRef = useRef(onSearch);

  // Keep the ref updated with the latest onSearch function
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  const items: BusinessItem[] = React.useMemo(() => {
    return (businesses as any[]).map((b) => typeof b === 'string' ? { name: b } : b)
  }, [businesses])

  const filtered = React.useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter(it => (it.name || '').toLowerCase().includes(q));
  }, [items, query]);

  useEffect(() => {
    if (onSearchRef.current) {
      onSearchRef.current(query);
    }
  }, [query]);

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
					onFocus={() => setIsFocused(true)}
					onBlur={() => setTimeout(() => setIsFocused(false), 150)}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Start typing your business name"
					className="w-full pl-[40px] pr-[16px] py-[11px] border border-gray-300 rounded-[35.2px] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-500"
				/>
			</form>

			{/* Suggestions dropdown */}
            {isFocused && filtered?.length > 0 && (
                <ul className="absolute left-0 right-0 mt-2 z-20 bg-white border border-gray-200 rounded-lg shadow-md max-h-72 overflow-auto">
                  {filtered.map((it, idx) => (
                    <li key={`${it.name}-${idx}`}>
							<button
								type="button"
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3"
								onMouseDown={(e) => e.preventDefault()}
								onClick={() => {
                          setQuery(it.name);
                          if (onSearch) onSearch(it.name);
									setIsFocused(false);
								}}
							>
                        {it.logoUrl ? (
                          <Image src={it.logoUrl} alt={it.name} width={24} height={24} className="w-6 h-6 rounded object-cover" />
                        ) : (
                          <div className="w-6 h-6 rounded bg-gray-200" />
                        )}
                        <span className="text-[#6F00FF] underline">{it.name}</span>
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default SearchBox
