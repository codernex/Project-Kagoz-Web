
import { appendApi } from "@/lib/utils";
import { axiosInstance } from "@/redux/api";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import Dompurify from 'dompurify'

const CategoryItem: React.FC<ICategory> = ({ ...category }) => {
  const [data, setData] = useState<string>('')

  useEffect(() => {
    if (category.iconUrl) {
      axiosInstance.get(appendApi(category.iconUrl)).then(res => {
        if (res.data) {
          setData(res.data); // Correctly update state with the fetched data
        }
      }).catch(error => {
        console.error('Error fetching data:', error); // Handle errors gracefully
      });
    }
  }, [category.iconUrl]);

  const sanitizedData = useMemo(() => Dompurify.sanitize(data), [data])


  return (
    <Link href={`/categories/${category.slug}`} className="py-[1rem] lg:py-[3.2rem] px-[2.4rem] bg-white rounded-sm flex flex-col items-center gap-y-[.5rem] lg:gap-y-[2rem]">
      <div
        dangerouslySetInnerHTML={{
          __html: sanitizedData,
        }}
        className="h-[6rem] w-[6rem] lg:h-[8rem] lg:w-[8rem] p-6 rounded-full bg-[#6F00FF0D] flex items-center justify-center border-[1px] border-[#6F00FF33] hover:stroke-primary transition-colors ease-linear delay-300"
        role="presentation"
        aria-hidden="true"
      />
      <h3 className=" text-sm lg:text-md font-semibold text-center leading-[25.41px] text-black">
        {category.name}
      </h3>
      <div className="border-[1px] border-[#6F00FF33] rounded-xl bg-[#6F00FF0D] w-[5rem] lg:w-[6.8rem] text-center h-[2.4rem] lg:h-[3.4rem] flex items-center justify-center">
        <p className="text-primary font-semibold text-xs lg:text-[1.8rem]">
          {category.businessCount}
        </p>
      </div>
    </Link>
  );
};

export default CategoryItem;
