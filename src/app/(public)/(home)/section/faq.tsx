import Faq from "@/components/shared/faq";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FAQ() {
  return (
    <section className="bg-white section section_padding">
      <div className="container">
        <div className="flex items-center flex-col md:flex-row lg:space-x-[12rem]">
          <div className="md:w-1/2 py-6 w-full">
            <h2 className="section_title !text-left">
              Frequently Asked Questions
            </h2>
            <p className="text-muted leading-md pt-[1.6rem]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              complicated master eiusmod tempor incididunt ut labore et dolore
              magna aliqua. Quiser amerodes ipsum suspendisse dolors ultrices
              gravid risus commodo.
            </p>
            <Button
              asChild
              className="rounded-xl h-[4rem] w-[14rem] md:h-[5rem] md:w-[17.5rem] md:text-sm bg-primary text-white mt-[4rem]"
            >
              <Link className="text-xsm" href={"/about-us"}>
                Discover More
              </Link>
            </Button>
          </div>

          <div className="md:w-1/2 w-full rounded-[2.2rem] bg-bgPrimaryShade py-[1.6rem] md:py-[6.2rem] md:px-[4.8rem]">
            <Faq />
          </div>
        </div>
      </div>
    </section>
  );
}
