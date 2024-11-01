import { useStarRatings } from "@/hooks/generate-star-ratings";

export const Reviews = () => {
  const ratings = useStarRatings(4.5, 22);
  return (
    <div className="space-y-sm">
      <h2 className="text-mdx font-bold text-black">Reviews</h2>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 text-black items-center">
          <div className="space-y-xs">
            <h3 className="text-[2.1rem] font-semibold">Total Reviews</h3>
            <h1 className="text-[3.6rem] font-bold">10.0k</h1>
          </div>
          <div className="border border-[#EEEDED] border-t-0 border-b-0 space-y-xs pl-[2rem]">
            <h3 className="text-[2.1rem] font-semibold">Average Rating</h3>
            <div className="flex items-center space-x-4">
              <h2 className="text-[2.8rem] font-bold">4.5</h2>
              <div className="flex">{ratings}</div>
            </div>
          </div>

          <div className="space-y-xs pl-[2rem]">
            <div className="flex space-x-3 items-center">
              <div className="w-[2rem]">
                <h3 className="text-[2.1rem] font-semibold text-muted">5</h3>
              </div>
              <div className="bg-[#FFC107] w-full h-[.8rem] rounded-xl" />
            </div>
            <div className="flex space-x-3 items-center">
              <div className="w-[2rem]">
                <h3 className="text-[2.1rem] font-semibold text-muted">4</h3>
              </div>
              <div className="bg-[#FFC107] w-4/5 h-[.8rem] rounded-xl" />
            </div>
            <div className="flex space-x-3 items-center">
              <div className="w-[2rem]">
                <h3 className="text-[2.1rem] font-semibold text-muted">3</h3>
              </div>
              <div className="bg-[#FFC107] w-3/5 h-[.8rem] rounded-xl" />
            </div>
            <div className="flex space-x-3 items-center">
              <div className="w-[2rem]">
                <h3 className="text-[2.1rem] font-semibold text-muted">2</h3>
              </div>
              <div className="bg-[#FFC107] w-2/5 h-[.8rem] rounded-xl" />
            </div>
            <div className="flex space-x-3 items-center">
              <div className="w-[2rem]">
                <h3 className="text-[2.1rem] font-semibold text-muted">1</h3>
              </div>
              <div className="bg-[#FFC107] w-1/5 h-[.8rem] rounded-xl" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-md">
          {Array.from({ length: 3 }).map((_, index) => {
            return <ReviewItem key={index} />;
          })}
        </div>
      </div>
    </div>
  );
};

export const ReviewItem = () => {
  const ratings = useStarRatings(4.5, 18);
  return (
    <div className="text-black grid grid-cols-6 items-start">
      <div className="space-y-2 col-span-2">
        <p className="text-muted">24/08/2024</p>
        <h3 className="text-smd font-semibold">Borhan U.</h3>
      </div>
      <div className="col-span-4">
        <div className="flex space-x-3 items-center">
          <h3 className="text-[2.8rem] font-bold text-black">5.0</h3>
          <div className="flex">{ratings}</div>
        </div>
        <p className="text-sm leading-smlg text-muted">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          blandit risus vel mauris mattis viverra. Phasellus ultricies id nisi
          vitae vulputate. Lorem ipsum dolor sit amet, consectetur adipiscing
          eli
        </p>
      </div>
    </div>
  );
};
