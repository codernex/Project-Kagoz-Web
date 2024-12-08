"use client"
import { Button } from "@/components/shared/button";
import { Loader } from "@/components/shared/loader";
import { NotFound } from "@/components/shared/not-found";
import { Calendar } from "@/components/svgs/calendar";
import Clock from "@/components/svgs/clock";
import VerifiedBadge from "@/components/svgs/verifed";
import VerfiedLisence from "@/components/svgs/verified-lisence";
import { useStarRatings } from "@/hooks/generate-star-ratings";
import { appendApi } from "@/lib/utils";
import { useGetBusinessBySlugQuery } from "@/redux/api";
import { differenceInYears } from 'date-fns';
import { Heart, PlayIcon, Share2Icon, Star } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ReviewModal } from "../../business/[slug]/_components/reviewModal";
export function TopSection() {
    const { slug } = useParams() as { slug: string }
    const { data, isLoading } = useGetBusinessBySlugQuery(slug)
    const generateStarRating = useStarRatings(4.5, 20);

    const [writeReview, setWriteReview] = useState(false);

    if (isLoading) {
        return (
            <Loader />
        )
    }

    if (!data) {
        return <NotFound />
    }
    return (
        <>
            <div className="space-y-4 md:space-y-[4rem]">
                <div className="flex flex-col md:flex-row items-start justify-between gap-y-[1.6rem] relative">
                    <div className="flex space-x-[2.4rem] items-start">
                        <div className=" w-[10rem] h-[10rem] md:!w-[12rem] md:!h-[12rem] p-[1.2rem] border border-borderColor rounded-xs">
                            <div className="relative w-full h-full ">
                                <Image src={appendApi(data?.logoUrl)} className="object-contain" alt="" fill />
                            </div>
                        </div>
                        <div className="space-y-[.6rem] lg:space-y-[1.6rem] flex-1">
                            <div className="relative w-fit">
                                <h3 className="text-md lg:text-[3.2rem] xl:text-lg font-bold leading-md text-black">
                                    {data?.name}
                                </h3>
                                <VerifiedBadge className="absolute -top-4 -right-8" />
                            </div>
                            <div className="flex space-x-1 items-center py-2">
                                <Clock width="16" height="16" />
                                <p className="text-secondary text-sm font-semibold">
                                    Open Now
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-x-[3rem]">
                                <p className="text-smtext-xs text-muted items-center flex space-x-[0.8rem]">
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
                                    <span>{differenceInYears(new Date(), data.startingDate)} years in business</span>
                                </p>
                                <p className="text-sm text-muted flex items-center space-x-[0.8rem]">
                                    <Calendar />
                                    <span>{differenceInYears(new Date(), data.createdAt)} Month with KAGOZ</span>
                                </p>
                            </div>
                            <div className="flex flex-col lg:flex-row lg:items-center py-[1.4rem] gap-x-[4rem] gap-y-[1rem]">
                                <div className="flex space-x-1 items-center">
                                    <VerfiedLisence width="16" height="16" />
                                    <p className="text-verifiedColor text-sm font-semibold">
                                        Verified License
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-yellow-400 text-sm flex">
                                        {generateStarRating}
                                    </span>
                                    <p className="text-sm text-muted">4.8 (34)</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-x-[.6rem] gap-y-[.6rem]">
                                {Array.from({ length: 5 }).map((_, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="flex rounded-xl text-[1.1rem] items-center space-x-2 py-[0.4rem] px-[1rem] text-muted bg-[#6E67771A] border border-[#6E677733]"
                                        >
                                            <span>Roofing</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="md:absolute top-0 right-0">
                        <Button className="flex items-center w-[22rem] md:w-fit  bg-[#323031] px-[3.2rem] py-[1rem] md:py-[1.9rem] rounded-xl space-x-[.8rem]">
                            <div className="w-[2.2rem] h-[2.2rem] rounded-full bg-white flex items-center justify-center">
                                <PlayIcon size={18} className="fill-black" />
                            </div>
                            <span className="text-sm xl:text-[2rem] font-medium">
                                Play Video
                            </span>
                        </Button>
                    </div>
                </div>
                {/**
       * TOP SECTION BUTTONS
       */}
                <div className="flex flex-wrap gap-y-4 gap-x-[2rem] w-fit">
                    <Button
                        onClick={() => setWriteReview(true)}
                        className="text-white items-center flex max-w-[22rem] md:w-fit px-[3.2rem] py-[1rem] md:py-[1.4rem] rounded-xl space-x-[.8rem]"
                    >
                        <Star size={18} className="fill-white" />
                        <span>Write a Review</span>
                    </Button>
                    <Button className="text-muted items-center  flex max-w-[22rem] md:w-fit px-[3.2rem] py-[1rem] md:py-[1.4rem] rounded-xl border border-[#6E67774D] bg-transparent space-x-[.8rem]">
                        <Share2Icon size={18} />
                        <span>Share</span>
                    </Button>
                    <Button className="text-muted bg-transparent items-center flex max-w-[22rem] md:w-fit  px-[3.2rem] py-[1rem]  md:py-[1.4rem] rounded-xl border border-[#6E67774D] space-x-[.8rem]">
                        <Heart size={18} />
                        <span>1.2k like </span>
                    </Button>
                </div>
            </div>
            <ReviewModal open={writeReview} setOpen={setWriteReview} />
        </>
    )
}