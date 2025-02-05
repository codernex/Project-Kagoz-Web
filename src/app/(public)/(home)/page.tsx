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
      title: `${data.title} | KAGOZ`,
      alternates: {
        canonical: data.canonical || process.env.NEXT_PUBLIC_BASE_URL
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
        follow: true
      }
    }
  }
}

export default function Page() {
  return (
    <HomePage />
  )
}