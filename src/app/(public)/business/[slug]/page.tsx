
import { AdSpace } from "@/components/shared/ad-space";
import { Sidebar } from "./_components/sidebar";

import Faq from "@/components/shared/faq";
import axios from "axios";
import { Metadata } from "next";
import FeaturedItem from "../../(home)/section/components/featured-item";
import { TopSection } from "../../(home)/section/top";
import { AboutBusiness } from "./_components/aboutBusiness";
import { BusinessFacilities } from "./_components/businessFacilities";
import { CustomerFeedback } from "./_components/customerFeedback";
import { FeaturedCustomer } from "./_components/featuredCustomer";
import { FeaturedOffer } from "./_components/featuredOffer";
import { License } from "./_components/license";
import { LocationAndHours } from "./_components/location";
import { OwnerText } from "./_components/ownerText";
import { PhotoGallery } from "./_components/photoGallery";
import { Reviews } from "./_components/reviews";
import { appendApi } from "@/lib/utils";
import { FaqBusinessWrapper } from "./_components/FaqWrapper";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/business/${slug}`, { withCredentials: true });
  const data = response.data.data
  return {
    title: data.name + ' | KAGOZ',
    description: data.about,
    openGraph: {
      title: data.name + ' | KAGOZ',
      description: data.about,
      images: appendApi(data.logoUrl),
    },
    twitter: {
      card: 'summary_large_image',
      title: data.name + ' | KAGOZ',
      description: data.about,
      images: [data.logoUrl],
    },
  };
}
export default function SingleBusiness() {
  return (
    <>
      <div>
        <div className="bg-single-business h-[28rem]"></div>
        <div className="container -mt-[6rem] grid grid-cols-6 md:gap-x-[6rem]">
          <div className="col-span-6 lg:col-span-4 bg-white px-[2.4rem] py-[3rem] rounded-smd drop-shadow-md lg:mb-[3rem]">
            <div className="space-y-[4rem]">
              {/**
             *
             * TOP SECTIONS
             */}
              <TopSection />
              <hr className="border-[#EEEDED]" />
              <FeaturedCustomer />
              <hr className="border-[#EEEDED]" />
              <CustomerFeedback />
              <hr className="border-[#EEEDED]" />
              <FeaturedOffer />
              <hr className="border-[#EEEDED]" />
              <BusinessFacilities />
              <hr className="border-[#EEEDED]" />
              <AboutBusiness />
              <hr className="border-[#EEEDED]" />
              <License />
              <hr className="border-[#EEEDED]" />
              <PhotoGallery />
              <hr className="border-[#EEEDED]" />
              <LocationAndHours />
              <hr className="border-[#EEEDED]" />
              <OwnerText />
              <hr className="border-[#EEEDED]" />
              <FaqBusinessWrapper />
              <hr className="border-[#EEEDED]" />
              <Reviews />
            </div>
          </div>
          <div className="col-span-6 lg:col-span-2 ">
            <Sidebar />
            <div className="mt-[4rem] space-y-[4rem]">
              <AdSpace />
              <AdSpace />
            </div>
          </div>
        </div>
        <div className="space-y-[1.6rem] container mb-[6rem]">
          <h2 className="text-mdx font-bold text-black">Related Business</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3rem]">
            {Array.from({ length: 2 }).map((_, index) => {
              return <FeaturedItem key={index} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
}
