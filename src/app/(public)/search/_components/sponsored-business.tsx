import { SponsoredBusinessItem } from "@/components/shared/sponsored-item";

export const SponsoredBusiness = () => {
  return (
    <div className="container pt-[4rem] pb-[6rem]">
      <h2 className="text-md text-black font-semibold pb-[2.4rem]">
        Sponsored Business
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3rem] ">
        {Array.from({ length: 3 }).map((_, index) => {
          return <SponsoredBusinessItem key={index} />;
        })}
      </div>
    </div>
  );
};
