"use client"
import { CustomButton } from "@/components/shared/custom-button";
import { useAddBusinessModal } from "@/hooks/addBusinessModal";
import { useGetBusinessByCurrentUserQuery, useGetBusinessBySlugQuery, useGetDailyPageViewsQuery, useGetReviewQuery, useGetTotalPageViewsQuery } from "@/redux/api";
import { ChartColumn, HeartIcon, LucideIcon, StarIcon } from "lucide-react";
import millify from "millify";
import { useParams } from "next/navigation";

export default function BusinessDashboard() {
  const { slug } = useParams() as { slug: string }
  const { setOpen } = useAddBusinessModal()
  const { data } = useGetBusinessByCurrentUserQuery()
  const { data: business } = useGetBusinessBySlugQuery(slug, {
    skip: slug === 'null'
  })
  const { data: reviews } = useGetReviewQuery(slug)
  const { data: totalPageViews } = useGetTotalPageViewsQuery(slug)
  const { data: dailyPageViews } = useGetDailyPageViewsQuery(slug)

  if (!data?.length) {
    return (
      <div className="flex items-center justify-center text-black font-semibold flex-col gap-3">
        <p className="text-md">Look like you {"don't have a business"}, Try to create one</p>
        <CustomButton onClick={() => setOpen(true)} className="rounded-xs bg-black">
          Add new
        </CustomButton>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-5 gap-10">
      <Stats title="Like" number={business?.likes || 0} Icon={HeartIcon} />
      <Stats title="Reviews" number={reviews?.length || 0} Icon={StarIcon} />
      <Stats title="Unique Page Views" number={dailyPageViews || 0} Icon={ChartColumn} />
      {/* <Stats title="Total Page Views" number={totalPageViews || 0} Icon={ChartColumn} /> */}
    </div>
  );
}

const Stats: React.FC<{
  number: number,
  Icon: LucideIcon,
  title: string
}> = ({ Icon, number, title }) => {
  return (
    <div className="text-black shadow-md rounded-xs py-8 px-6 text-center">
      <div className="flex items-center gap-2 justify-center">
        <span className="text-md font-semibold">{millify(number)}</span>
        <Icon />
      </div>
      <p className="text-md font-bold">{title}</p>
    </div>
  )
}
