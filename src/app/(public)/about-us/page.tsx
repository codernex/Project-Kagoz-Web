import { appendApi } from "@/lib/utils";
import { axiosInstance } from "@/redux/api";
import { PageType } from "@/types";
import { Metadata } from "next";
import { Hero } from "./section/hero";
import { WhatWeDo } from "./section/what-we-do";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Head from "next/head";

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
        follow: data.follow,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
        googleBot: {
          index: data.index,
          follow: data.follow,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
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
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      }
    }
  }
}
export default function AboutUs() {
  return (
    <main>
      <div className="min-h-screen max-w-7xl mx-auto py-10 px-6 ">
        <Head>
          <title>About Us - KAGOZ</title>
        </Head>
        <div className=" bg-white p-10 shadow-lg rounded-lg">
          <h1 className="text-lg font-bold text-gray-800 mb-6">About Us</h1>

          <p className="text-gray-700 mb-6 leading-relaxed">
            Welcome to <strong>KAGOZ</strong> – Bangladesh’s premier free business directory that is dedicated to bridging the gap between local enterprises and the communities they serve. At KAGOZ, we believe that every business, regardless of its size, deserves an opportunity to thrive in today’s competitive market.
          </p>

          <section>
            <h2 className="text-mdx font-semibold text-gray-800 mb-2">Our Story and Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              Founded with the vision of fostering meaningful connections between businesses and their customers, KAGOZ has grown to become a trusted resource in Bangladesh. Our journey began with a simple idea: to provide a platform where every business, from local shops to established corporations, can be discovered with ease. We are proud to be a sister concern of <strong>Khan IT</strong>, reinforcing our commitment to quality, technology, and innovation.
            </p>
          </section>

          <section>
            <h2 className="text-mdx font-semibold text-gray-800 mb-2">What We Offer</h2>
            <p className="text-gray-700 leading-relaxed">
              KAGOZ stands out by offering both free and premium listing options to cater to the diverse needs of businesses. Whether you are a startup or an established enterprise, our platform provides a comprehensive solution to showcase your services and reach potential customers.
            </p>
            <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
              <li><strong>Free & Easy Listings:</strong> A simple, straightforward process to get businesses listed at no cost.</li>
              <li><strong>Verified and Trusted Information:</strong> Each business listing undergoes verification to ensure accuracy and reliability.</li>
              <li><strong>User-Friendly Search Experience:</strong> Advanced search features allow users to find businesses by category, name, or location.</li>
              <li><strong>Support for Local Enterprises:</strong> We help businesses grow by increasing their online visibility.</li>
              <li><strong>Innovative Premium Features:</strong> Priority placement in search results, additional marketing tools, and analytics insights.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-mdx font-semibold text-gray-800 mb-2">Our Vision for the Future</h2>
            <p className="text-gray-700 leading-relaxed">
              At KAGOZ, we are driven by a vision to be the most trusted and effective business directory in Bangladesh. By integrating the latest technological advancements, we strive to provide unparalleled value to both businesses and consumers.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We are constantly working to improve our platform, incorporating user feedback and embracing innovative solutions that enhance the overall experience. Our dedication to excellence has positioned us as the first and most extensive listing site in Bangladesh.
            </p>
          </section>

          <section>
            <h2 className="text-mdx font-semibold text-gray-800 mb-2">Join Our Community</h2>
            <p className="text-gray-700 leading-relaxed">
              We invite you to become a part of the KAGOZ community. Whether you are a business looking to expand your reach or a consumer seeking reliable local services, our platform is here to serve your needs.
            </p>
            <p className="text-gray-700 leading-relaxed">
              KAGOZ is more than just a listing service—it is a commitment to building a connected, thriving business community across Bangladesh. Join us today and unlock new opportunities for growth.
            </p>
          </section>
        </div>
      </div>
      {/* <Hero />
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
      </section> */}
    </main>
  );
}
