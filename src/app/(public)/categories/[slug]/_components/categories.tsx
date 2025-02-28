import { Loader } from "@/components/shared/loader";
import { useFetchOnVisible } from "@/hooks/useLazyApiCall";
import { useLazyGetCategoriesQuery } from "@/redux/api/category";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export const Categories = () => {
  const [getCategories, { data, isLoading }] = useLazyGetCategoriesQuery();
  const sectionRef = useRef<HTMLElement>(null);
  useFetchOnVisible(sectionRef, getCategories);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section
      ref={sectionRef}
      className="container space-y-[2rem] py-[6rem] lg:py-[10rem]"
    >
      <h2 className="text-[2.8rem] font-bold text-black">Our Categories</h2>
      <div className="grid grid-cols-2 gap-y-[2rem] md:grid-cols-4">
        {data?.map((category, index) => {
          return (
            <Link
              href={category.slug ? category.slug + "-in-dhaka" : ""}
              key={index}
              className="flex items-center space-x-2 text-muted"
            >
              <ArrowRight size={20} />
              <span>{category.name}</span>
              <span>{category.businessCount}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
