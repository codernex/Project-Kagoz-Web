"use client";
import Faq from "@/components/shared/faq";
import { useGetSiteFaqQuery } from "@/redux/api";

export default function FAQ() {
  const { data, isLoading } = useGetSiteFaqQuery();
  return (
    <section className="bg-white section section_padding">
      <div className="container">
        <div className="flex items-center flex-col md:flex-row lg:space-x-[12rem]">
          <div className="md:w-1/2 py-6 w-full">
            <h2 className="section_title !text-left">
              Frequently Asked Questions
            </h2>
            <p className="text-muted leading-md pt-[1.6rem]">
              Explore our FAQ section to learn more about KAGOZ, how to list
              your business, guest posting opportunities, and the features we
              offer to support and empower local businesses in Bangladesh.
            </p>
          </div>

          <div className="md:w-1/2 w-full rounded-[2.2rem] bg-bgPrimaryShade py-[1.6rem] md:py-[6.2rem] md:px-[4.8rem]">
            <Faq faqs={data?.slice(0, 5)} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </section>
  );
}
