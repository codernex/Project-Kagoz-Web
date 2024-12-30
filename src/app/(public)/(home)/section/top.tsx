"use client"
import { Button } from "@/components/shared/button";
import { Loader } from "@/components/shared/loader";
import { NotFound } from "@/components/shared/not-found";
import { Calendar } from "@/components/svgs/calendar";
import VerifiedBadge from "@/components/svgs/verifed";
import VerfiedLisence from "@/components/svgs/verified-lisence";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useStarRatings } from "@/hooks/generate-star-ratings";
import { useBusinessOpen } from "@/hooks/isBusinessOpen";
import { useVideoPalyerModal } from "@/hooks/videoPlayerModal";
import { appendApi, cn } from "@/lib/utils";
import { useClaimBusinessMutation, useGetBusinessBySlugQuery, useGetReviewQuery, useHasLikedBusinessQuery, useLikeBusinessMutation } from "@/redux/api";
import { differenceInDays, differenceInYears } from 'date-fns';
import { Clock3, Heart, PlayIcon, PlusIcon, Share2Icon, Star, TwitterIcon } from "lucide-react";
import millify from "millify";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ReviewModal } from "../../business/[slug]/_components/reviewModal";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { TextInput } from "@/components/shared/text-input";
export default function TopSection() {
    const { slug } = useParams() as { slug: string }
    const [openShareModal, setOpenShareModal] = useState(false)
    const [claimModal, setClaimModal] = useState(false)
    const { data, isLoading } = useGetBusinessBySlugQuery(slug)
    const claimForm = useForm({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
        }
    })
    const isOpen = useBusinessOpen(data?.openingHours)
    const { data: reviews } = useGetReviewQuery(slug)
    const averageRatings = useMemo(() => {
        if (!reviews) return 0
        return reviews?.reduce((a, b) => a + parseFloat(b.rating), 0) / reviews?.length || 0
    }, [reviews])
    const generateStarRating = useStarRatings(averageRatings, 20);
    const [writeReview, setWriteReview] = useState(false);
    const [like] = useLikeBusinessMutation()
    const { data: liked } = useHasLikedBusinessQuery(slug)
    const { open, setOpen } = useVideoPalyerModal()
    const [claimBusiness] = useClaimBusinessMutation()

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
                                {
                                    data?.isTrusted ? (
                                        <VerifiedBadge className="absolute -top-4 -right-8" />
                                    ) : null
                                }
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
                                    <span>{Math.round(differenceInDays(new Date(), data.createdAt) / 30)} Month with KAGOZ</span>
                                </p>
                            </div>
                            <div className="flex flex-col lg:flex-row lg:items-center py-[1.4rem] gap-x-[4rem] gap-y-[1rem]">
                                {
                                    data?.isVerified ? <div className="flex space-x-1 items-center">
                                        <VerfiedLisence width="16" height="16" />
                                        <p className="text-verifiedColor text-sm font-semibold">
                                            Verified License
                                        </p>
                                    </div> : ''
                                }
                                <div className="flex items-center space-x-2">
                                    <span className="text-yellow-400 text-sm flex">
                                        {generateStarRating}
                                    </span>
                                    <p className="text-sm text-muted">{averageRatings} ({reviews?.length})</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-x-[.6rem] gap-y-[.6rem]">
                                <div
                                    className="flex rounded-xl text-[1.1rem] items-center space-x-2 py-[0.4rem] px-[1rem] text-muted bg-[#6E67771A] border border-[#6E677733]"
                                >
                                    <span>{data?.primaryCategory?.name}</span>
                                </div>
                                {data.subcategories.map((c, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="flex rounded-xl text-[1.1rem] items-center space-x-2 py-[0.4rem] px-[1rem] text-muted bg-[#6E67771A] border border-[#6E677733]"
                                        >
                                            <span>{c.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    {
                        data?.youtubeVideo ? (
                            <div className="md:absolute top-0 right-0">
                                <Button onClick={() => setOpen(true, data.youtubeVideo)} className="flex items-center w-[22rem] md:w-fit  bg-[#323031] px-[3.2rem] py-[1rem] md:py-[1.9rem] rounded-xl space-x-[.8rem]">
                                    <div className="w-[2.2rem] h-[2.2rem] rounded-full bg-white flex items-center justify-center">
                                        <PlayIcon size={18} className="fill-black" />
                                    </div>
                                    <span className="text-sm xl:text-[2rem] font-medium">
                                        Play Video
                                    </span>
                                </Button>
                            </div>
                        ) : null
                    }
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
                    <Button onClick={() => setOpenShareModal(true)} className="text-muted items-center  flex max-w-[22rem] md:w-fit px-[3.2rem] py-[1rem] md:py-[1.4rem] rounded-xl border border-[#6E67774D] bg-transparent space-x-[.8rem]">
                        <Share2Icon size={18} />
                        <span>Share</span>
                    </Button>
                    <Button onClick={() => like(slug)} className={
                        cn('text-muted bg-transparent items-center flex max-w-[22rem] md:w-fit  px-[3.2rem] py-[1rem]  md:py-[1.4rem] rounded-xl border border-[#6E67774D] space-x-[.8rem]')
                    }>
                        <Heart className={cn(liked?.hasLiked && 'text-pink-500')} size={18} />
                        <span>{millify(data.likes)} like </span>
                    </Button>
                    <Button onClick={() => setClaimModal(true)} className="text-muted items-center  flex max-w-[22rem] md:w-fit px-[3.2rem] py-[1rem] md:py-[1.4rem] rounded-xl border border-[#6E67774D] bg-transparent space-x-[.8rem]">
                        <PlusIcon size={18} />
                        <span>Claim</span>
                    </Button>
                </div>
            </div>
            <ReviewModal open={writeReview} setOpen={setWriteReview} />
            <hr className="border-[#EEEDED]" />
            <Dialog open={openShareModal} onOpenChange={setOpenShareModal}>
                <DialogContent className="max-w-4xl !rounded-xs">
                    <DialogHeader>
                        <DialogTitle className="text-md text-black">
                            Share this business with your social account
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center gap-4">
                        <button onClick={() => {
                            const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(process.env.NEXT_PUBLIC_BASE_URL + `/business/${slug}`)}`;
                            window.open(url, '_blank', 'width=600,height=400');
                        }}>
                            <svg
                                width="46"
                                height="46"
                                viewBox="0 0 46 46"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect width="46" height="46" rx="23" fill="#0862F6" />
                                <path
                                    d="M20.6959 24.2478H18.3199C17.9359 24.2478 17.8159 24.1038 17.8159 23.7438V20.8398C17.8159 20.4558 17.9599 20.3358 18.3199 20.3358H20.6959V18.2238C20.6959 17.2638 20.8639 16.3518 21.3439 15.5118C21.8479 14.6478 22.5679 14.0718 23.4799 13.7358C24.0799 13.5198 24.6799 13.4238 25.3279 13.4238H27.6799C28.0159 13.4238 28.1599 13.5678 28.1599 13.9038V16.6398C28.1599 16.9758 28.0159 17.1198 27.6799 17.1198C27.0319 17.1198 26.3839 17.1198 25.7359 17.1438C25.0879 17.1438 24.7519 17.4558 24.7519 18.1278C24.7279 18.8478 24.7519 19.5438 24.7519 20.2878H27.5359C27.9199 20.2878 28.0639 20.4318 28.0639 20.8158V23.7198C28.0639 24.1038 27.9439 24.2238 27.5359 24.2238H24.7519V32.0478C24.7519 32.4558 24.6319 32.5998 24.1999 32.5998H21.1999C20.8399 32.5998 20.6959 32.4558 20.6959 32.0958V24.2478Z"
                                    fill="white"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={() => {
                                const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(process.env.NEXT_PUBLIC_BASE_URL + `/business/${slug}`)}`;
                                window.open(url, '_blank', 'width=600,height=400');
                            }}
                            className="w-[4.6rem] h-[4.6rem] flex items-center justify-center rounded-full bg-slate-100  ">
                            <TwitterIcon className="fill-[#1DA1F2] stroke-[#1DA1F2]" />
                        </button>
                        <button onClick={() => {
                            const url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(process.env.NEXT_PUBLIC_BASE_URL + `/business/${slug}`)}`;
                            window.open(url, '_blank', 'width=600,height=400');
                        }}>
                            <svg
                                width="46"
                                height="46"
                                viewBox="0 0 46 46"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect width="46" height="46" rx="23" fill="#0073AF" />
                                <g clipPath="url(#clip0_299_2567)">
                                    <path
                                        d="M16.3991 14.0127C15.0772 14.0127 14.001 15.0888 14 16.4117C14 17.7346 15.0763 18.8109 16.3991 18.8109C17.7215 18.8109 18.7972 17.7346 18.7972 16.4117C18.7972 15.0889 17.7215 14.0127 16.3991 14.0127ZM18.1997 19.7748H14.5983C14.5575 19.7748 14.5172 19.7829 14.4795 19.7985C14.4419 19.8141 14.4077 19.8369 14.3789 19.8657C14.35 19.8945 14.3272 19.9288 14.3116 19.9664C14.296 20.0041 14.288 20.0444 14.288 20.0852V31.6771C14.288 31.7594 14.3207 31.8383 14.3789 31.8965C14.4371 31.9547 14.516 31.9874 14.5983 31.9874H18.1996C18.2819 31.9874 18.3609 31.9547 18.419 31.8965C18.4772 31.8383 18.51 31.7594 18.51 31.6771V20.0852C18.51 20.0444 18.502 20.0041 18.4864 19.9664C18.4708 19.9287 18.448 19.8945 18.4192 19.8657C18.3904 19.8369 18.3561 19.814 18.3185 19.7984C18.2808 19.7828 18.2405 19.7748 18.1997 19.7748ZM27.4066 19.6384C26.0887 19.6384 24.9305 20.0397 24.2237 20.6941V20.0852C24.2237 19.9137 24.0848 19.7748 23.9134 19.7748H20.4587C20.418 19.7748 20.3776 19.7829 20.34 19.7985C20.3023 19.814 20.2681 19.8369 20.2393 19.8657C20.2105 19.8945 20.1876 19.9288 20.172 19.9664C20.1564 20.0041 20.1484 20.0444 20.1484 20.0852V31.6771C20.1484 31.7179 20.1564 31.7582 20.172 31.7959C20.1876 31.8335 20.2105 31.8677 20.2393 31.8965C20.2681 31.9254 20.3023 31.9482 20.34 31.9638C20.3776 31.9794 20.418 31.9874 20.4587 31.9874H24.0567C24.139 31.9874 24.2179 31.9547 24.2761 31.8965C24.3343 31.8383 24.367 31.7594 24.367 31.6771V25.942C24.367 24.2965 24.6697 23.2766 26.1802 23.2766C27.6684 23.2784 27.7797 24.3721 27.7797 26.0403V31.6771C27.7798 31.7179 27.7878 31.7582 27.8034 31.7959C27.819 31.8335 27.8419 31.8677 27.8707 31.8965C27.8995 31.9254 27.9337 31.9482 27.9714 31.9638C28.009 31.9794 28.0494 31.9874 28.0902 31.9874H31.6898C31.7721 31.9874 31.851 31.9547 31.9092 31.8965C31.9674 31.8383 32 31.7594 32.0001 31.6771V25.3184C32 22.6739 31.4779 19.6384 27.4066 19.6384Z"
                                        fill="white"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_299_2567">
                                        <rect
                                            width="18"
                                            height="18"
                                            fill="white"
                                            transform="translate(14 14)"
                                        />
                                    </clipPath>
                                </defs>
                            </svg>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={claimModal} onOpenChange={setClaimModal}>
                <DialogContent className="max-w-4xl !rounded-xs">
                    <DialogHeader>
                        <DialogTitle className="text-md text-black">
                            Claim this business
                        </DialogTitle>
                    </DialogHeader>
                    <Form {...claimForm}>
                        <form className="space-y-4" onSubmit={claimForm.handleSubmit(d => {
                            claimBusiness({ slug, ...d })
                            setClaimModal(false)
                        })}>
                            <TextInput required control={claimForm.control} label="Your name" name="name" placeholder="eg: John D." />
                            <TextInput required control={claimForm.control} label="Your Email" name="email" placeholder="eg: johnd@example.com" />
                            <TextInput required control={claimForm.control} label="Your Phone" name="phone" placeholder="eg: 018xx xxx xxx" />
                            <Button className="h-16 max-w-[14rem]">
                                Submit
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}