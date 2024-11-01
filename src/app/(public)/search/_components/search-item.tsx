import { useStarRatings } from "@/hooks/generate-star-ratings";
import { Button } from "@/components/shared/button";
import { Calendar } from "@/components/svgs/calendar";
import VerifiedBadge from "@/components/svgs/verifed";
import VerfiedLisence from "@/components/svgs/verified-lisence";
import { cn } from "@/lib/utils";
import { Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ISearchItemProps extends IBusiness {
  index: number;
}

export const SearchItem: React.FC<ISearchItemProps> = ({ index, isOpen }) => {
  const generateStarRating = useStarRatings(4.5);
  return (
    <div className="p-[2.4rem] drop-shadow-lg rounded-smd space-y-[2rem] xl:space-y-[3rem] bg-white flex flex-col md:flex-row items-end h-fit relative w-full">
      <div className="w-full md:w-[60%]">
        <div className="flex space-x-[2rem] lg:space-x-[1rem] xl:space-x-[1rem] 2xl:space-x-[2rem]">
          <div className="w-[10rem] h-[10rem] rounded-xs border border-borderColor  p-[1.2rem]">
            <div className="relative w-full h-full">
              <Image
                src={"/images/featured_brand.png"}
                alt="Featured Brand"
                className="rounded-xs"
                fill
              />
            </div>
          </div>
          <div>
            <div className="relative w-fit">
              <h3 className="text-smd lg:text-md font-bold leading-md text-black">
                {"McDonald's"}
              </h3>
              <VerifiedBadge className="absolute top-0 -right-8" />
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
            <div className="flex flex-col gap-y-2 md:flex-row md:gap-x-[3rem]">
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
                <span>12 years in business</span>
              </p>
              <p className="text-xs text-muted flex space-x-[0.8rem]">
                <Calendar />
                <span>6 Month with KAGOZ</span>
              </p>
            </div>
            <div className="flex flex-col py-[1rem]">
              <div className="flex space-x-1 items-center">
                <VerfiedLisence width="16" height="16" />
                <p className="text-verifiedColor text-[1rem] lg:text-[1.1rem] 2xl:text-xs font-semibold">
                  Verified License
                </p>
              </div>
            </div>

            <div className="flex items-center pb-[1rem] space-x-2">
              <span className="text-yellow-400 text-sm flex">
                {generateStarRating}
              </span>
              <p className="text-xs text-muted">4.8 (34)</p>
            </div>
          </div>
        </div>
        <p className="text-xsm lg:text-sm text-muted">
          Aliquam pulvinar vestibulum blandit. Donec sed nisl libero. Fusce
          pulvinar vestibulum blandi dignissim luctus sem dapibus.
        </p>
      </div>
      <div className="w-full md:w-[40%] flex justify-center md:justify-end">
        <Button
          asChild
          className="border border-primary rounded-xl py-[1.2rem] w-full max-w-[20rem]"
        >
          <Link rel="nofollow" href={"tel:1234567890"} className="text-center">
            View Details
          </Link>
        </Button>
      </div>
      <span className=" absolute right-10 top-0 bg-[#F0EFF1] border w-[3.5rem] h-[3.5rem] rounded-xs flex items-center justify-center text-black font-semibold border-[#E1DEE4]">
        {index + 1}
      </span>
    </div>
  );
};
