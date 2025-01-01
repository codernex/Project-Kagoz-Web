"use client"
import { appendApi, trimToWordCount } from "@/lib/utils";
import { useGetBusinessBySlugQuery } from "@/redux/api";
import Image from "next/image";
import { useParams } from "next/navigation";

export const AboutBusiness = () => {
  const { slug } = useParams() as { slug: string }
  const { data } = useGetBusinessBySlugQuery(slug)
  console.log(data?.primaryCategory, data?.subcategories);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="space-y-sm">
          <h2 className="text-mdx font-bold text-black">About Our Business</h2>
          <div className="text-sm leading-smlg text-muted">
            <p>
              {data?.about}
            </p>
          </div>
        </div>

        <div className="space-y-sm">
          <h2 className="text-mdx font-bold text-black">Our Service List</h2>
          <div className="space-y-smd">
            <div className="flex items-center space-x-xsm">
              <div className="h-[4rem] w-[4rem] border border-borderColor rounded-full flex items-center justify-center">
                <Image src={appendApi(data?.primaryCategory.iconUrl || '')} alt={data?.primaryCategory.name || ''} width={24} height={24} />
              </div>
              <div>
                <h3 className="font-bold text-black text-smd">{data?.primaryCategory.name}</h3>
                <p className="text-muted">
                  {trimToWordCount(data?.primaryCategory.about || '', 6)}
                </p>
              </div>
            </div>
            {data?.subcategories.map((c, index) => {
              return (
                <div key={index} className="flex items-center space-x-xsm">
                  <div className="h-[4rem] w-[4rem] border border-borderColor rounded-full flex items-center justify-center">
                    <Image src={appendApi(c.iconUrl || '')} alt={c.name || ''} width={24} height={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-black text-smd">{c.name}</h3>
                    <p className="text-muted">
                      {trimToWordCount(c.about, 6)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <hr className="border-[#EEEDED]" />
    </>

  );
};
