import { appendApi } from "@/lib/utils";
import { axiosInstance } from "@/redux/api";
import Dompurify from "dompurify";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

const CategoryItem: React.FC<ICategory> = ({ ...category }) => {
  const [data, setData] = useState<string>("");

  useEffect(() => {
    if (category.iconUrl) {
      axiosInstance
        .get(appendApi(category.iconUrl))
        .then((res) => {
          if (res.data) {
            setData(res.data); // Correctly update state with the fetched data
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error); // Handle errors gracefully
        });
    }
  }, [category.iconUrl]);

  const sanitizedData = useMemo(() => Dompurify.sanitize(data), [data]);

  return (
    <Link
      href={`/categories/${category.slug}-in-dhaka`}
      className="flex flex-col items-center gap-y-[.5rem] rounded-sm bg-white px-[2.4rem] py-[1rem] lg:gap-y-[2rem] lg:py-[3.2rem]"
    >
      <div
        dangerouslySetInnerHTML={{
          __html: sanitizedData,
        }}
        className="flex h-[6rem] w-[6rem] items-center justify-center rounded-full border-[1px] border-[#6F00FF33] bg-[#6F00FF0D] p-6 transition-colors delay-300 ease-linear hover:stroke-primary lg:h-[8rem] lg:w-[8rem]"
        role="presentation"
        aria-hidden="true"
      />
      <h3 className="text-center text-sm font-semibold leading-[25.41px] text-black lg:text-md">
        {category.name}
      </h3>
      <div className="flex h-[2.4rem] w-[5rem] items-center justify-center rounded-xl border-[1px] border-[#6F00FF33] bg-[#6F00FF0D] text-center lg:h-[3.4rem] lg:w-[6.8rem]">
        <p className="text-xs font-semibold text-primary lg:text-[1.8rem]">
          {category.businessCount}
        </p>
      </div>
    </Link>
  );
};

export default CategoryItem;
