"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";

export default function Faq({ faqs = [] }: { faqs?: IBusiness["faqs"][] }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
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
            <AccordionContent className="text-xs lg:text-sm text-muted">
              {f.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
