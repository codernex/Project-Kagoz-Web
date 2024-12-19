"use client"
import { useGetBusinessBySlugQuery } from "@/redux/api";
import { useParams } from "next/navigation";

export const OwnerText = () => {
  const { slug } = useParams() as { slug: string }
  const { data } = useGetBusinessBySlugQuery(slug)
  return (
    <>
      <div className="space-y-sm">
        <h2 className="text-mdx font-bold text-black">Business Owner</h2>
        <div>
          <h3 className="text-smd font-semibold text-black">{data?.owner?.name || 'Unknown'}</h3>
          <p className="text-muted text-sm leading-smlg">
            {
              data?.owner?.ownerText || ''
            }
          </p>
        </div>
      </div>
      <hr className="border-[#EEEDED]" />
    </>

  );
};
