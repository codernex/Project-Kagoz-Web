"use client";
import { AdSpace } from "@/components/shared/ad-space";
import { BlogWidget } from "@/components/shared/blog-widget";
import { Loader } from "@/components/shared/loader";
import { Pagination } from "@/components/shared/pagination";
import { useGetBusinessByQueryQuery, useLazyGetSocialMediaQuery } from "@/redux/api";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { MobileFilter } from "./_components/mobile-filter";
import { OtherFilter } from "./_components/other-filter";
import { SearchItem } from "./_components/search-item";
import { SponsoredBusiness } from "./_components/sponsored-business";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useFetchOnVisible } from "@/hooks/useLazyApiCall";
const Categories = dynamic(() => import('./_components/categories').then(m => m.Categories), { ssr: false })
import Dompurify from "dompurify";

export default function CategoriesSearchPage({ slug, category }: { slug: string, category: ICategory }) {
    const [action, { data: socialData }] = useLazyGetSocialMediaQuery()
    const sectionRef = useRef<HTMLElement>(null)

    useFetchOnVisible(sectionRef, action)

    const sanitizedConent = useMemo(() => {
        return Dompurify.sanitize(socialData?.content || '')
    }, [socialData])

    const [page, setPage] = useState(1)
    const router = useRouter()
    const [activeSearchType, setActiveSearchType] = useState<
        "Category" | "Business"
    >("Category");
    const [lisenceType, setLisenceType] = useState<"KAGOZ" | "Verified Lisence" | "None">(
        "None",
    );
    const [avalibility, setAvalibility] = useState<"Now Open" | "Now Closed">(
        "Now Open",
    );
    const { data, isLoading } = useGetBusinessByQueryQuery({
        category: slug,
        isOpen: avalibility === 'Now Open',
        isClosed: avalibility === 'Now Closed',
        isTrusted: lisenceType === 'KAGOZ',
        isVerified: lisenceType === 'Verified Lisence',
        limit: 20,
        page
    })
    // useEffect(() => {
    //     window.scrollTo(0, 0); // Scroll to the top of the page on reload
    // }, []);

    if (isLoading) {
        return <Loader />
    }
    return (
        <main>
            <section className="container">
                <div className="w-full py-[2.4rem]">
                    <div className="flex items-center text-muted">
                        <Link href={"/"}>Home</Link>
                        <ChevronRight size={18} />
                        <span>Movers</span>
                    </div>
                    <h1 className="text-md lg:text-lg text-muted font-bold">
                        Top {data?.items.length} <span className="text-black capitalize">{`"${slug}"`}</span> in{" "}
                        <span className="text-black">Dhaka</span>
                    </h1>
                </div>
            </section>

            <section className="container">
                <OtherFilter
                    activeSearchType={activeSearchType}
                    avalibility={avalibility}
                    lisenceType={lisenceType}
                    setAvalibility={setAvalibility}
                    setLisenceType={setLisenceType}
                    setActiveSearchType={setActiveSearchType}
                />

                <MobileFilter
                    activeSearchType={activeSearchType}
                    avalibility={avalibility}
                    lisenceType={lisenceType}
                    setAvalibility={setAvalibility}
                    setLisenceType={setLisenceType}
                    setActiveSearchType={setActiveSearchType}
                />
            </section>

            <section className="bg-bgPrimaryShade border border-borderColor">
                <SponsoredBusiness />
            </section>

            <section className="container py-[6rem] grid grid-cols-6 gap-x-[6rem] gap-y-[4rem]">
                <div className="w-full col-span-6 md:col-span-4 space-y-[3rem] ">
                    {
                        data?.items.length ? data?.items?.map((b, index) => {
                            return (
                                <SearchItem
                                    key={index}
                                    index={index}
                                    {...b}
                                    id={index}
                                    isOpen={avalibility === 'Now Open'}
                                />
                            );
                        }) : (
                            <h2 className="text-xl font-medium">No Result Found</h2>
                        )
                    }
                </div>
                <div className="col-span-6 md:col-span-2 space-y-[4rem]">
                    <BlogWidget />
                    <AdSpace />
                    <AdSpace />
                </div>
            </section>
            <section className="bg-bgPrimaryShade border border-borderColor">
                <SponsoredBusiness />
            </section>
            <Pagination currentPage={data?.currentPage ?? 1} totalPages={data?.totalPages ?? 0} page={page} setPage={setPage} />

            <section ref={sectionRef} className="py-[6rem] lg:py-[10rem] bg-[#00000005]">
                <div className="container editor" dangerouslySetInnerHTML={{
                    __html: sanitizedConent
                }}>
                </div>
            </section>

            <section onClick={() => router.push(`/biz/null/dashboard`)} className="bg-search-add-business h-[40rem] cursor-pointer" />
            <Categories />
        </main>
    );
}
