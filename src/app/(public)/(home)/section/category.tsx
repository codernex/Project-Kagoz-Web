import { useLazyGetCategoriesQuery } from "@/redux/api/category";
import CategoryItem from "./components/category-item";
import { useFetchOnVisible } from "@/hooks/useLazyApiCall";
import { useRef } from "react";

const Category = () => {
  const [getCategories, { data }] = useLazyGetCategoriesQuery()
  const ref = useRef<HTMLDivElement>(null)

  useFetchOnVisible(ref, getCategories, { threshold: 1 })
  return (
    <section ref={ref} className="bg-[#6F00FF05] section_padding">
      <div className="container">
        <h2 className="section_title pb-[6rem] ">Our Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-[2rem] gap-y-[2rem] lg:gap-x-[3.2rem] lg:gap-y-[3.5rem]">
          {data?.slice(0, 12)?.map((category, index) => {
            return <CategoryItem key={index} {...category} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default Category;
