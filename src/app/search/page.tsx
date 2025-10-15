'use client'
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import MatchFoundCard from './_components/successMatch';
import SearchBox from './_components/searchbox';
import NotMatch from './_components/notMatch';
import Image from 'next/image';
import { useGetBusinessByQueryQuery } from '@/redux/api/business';
import { appendApi } from '@/lib/utils';

const Page: React.FC = () => {
  const [isMatch, setIsMatch] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ name: string; logoUrl?: string; mobile?: string; website?: string }>>([])
  const [selected, setSelected] = useState<{ name: string; mobile?: string; website?: string } | null>(null)
  const [searchParams, setSearchParams] = useState({
    name: '',
    page: 1,
    limit: 30,
    latitude: null,
    longitude: null,
    location: null,
  })
  const { data, refetch } = useGetBusinessByQueryQuery(searchParams)

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    if (q.trim() === '') {
      setIsMatch(false);
      setSuggestions([])
      setSelected(null)
      return;
    }
    const found = suggestions.find(
      (it) => it.name.toLowerCase() === q.trim().toLowerCase()
    );
    setIsMatch(!!found);
    if (found) {
      setSelected({ name: found.name, mobile: found.mobile, website: found.website })
    }
  }, [suggestions]);

  // Debounced API search when query changes
  useEffect(() => {
    if (!query || query.trim().length === 0) return
    const t = setTimeout(() => {
      setSearchParams(prev => ({ ...prev, name: query.trim() }))
    }, 300)
    return () => clearTimeout(t)
  }, [query, refetch])

  // Map API results to suggestion entries
  useEffect(() => {
    if (data?.items?.length) {
      setSuggestions(
        data.items
          .filter((b: any) => !!b?.name)
          .map((b: any) => {
            const raw = b.logoUrl as string | undefined
            let url: string | undefined = undefined
            if (raw) {
              url = raw.startsWith('http')
                ? raw
                : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api/v1"}/uploads/${raw}`
            }
            return {
              name: b.name as string,
              logoUrl: url,
              mobile: b.mobile as string | undefined,
              website: b.website as string | undefined,
            }
          })
      )
    } else {
      setSuggestions([])
    }
  }, [data])

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
            Let&apos;s Check If Your Business is Already Listed
          </h1>
          <p className="Subheading inter-font">
            We&apos;ll avoid duplicates and help you take control of your listing if it already exists.
          </p>
          <div className="mt-6 sm:mt-8 ">
            <SearchBox businesses={suggestions as any} onSearch={handleSearch} />
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
            {query.trim() !== '' && isMatch && selected && (
              <MatchFoundCard name={selected.name} mobile={selected.mobile} website={selected.website} />
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
