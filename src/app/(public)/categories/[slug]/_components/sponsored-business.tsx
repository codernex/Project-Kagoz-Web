'use client'
import { Loader } from "@/components/shared/loader";
import { SponsoredBusinessItem } from "@/components/shared/sponsored-item";
import { useGetSponsoredBusinessQuery } from "@/redux/api";
import { useMemo } from "react";

export const SponsoredBusiness = () => {
  const { data, isLoading } = useGetSponsoredBusinessQuery()

  const randomSponsored = useMemo(() => {
    if (!data || data.length === 0) return [];

    const numberOfElementsToSelect = Math.min(3, data.length);

    // Use the shuffle and slice approach
    const shuffledData = [...data].sort(() => Math.random() - 0.5);
    return shuffledData.slice(0, numberOfElementsToSelect);
  }, [data]);

  if (isLoading && !data) {
    return (
      <Loader />
    )
  }
  if (!data) {
    return null
  }
  return (
    <section className="bg-bgPrimaryShade border border-borderColor">
      <div className="container pt-[4rem] pb-[6rem]">
        <h2 className="text-md text-black font-semibold pb-[2.4rem]">
          Sponsored Business
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3rem] ">
          {randomSponsored.map((business, index) => {
            return <SponsoredBusinessItem key={index} business={business} />;
          })}
        </div>
      </div>
    </section>
  );
};
