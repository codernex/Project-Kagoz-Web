"use client";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import { Loader } from "@/components/shared/loader";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { appendApi, isBlocked } from "@/lib/utils";
import { useGetBusinessBySlugQuery, useGetFeauturedClientsQuery, useIsFeatureActiveQuery } from "@/redux/api";
import { FeatureType } from "@/types";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRef } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Autoplay, Navigation } from "swiper/modules";
import { type Swiper as SwiperType } from "swiper/types";
import { LockFunctionalities } from "@/components/shared/lock";
export const FeaturedCustomer = () => {
  const { slug } = useParams() as { slug: string }
  const { data: business } = useGetBusinessBySlugQuery(slug)
  const { data, isLoading } = useIsFeatureActiveQuery({ slug, type: FeatureType.FEATURED_CLIENT })
  const { data: featuredCustomers, isLoading: featureLoading } = useGetFeauturedClientsQuery(slug, { skip: !data?.hasFeatureActive })
  const swiperRef = useRef<SwiperType>();
  const block = isBlocked(business?.updatedAt)

  if (!data?.hasFeatureActive) {
    return null
  }
  if (featureLoading || isLoading) {
    return <Loader />
  }

  return (
    <div className="relative">
      <div className="bg-bgPrimaryShade p-[2.4rem] rounded-sm space-y-[2.4rem]">
        <div className="flex space-x-4 items-center">
          <h2 className="text-[2.4rem] font-bold text-black">
            Our Top Customers
          </h2>
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <button>
                  <Info className="text-muted" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="w-[30rem] px-6 text-muted border-none font-bold">
                Information provided here not verified by KAGOZ
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {
          !featuredCustomers?.length ? (<p className="text-muted">This business currently {`don't have any featured customer`}</p>) : (
            <div className="flex items-center gap-x-[1.6rem]">
              <div className="w-fit">
                <button className="w-[3.6rem] text-muted h-[3.6rem] bg-white rounded-full flex items-center justify-center z-10">
                  <ChevronLeft onClick={() => swiperRef.current?.slidePrev()} />
                </button>
              </div>
              <Swiper
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                slidesPerView={5}
                className="mb-2 w-full"
                spaceBetween={20}
                autoplay
                grabCursor
                modules={[Autoplay, Navigation]}
                breakpoints={{
                  320: {
                    slidesPerView: 2,
                  },
                  768: {
                    slidesPerView: 5,
                  },
                  1024: {
                    slidesPerView: 5,
                  },
                  1280: {
                    slidesPerView: 5,
                  },
                }}
              >
                {featuredCustomers?.map((customer, index) => {
                  return (
                    <SwiperSlide className="w-full" key={index}>
                      <div className="w-full h-[10rem] rounded-[.8rem]  bg-white  p-[1.2rem] flex items-center justify-center">
                        <Image
                          src={appendApi(customer.url)}
                          alt="Featured Customer"
                          className="object-contain"
                          width={100}
                          height={100}
                        />
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              <div className="w-fit">
                <button className="w-[3.6rem] h-[3.6rem] text-muted primary disabled:text-muted bg-white rounded-full flex items-center justify-center z-10">
                  <ChevronRight onClick={() => swiperRef.current?.slideNext()} />
                </button>
              </div>
            </div>
          )
        }
      </div>
      <hr className="border-[#EEEDED]" />
      <LockFunctionalities locked={block} />
    </div>

  );
};
