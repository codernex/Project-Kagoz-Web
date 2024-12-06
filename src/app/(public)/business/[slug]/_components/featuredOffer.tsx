"use client"
import { Button } from "@/components/shared/button";
import { Loader } from "@/components/shared/loader";
import { appendApi } from "@/lib/utils";
import { useGetFeaturedOfferQuery, useIsFeatureActiveQuery } from "@/redux/api";
import { FeatureType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export const FeaturedOffer = () => {
  const { slug } = useParams() as { slug: string }
  const { data: feature, isLoading } = useIsFeatureActiveQuery({ slug, type: FeatureType.FEATURED_OFFER })
  const { data } = useGetFeaturedOfferQuery(slug, {
    skip: !feature?.hasFeatureActive
  })

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="pb-10">
      <h2 className="text-md text-black font-bold pb-[2.4rem]">
        Featured Offer
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[4rem]">
        {data?.map((offer, index) => {
          return (
            <div key={index} className="flex flex-col items-center">
              <div className="w-full h-[46rem] relative border-[2px] border-primary rounded-sm overflow-hidden">
                <Image
                  src={appendApi(offer.imageUrl)}
                  className="object-cover"
                  alt=""
                  fill
                />
              </div>
              <Link target="_blank" rel="nofollow" href={offer.ctaUrl} className="h-[4.8rem] w-[14rem] rounded-xl -my-10 border-none relative z-20 bg-primary text-white flex items-center justify-center font-semibold">
                Book Now
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
