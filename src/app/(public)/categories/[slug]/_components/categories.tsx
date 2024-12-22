import { Loader } from "@/components/shared/loader";
import { useFetchOnVisible } from "@/hooks/useLazyApiCall";
import { useLazyGetCategoriesQuery } from "@/redux/api/category";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export const Categories = () => {
  const [getCategories, {
    data,
    isLoading
  }] = useLazyGetCategoriesQuery()
  const sectionRef = useRef<HTMLElement>(null);
  useFetchOnVisible(sectionRef, getCategories)

  if (isLoading) {
    return (
      <Loader />
    )
  }

  return (
    <section ref={sectionRef} className="container py-[6rem] lg:py-[10rem] space-y-[2rem]">
      <h2 className="text-[2.8rem] font-bold text-black">Our Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-[2rem]">
        {data?.map((category, index) => {
          return (
            <Link href={category.slug ?? ''} key={index} className="flex text-muted items-center space-x-2">
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
