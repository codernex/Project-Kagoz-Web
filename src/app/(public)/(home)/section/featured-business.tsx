"use client"
import { useGetSponsoredBusinessQuery, useLazyGetSponsoredBusinessQuery } from "@/redux/api";
import FeaturedItem from "./components/featured-item";
import { useRef } from "react";
import { useFetchOnVisible } from "@/hooks/useLazyApiCall";

export default function FeaturedBusiness() {
  const [action, { data, isLoading }] = useLazyGetSponsoredBusinessQuery()
  const ref = useRef<HTMLElement>(null)

  useFetchOnVisible(ref, action)

  if (!data?.length) {
    return null
  }

  return (
    <section ref={ref} className="container section_padding space-y-[6rem]">
      <div className="space-y-[2rem] max-w-7xl mx-auto">
        <h2 className="section_title">Featured Business</h2>
        <p className="text-xsm lg:text-sm text-muted text-center">
          Turn your ideas into a thriving startup with our expert guidance.
          Learn essential strategies to navigate the startup journey and
          transform your vision into reality. Start building your future today
        </p>
      </div>
      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-x-[3rem] gap-y-[3rem]">
        {data?.map((b, index) => {
          return <FeaturedItem key={index} business={b} />;
        })}
      </div>
    </section>
  );
}
