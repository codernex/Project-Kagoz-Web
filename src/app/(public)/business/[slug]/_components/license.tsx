"use client"
import { appendApi } from "@/lib/utils";
import { useGetBusinessBySlugQuery } from "@/redux/api";
import { format } from "date-fns";
import Image from "next/image";
import { useParams } from "next/navigation";

export const License = () => {
  const { slug } = useParams() as { slug: string }
  const { data } = useGetBusinessBySlugQuery(slug)
  return (
    <div className="space-y-sm">
      <h2 className="text-[2.4rem] font-bold text-black">Verified License</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[4rem]">
        <div>
          <p className="text-muted">
            Expiry Date: {format(data?.tradeLicenseExpireDate || new Date(), 'dd-MM-yyy')}
          </p>
          <Image src={appendApi(data?.tradeLicenseUrl || '')} width={300} height={300} alt="Test" />
        </div>
      </div>
    </div>
  );
};
