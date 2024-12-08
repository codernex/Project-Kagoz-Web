"use client"
import { Loader } from "@/components/shared/loader";
import SvgInline from "@/components/shared/svg-inline";
import { appendApi } from "@/lib/utils";
import { useGetBusinessBySlugQuery } from "@/redux/api";
import { Calendar, CheckCircle2, XCircle } from "lucide-react";
import { useParams } from "next/navigation";

export const BusinessFacilities = () => {
  const { slug } = useParams() as { slug: string }
  const { data, isLoading } = useGetBusinessBySlugQuery(slug)

  if (isLoading) {
    return <Loader />
  }

  if (!data?.facilities) {
    return null
  }

  return (
    <div className="space-y-sm">
      <h2 className="text-[2.4rem] font-bold text-black">
        Business Facilities
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-y-10">
        {data.facilities.map((f, index) => (
          <div key={index} className="flex items-center space-x-xs">
            <CheckCircle2 size={20} className="text-green-500" />
            <div className="flex space-x-xxs text-black font-medium items-center">
              <SvgInline className="h-16 w-16 hover:stroke-orange-500 " url={appendApi(f.iconUrl)} />
              <p>Walk-ins Welcome</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
