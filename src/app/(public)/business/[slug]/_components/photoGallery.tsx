"use client";
import { appendApi } from "@/lib/utils";
import { useGetPhotosQuery } from "@/redux/api";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function PhotoGallery() {
  const { slug } = useParams() as { slug: string }
  const { data } = useGetPhotosQuery(slug)

  if (!data?.length) {
    return null
  }
  return (
    <>
      <div className="space-y-sm">
        <h2 className="text-mdx font-bold text-black">Our Photo Gallery</h2>
        <div className="gap-sm flex">
          {data?.slice(0, 4).map((file, index) => {
            return (
              <div
                key={index}
                className="h-[16rem] w-[22rem] border border-borderColor rounded-xs overflow-hidden relative"
              >
                <Image
                  src={appendApi(file.url)}
                  alt="Business Image"
                  className="w-full h-full object-cover"
                  fill
                />
                {index === 3 ? (
                  <>
                    <div className="relative w-full h-full bg-[#00000099] z-10" />
                    <div className="absolute top-0 text-mdx font-semibold left-0 w-full h-full  text-white z-20 flex items-center justify-center">
                      +{data.length - 4}
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </div>
      </div>
      <hr className="border-[#EEEDED]" />
    </>

  );
};
