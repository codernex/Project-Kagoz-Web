"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";

function FaqSkeleton() {
  return (
    <div className="w-full space-y-[2.8rem] animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-smd border-none bg-white shadow-md px-[1.8rem] py-[.6rem] md:py-[1.4rem]"
        >
          <div className="flex items-center space-x-[1.6rem]">
            <div className="h-[4rem] w-[4rem] flex items-center justify-center border border-gray-200 rounded-[.6rem] bg-gray-100" />
            <div className="flex-1 space-y-[.8rem]">
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-3 w-2/3 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="mt-[1.2rem] space-y-[.6rem]">
            <div className="h-3 w-full bg-gray-100 rounded" />
            <div className="h-3 w-5/6 bg-gray-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Faq({
  faqs = [],
  isLoading,
}: {
  faqs?: IBusiness["faqs"][];
  isLoading: boolean;
}) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || isLoading) {
    return <FaqSkeleton />;
  }
  return (
    <div>
      <Accordion type="single" collapsible className="w-full space-y-[2.8rem]">
        {faqs?.map((f, i) => (
          <AccordionItem
            value={`item-${i}`}
            key={i}
            className="rounded-smd border-none bg-white shadow-md px-[1.8rem] py-[.6rem] md:py-[1.4rem]"
          >
            <AccordionTrigger className="text-sm lg:text-md hover:no-underline">
              <div className="space-x-[1.6rem] text-black font-bold text-left flex items-center">
                <span className="h-[4rem] w-[4rem] flex items-center justify-center border border-borderColor rounded-[.6rem]">
                  {i + 1}
                </span>
                <span>{f.question}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted">
              {f.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
