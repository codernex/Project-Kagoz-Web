import { ArrowRight } from "lucide-react";

export const Categories = () => {
  return (
    <section className="container py-[6rem] lg:py-[10rem] space-y-[2rem]">
      <h2 className="text-[2.8rem] font-bold text-black">Our Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-[2rem]">
        {Array.from({ length: 20 }).map((_, index) => {
          return (
            <div key={index} className="flex text-muted items-center space-x-2">
              <ArrowRight size={20} />
              <span>Off License</span>
              <span>10</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
