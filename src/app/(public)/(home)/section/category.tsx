"use client";
import {
  useGetCategoriesQuery
} from "@/redux/api/category";
import CategoryItem from "./components/category-item";
import CategoryItemSkeleton from "./components/category-item-loading";

const Category = () => {
  const { data, isLoading } = useGetCategoriesQuery();
  return (
    <section className="bg-[#6F00FF05] section_padding">
      <div className="container">
        <h2 className="section_title pb-[6rem] ">Our Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-[2rem] gap-y-[2rem] lg:gap-x-[3.2rem] lg:gap-y-[3.5rem]">
          {isLoading
            ? Array.from({ length: 12 }).map((_, i) => {
                return <CategoryItemSkeleton key={i} />;
              })
            : data?.slice(0, 12)?.map((category, index) => {
                return <CategoryItem key={index} {...category} />;
              })}
        </div>
      </div>
    </section>
  );
};

export default Category;
