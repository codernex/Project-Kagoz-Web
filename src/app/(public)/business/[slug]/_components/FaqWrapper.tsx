"use client";
import Faq from "@/components/shared/faq";
import { useGetFaqsQuery } from "@/redux/api";
import { useParams } from "next/navigation";

export const FaqBusinessWrapper = () => {
  const { slug } = useParams() as { slug: string };
  const { data, isLoading } = useGetFaqsQuery(slug);
  if (!data?.length) {
    return null;
  }
  return (
    <>
      <div className="space-y-sm">
        <h2 className="text-mdx font-bold text-black">{"FAQ's"}</h2>
        <Faq faqs={data} isLoading={isLoading} />
      </div>
      <hr className="border-[#EEEDED]" />
    </>
  );
};
