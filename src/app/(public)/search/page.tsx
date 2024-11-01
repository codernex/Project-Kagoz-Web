"use client";
import { AdSpace } from "@/components/shared/ad-space";
import { BlogWidget } from "@/components/shared/blog-widget";
import { Pagination } from "@/components/shared/pagination";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Categories } from "./_components/categories";
import { MobileFilter } from "./_components/mobile-filter";
import { OtherFilter } from "./_components/other-filter";
import { SearchItem } from "./_components/search-item";
import { SponsoredBusiness } from "./_components/sponsored-business";

export default function Search() {
  const [activeSearchType, setActiveSearchType] = useState<
    "Category" | "Business"
  >("Category");
  const [lisenceType, setLisenceType] = useState<"KAGOZ" | "Verified Lisence">(
    "KAGOZ",
  );
  const [avalibility, setAvalibility] = useState<"Now Open" | "Now Closed">(
    "Now Open",
  );
  return (
    <main>
      <section className="container">
        <div className="w-full py-[2.4rem]">
          <div className="flex items-center text-muted">
            <Link href={"/"}>Home</Link>
            <ChevronRight size={18} />
            <span>Movers</span>
          </div>
          <h1 className="text-md lg:text-lg text-muted font-bold">
            Top 10 <span className="text-black">{'"Movers"'}</span> in{" "}
            <span className="text-black">Dhaka</span>
          </h1>
        </div>
      </section>

      <section className="container">
        <OtherFilter
          activeSearchType={activeSearchType}
          avalibility={avalibility}
          lisenceType={lisenceType}
          setAvalibility={setAvalibility}
          setLisenceType={setLisenceType}
          setActiveSearchType={setActiveSearchType}
        />

        <MobileFilter
          activeSearchType={activeSearchType}
          avalibility={avalibility}
          lisenceType={lisenceType}
          setAvalibility={setAvalibility}
          setLisenceType={setLisenceType}
          setActiveSearchType={setActiveSearchType}
        />
      </section>

      <section className="bg-bgPrimaryShade border border-borderColor">
        <SponsoredBusiness />
      </section>

      <section className="container py-[6rem] grid grid-cols-6 gap-x-[6rem] gap-y-[4rem]">
        <div className="w-full col-span-6 md:col-span-4 space-y-[3rem] ">
          {Array.from({ length: 10 }).map((b: any, index) => {
            return (
              <SearchItem
                key={index}
                index={index}
                id={index}
                isOpen={index % 2 === 0}
              />
            );
          })}
        </div>
        <div className="col-span-6 md:col-span-2 space-y-[4rem]">
          <BlogWidget />
          <AdSpace />
          <AdSpace />
        </div>
      </section>
      <section className="bg-bgPrimaryShade border border-borderColor">
        <SponsoredBusiness />
      </section>
      <Pagination />

      <section className="py-[6rem] lg:py-[10rem] bg-[#00000005]">
        <div className="container ">
          <h2 className="text-lg font-bold text-black">Title Goes Here</h2>
          <p className="text-muted space-y-[2rem]">
            <span className="inline-block">
              Lorem ipsum dolor sit amet consectetur. Odio orci euismod non eget
              vulputate. Pellentesque fringilla et sit sed auctor. Sit mattis
              arcu massa massa vivamus eget et. Potenti lorem sed dictumst
              gravida justo nisl congue. Sit nec sed porttitor cursus mauris
              purus eget sit. Nam amet velit lacus mi massa integer duis
              faucibus suspendisse. Sem sit ut vulputate molestie elementum
              cras. Enim suspendisse varius sem rutrum. Aliquet ultrices lectus
              urna sed bibendum. Tortor enim cum odio donec sed pharetra sapien
              eget facilisis.
            </span>

            <span className="inline-block">
              Cras consequat dui sodales enim. Sodales ornare viverra dictumst
              nisl lectus eu. Odio enim tellus amet feugiat sed potenti sit erat
              pharetra. Morbi tortor pellentesque metus praesent eu amet nisl.
              Nulla vestibulum quam vitae elementum sem in eget elementum. Urna
              turpis ornare pretium in. Morbi sed ac faucibus habitasse ut
              gravida eu. Eu ultrices senectus ullamcorper porttitor. Imperdiet
              varius tellus tristique ultrices ac. Quis dictum eget pellentesque
              quam sagittis fringilla tortor orci. Maecenas lacus adipiscing
              diam ac justo mi purus. Tincidunt egestas aliquet bibendum ac
              vitae aliquam sit at.
            </span>

            <span className="inline-block">
              Ut faucibus egestas sollicitudin leo vivamus amet ultricies.
              Dapibus enim vitae lectus cursus facilisi tortor nibh. Augue non
              laoreet ante lobortis vulputate arcu. Sit tellus vestibulum eget
              rutrum sit in erat odio. Proin id vestibulum consectetur sit morbi
              ullamcorper pellentesque nullam. Fermentum convallis velit
              vestibulum mauris eu orci ac egestas. At est nulla eget sit mi
              cras in. Senectus eu scelerisque netus commodo quisque at ultrices
              vitae ut. Accumsan nullam feugiat sit lacinia eget ut lobortis.
              Tellus facilisi nam ac nisl.
            </span>
          </p>
        </div>
      </section>

      <section className="bg-search-add-business h-[40rem]" />
      <Categories />
    </main>
  );
}
