import { Button } from "@/components/shared/button";
import Image from "next/image";

export const FeaturedOffer = () => {
  return (
    <div className="pb-10">
      <h2 className="text-md text-black font-bold pb-[2.4rem]">
        Featured Offer
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[4rem]">
        {Array.from({ length: 2 }).map((_, index) => {
          return (
            <div key={index} className="flex flex-col items-center">
              <div className="w-full h-[46rem] relative border-[2px] border-primary rounded-sm overflow-hidden">
                <Image
                  src={"/images/featured_offer.png"}
                  className="object-cover"
                  alt=""
                  fill
                />
              </div>
              <Button className="h-[4.8rem] w-[14rem] rounded-xl -my-10 border-none relative z-20">
                Book Now
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
