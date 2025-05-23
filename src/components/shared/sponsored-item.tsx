import { useStarRatings } from "@/hooks/generate-star-ratings";
import { useBusinessOpen } from "@/hooks/isBusinessOpen";
import { appendApi, cn, trimToWordCount } from "@/lib/utils";
import { useGetReviewQuery } from "@/redux/api";
import { differenceInDays, differenceInYears } from "date-fns";
import { Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Calendar } from "../svgs/calendar";
import VerifiedBadge from "../svgs/verifed";
import VerfiedLisence from "../svgs/verified-lisence";
import { Button } from "./button";

type SponsoredBusinessItemProps = {
  business: IBusiness
}

export const SponsoredBusinessItem: React.FC<SponsoredBusinessItemProps> = ({
  business
}) => {
  const isOpen = useBusinessOpen(business?.openingHours)
  const { data: reviews } = useGetReviewQuery(business.slug)
  const averageRatings = useMemo(() => {
    if (!reviews) return 0
    return reviews?.reduce((a, b) => a + parseFloat(b.rating), 0) / reviews?.length || 0
  }, [reviews])
  const generateStarRating = useStarRatings(averageRatings, 20);
  return (
    <div className="p-[1.2rem] md:p-[2.4rem] shadow-lg rounded-smd space-y-[2rem] xl:space-y-[3rem] bg-white">
      <div className="flex gap-x-[1rem] justify-between lg:gap-x-[1rem] xl:gap-x-[1rem] 2xl:gap-x-[2rem]">
        <div className="!w-[10rem] !h-[10rem] min-w-[10rem] rounded-xs border border-borderColor  p-[1.2rem]">
          <div className="relative !w-full h-full">
            <Image
              src={business.logoUrl ? appendApi(business.logoUrl) : '/images/default.png'}
              alt={business.name}
              className="rounded-xs w-full"
              fill
            />
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="relative w-fit">
            <Link href={`/business/${business.slug}`}>
              <h3 className="text-smd lg:text-md font-bold leading-md text-black">
                {trimToWordCount(business.name, 8)}
              </h3>
            </Link>
            {business.isTrusted ? <VerifiedBadge className="absolute top-0 -right-8" /> : ''}
          </div>
          <div className="flex space-x-1 items-center py-2">
            <Clock3
              size={18}
              className={cn(
                "fill-secondary text-white",
                !isOpen ? "fill-[#FA5151]" : "fill-secondary",
              )}
            />
            <p
              className={cn(
                "text-secondary text-[1rem] lg:text-[1.1rem] 2xl:text-xs font-semibold",
                !isOpen ? "text-[#FA5151]" : "",
              )}
            >
              {isOpen ? "Open Now" : "Closed"}
            </p>
          </div>
          <div className="flex flex-wrap md:space-x-[3rem]">
            <p className="text-xs text-muted flex space-x-[0.8rem]">
              <svg
                width="14"
                height="15"
                viewBox="0 0 14 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.60006 4.82495H13.4001C13.5751 4.82495 13.7501 4.87495 13.9251 4.94995V3.79995C13.9251 2.67495 13.0251 1.74995 11.9001 1.69995V2.84995C11.9001 3.12495 11.6751 3.34995 11.4001 3.34995C11.1251 3.34995 10.9001 3.09995 10.9001 2.84995V1.69995H4.72506V2.79995C4.72506 3.07495 4.50006 3.29995 4.22506 3.29995C3.95006 3.29995 3.72506 3.04995 3.72506 2.79995V1.69995C2.57506 1.69995 1.62506 2.64995 1.62506 3.79995V5.47495C1.77506 5.07495 2.15006 4.82495 2.60006 4.82495ZM12.9251 11.475C12.5751 12.175 11.8751 12.6 11.1251 12.6H1.75006C2.05006 13.425 2.82506 14 3.72506 14H11.8251C12.9751 14 13.9251 13.05 13.9251 11.9V8.87495C13.8501 9.14995 13.7501 9.44995 13.6501 9.72495C13.4501 10.3 13.2001 10.9 12.9251 11.475Z"
                  fill="#6E6777"
                />
                <path
                  d="M13.4001 5.82495H2.60008C2.55008 5.82495 2.52508 5.84995 2.52508 5.89995C2.37508 7.12495 2.07508 8.32495 1.67508 9.47495C1.47508 9.99995 1.25008 10.55 1.00008 11.075C0.900078 11.3 1.05008 11.6 1.32508 11.6H11.1501C11.5251 11.6 11.8751 11.375 12.0501 11.05C12.3001 10.525 12.5251 9.94995 12.7251 9.39995C13.1251 8.27495 13.3751 7.09995 13.5001 5.92495C13.5001 5.89995 13.5001 5.87495 13.4751 5.84995C13.4501 5.82495 13.4251 5.82495 13.4001 5.82495ZM9.60008 7.84995L7.55008 9.89995C7.35008 10.1 7.02508 10.1 6.85008 9.89995L5.42508 8.47495C4.97508 8.02495 5.67508 7.29995 6.12508 7.77495L7.20008 8.84995L8.90008 7.14995C9.35008 6.69995 10.0501 7.39995 9.60008 7.84995Z"
                  fill="#6E6777"
                />
              </svg>
              {
                business.startingDate ? <span>{differenceInYears(new Date(), business.startingDate)} years in business</span> : ''
              }

            </p>
            <p className="text-xs text-muted flex space-x-[0.8rem]">
              <Calendar />
              <span>{Math.round(differenceInDays(new Date(), business.createdAt) / 30)} Month with KAGOZ</span>
            </p>
          </div>
          <div className="flex flex-col py-[1rem]">
            {
              business?.isVerified ? <div className="flex space-x-1 items-center">
                <VerfiedLisence width="16" height="16" />
                <p className="text-verifiedColor text-sm font-semibold">
                  Verified License
                </p>
              </div> : ''
            }
          </div>

          <div className="flex items-center pb-[1rem] space-x-2">
            <span className="text-yellow-400 text-sm flex">
              {generateStarRating}
            </span>
            <p className="text-sm text-muted">{averageRatings} ({reviews?.length})</p>
          </div>
        </div>
      </div>
      <p className="text-xsm lg:text-sm text-muted">
        {trimToWordCount(business.about, 10)}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:grid-cols-4">
        {
          business.photos?.slice(0, 3)?.map((p) => {
            return (
              <Image
                key={p.id}
                src={appendApi(p.url)}
                alt="Business Image"
                className="w-[10rem] h-[8rem] rounded-[.6rem] object-cover"
                width={100}
                height={80}
              />
            )
          })
        }
        {
          business.photos?.slice(3).length ? (
            <div className="w-[10rem] h-[8rem] rounded-sm z-10 relative">
              <div className="bg-[#00000099]  w-full h-full absolute top-0 left-0 text-white text-md rounded-[.6rem] flex items-center justify-center">
                {business.photos?.slice(3).length}+
              </div>
              <Image
                src={appendApi(business.photos[4]?.url ?? '')}
                alt="Business Image"
                className="w-[10rem] h-[8rem]"
                width={100}
                height={80}
              />
            </div>
          ) : null
        }
      </div>

      <div className="flex gap-x-[2rem]">
        <Button asChild className="bg-transparent text-primary rounded-xl py-[1.2rem] text-center">
          <Link href={`/business/${business.slug}`}>
            View Details</Link>
        </Button>

        <Button
          asChild
          className="border border-primary rounded-xl py-[1.2rem]"
        >
          <Link rel="nofollow" href={`tel:${business.mobile}`} className="text-center">
            Call Now
          </Link>
        </Button>
      </div>
    </div>
  );
};
