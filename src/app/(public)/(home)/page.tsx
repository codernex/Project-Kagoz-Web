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
      openGraph: {
        images: [appendApi(data.seo_image)],
        type: "website",
        locale: "en-US",
        countryName: "Bangladesh",
        title: `${data.title} | KAGOZ`,
        description: data.description
      },
      description: data.description,
      keywords: data.keyword
    }
  } catch (error) {
    return {
      title: "Home | KAGOZ",
      openGraph: {
        images: ["/images/logo.png"],
        countryName: "Bangladesh"
      },
      twitter: {
        card: "summary",
        images: ["/images/logo.png"],
      }
    }
  }
}

export default function Page() {
  return (
    <HomePage />
  )
}