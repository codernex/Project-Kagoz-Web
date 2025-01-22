import { appendApi } from "@/lib/utils";
import { axiosInstance } from "@/redux/api";
import { PageType } from "@/types";
import { Metadata } from "next";
import { Hero } from "./section/hero";
import { WhatWeDo } from "./section/what-we-do";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const response = await axiosInstance.get(`/seo/${PageType.ABOUT}`)

    const data = response.data.data as ISeo
    return {
      title: `${data.title} | KAGOZ`, alternates: {
        canonical: data.canonical || process.env.NEXT_PUBLIC_BASE_URL + '/about-us'
      },
      openGraph: {
        images: [appendApi(data.seo_image)],
        type: "website",
        locale: "en-US",
        countryName: "Bangladesh",
        title: `${data.title} | KAGOZ`,
        description: data.description
      },
      description: data.description,
      keywords: data.keyword,
      robots: {
        index: data.index,
        follow: data.follow
      }
    }
  } catch (error) {
    return {
      title: "About Us | KAGOZ",
      alternates: {
        canonical: process.env.NEXT_PUBLIC_BASE_URL + '/about-us'
      },
      openGraph: {
        images: ["/images/logo.png"],
        countryName: "Bangladesh"
      },
      twitter: {
        card: "summary",
        images: ["/images/logo.png"],
      },
      robots: {
        index: true,
        follow: true
      }
    }
  }
}
export default function AboutUs() {
  return (
    <main>
      <Hero />
      <WhatWeDo />
      <section className="bg-[#6F00FF05] ">
        <div className="container grid grid-cols-1 md:grid-cols-2 section_padding">
          <div className="flex flex-col justify-center gap-y-[2rem]">
            <h2 className="section_title text-left">
              Why us
            </h2>
            <p className="text-muted">
              Our achievement story is a very testament to teamworks and perseverance.
              Together, we have overcome challenges, celebrated victories, and created a
              narrative of progress and  story is a very testament to  success.
            </p>
            <p className="text-muted">
              Our achievement story is a very testament to teamworks and perseverance.
              Together, we have overcome challenges, celebrated victories, and created a
              narrative of progress
            </p>
            <div className="flex justify-start">
              <Button asChild className="h-16 max-w-[20rem]">
                <Link href={'/categories'}>
                  Find Your Business
                </Link>
              </Button>
            </div>
          </div>
          <div className="about-bottom-bg h-[560px] object-contain"></div>
        </div>
      </section>
    </main>
  );
}
