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
				<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
						<svg 
							className="h-5 w-5 text-gray-400 transition-colors duration-200" 
							fill="none" 
							stroke="currentColor" 
							viewBox="0 0 24 24"
						>
							<path 
								strokeLinecap="round" 
								strokeLinejoin="round" 
								strokeWidth={2} 
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
							/>
						</svg>
					</div>
					<input
						type="text"
						value={query}
						onFocus={() => setIsFocused(true)}
						onBlur={() => setTimeout(() => setIsFocused(false), 150)}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Start typing your business name"
						className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white shadow-sm hover:shadow-md focus:shadow-lg"
						aria-label="Search for business"
						aria-expanded={isFocused && filtered?.length > 0}
						aria-haspopup="listbox"
						role="combobox"
					/>
					{query && (
						<button
							type="button"
							onClick={() => {
								setQuery('');
								if (onSearch) onSearch('');
							}}
							className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
							aria-label="Clear search"
						>
							<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					)}
				</div>
			</form>

			{/* Enhanced Suggestions dropdown */}
            {isFocused && filtered?.length > 0 && (
                <div className="absolute left-0 right-0 mt-3 z-30 bg-white border border-gray-200 rounded-2xl shadow-xl max-h-80 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
					<div className="p-2">
						<div className="text-xs font-medium text-gray-500 px-3 py-2 border-b border-gray-100">
							{filtered.length} suggestion{filtered.length !== 1 ? 's' : ''} found
						</div>
						<ul className="py-1" role="listbox">
							{filtered.map((it, idx) => (
								<li key={`${it.name}-${idx}`} role="option">
									<button
										type="button"
										className="w-full text-left px-3 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none flex items-center gap-3 rounded-xl transition-colors duration-150 group"
										onMouseDown={(e) => e.preventDefault()}
										onClick={() => {
											setQuery(it.name);
											if (onSearch) onSearch(it.name);
											setIsFocused(false);
										}}
									>
										<div className="flex-shrink-0">
											{it.logoUrl ? (
												<Image 
													src={it.logoUrl} 
													alt={`${it.name} logo`} 
													width={32} 
													height={32} 
													className="w-8 h-8 rounded-lg object-cover border border-gray-200" 
												/>
											) : (
												<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
													<span className="text-sm font-semibold text-blue-600">
														{it.name.charAt(0).toUpperCase()}
													</span>
												</div>
											)}
										</div>
										<div className="flex-1 min-w-0">
											<span className="text-gray-900 font-medium group-hover:text-blue-700 transition-colors duration-150">
												{it.name}
											</span>
										</div>
										<div className="flex-shrink-0">
											<svg className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
											</svg>
										</div>
									</button>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</div>
	)
}

export default SearchBox
