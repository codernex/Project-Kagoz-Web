"use client"
import { useStarRatings } from "@/hooks/generate-star-ratings";
import { useGetReviewQuery } from "@/redux/api";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import millify from 'millify'

export const Reviews = () => {
  const { slug } = useParams() as { slug: string }

  const { data } = useGetReviewQuery(slug)
  const averageRatings = useMemo(() => {
    if (!data) return 0
    return data?.reduce((a, b) => a + parseFloat(b.rating), 0) / data?.length
  }, [data])
  const ratings = useStarRatings(averageRatings, 22);

  const ratingsNumber = useMemo(() => {
    return {
      5: data?.filter(a => parseFloat(a.rating) === 5).length || 0,
      4: data?.filter(a => parseFloat(a.rating) >= 4 && parseFloat(a.rating) < 5).length || 0,
      3: data?.filter(a => parseFloat(a.rating) >= 3 && parseFloat(a.rating) < 4).length || 0,
      2: data?.filter(a => parseFloat(a.rating) >= 2 && parseFloat(a.rating) < 3).length || 0,
      1: data?.filter(a => parseFloat(a.rating) >= 1 && parseFloat(a.rating) < 2).length || 0
    }
  }, [data])

  const getPercentage = useMemo(() => {
    const totalRatings = data?.length || 0;

    const calculateWidthClass = (count: number) => {
      const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
      return `w-[${Math.round(percentage)}%]`;
    };

    return {
      5: calculateWidthClass(ratingsNumber[5]),
      4: calculateWidthClass(ratingsNumber[4]),
      3: calculateWidthClass(ratingsNumber[3]),
      2: calculateWidthClass(ratingsNumber[2]),
      1: calculateWidthClass(ratingsNumber[1]),
    };
  }, [ratingsNumber, data])


  return (
    <div className="space-y-sm">
      <h2 className="text-mdx font-bold text-black">Reviews</h2>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 text-black items-center">
          <div className="space-y-xs">
            <h3 className="text-[2.1rem] font-semibold">Total Reviews</h3>
            <h1 className="text-[3.6rem] font-bold">{millify(data?.length || 0)}</h1>
          </div>
          <div className="border border-[#EEEDED] border-t-0 border-b-0 space-y-xs pl-[2rem]">
            <h3 className="text-[2.1rem] font-semibold">Average Rating</h3>
            <div className="flex items-center space-x-4">
              <h2 className="text-[2.8rem] font-bold">{averageRatings > 0 ? averageRatings.toFixed(1) : 0}</h2>
              <div className="flex">{ratings}</div>
            </div>
          </div>

          <div className="space-y-xs pl-[2rem] ">
            <div className="flex space-x-3 items-center">
              <div className="w-[2rem]">
                <h3 className="text-[2.1rem] font-semibold text-muted">5</h3>
              </div>
              <div className={`bg-[#FFC107] ${getPercentage[5]} h-[.8rem] rounded-xl`} />
            </div>
            <div className="flex space-x-3 items-center">
              <div className="w-[2rem]">
                <h3 className="text-[2.1rem] font-semibold text-muted">4</h3>
              </div>
              <div className={`bg-[#FFC107] ${getPercentage[4]} h-[.8rem] rounded-xl`} />
            </div>
            <div className="flex space-x-3 items-center">
              <div className="w-[2rem]">
                <h3 className="text-[2.1rem] font-semibold text-muted">3</h3>
              </div>
              <div className={`bg-[#FFC107] ${getPercentage[3]} h-[.8rem] rounded-xl`} />
            </div>
            <div className="flex space-x-3 items-center">
              <div className="w-[2rem]">
                <h3 className="text-[2.1rem] font-semibold text-muted">2</h3>
              </div>
              <div className={`bg-[#FFC107] ${getPercentage[2]} h-[.8rem] rounded-xl`} />
            </div>
            <div className="flex space-x-3 items-center">
              <div className="w-[2rem]">
                <h3 className="text-[2.1rem] font-semibold text-muted">1</h3>
              </div>
              <div className={`bg-[#FFC107] ${getPercentage[1]} h-[.8rem] rounded-xl`} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-md">
          {data?.map((review, index) => {
            return <ReviewItem key={index} review={review} />;
          })}
        </div>
      </div>
    </div>
  );
};

export const ReviewItem: React.FC<{ review: IReview }> = ({ review }) => {
  const ratings = useStarRatings(parseFloat(review.rating), 18);
  return (
    <div className="text-black grid grid-cols-6 items-start">
      <div className="space-y-2 col-span-2">
        <p className="text-muted">{format(review.createdAt, 'dd/mm/yyy')}</p>
        <h3 className="text-smd font-semibold">{review.name}</h3>
      </div>
      <div className="col-span-4">
        <div className="flex space-x-3 items-center">
          <h3 className="text-[2.8rem] font-bold text-black">{parseFloat(review.rating).toFixed(1)}</h3>
          <div className="flex">{ratings}</div>
        </div>
        <p className="text-sm leading-smlg text-muted">
          {review.message}
        </p>
      </div>
    </div>
  );
};
