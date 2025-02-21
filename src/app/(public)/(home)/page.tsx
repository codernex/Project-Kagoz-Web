import { Metadata } from "next";
import HomePage from "./client";
import { axiosInstance } from "@/redux/api";
import { appendApi } from "@/lib/utils";
import { PageType } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const response = await axiosInstance.get(`/seo/${PageType.HOME}`)

    const data = response.data.data as ISeo
    return {
      title: data.title ? `${data.title} | KAGOZ` : "Business Directory in Bangladesh (Free Listing Site) - Kagoz",
      alternates: {
        canonical: data.canonical || process.env.NEXT_PUBLIC_BASE_URL
      },
      openGraph: {
        images: [appendApi(data.seo_image)],
        type: "website",
        locale: "en-US",
        countryName: "Bangladesh",
        title: `${data.title} | KAGOZ`,
        description: data.description || "KAGOZ is a free business directory site in Bangladesh. Find reliable information and listings for various businesses and services across the country."
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
      title: "Home | KAGOZ",
      alternates: {
        canonical: process.env.NEXT_PUBLIC_BASE_URL
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

export default function Page() {
  return (
    <HomePage />
  )
}