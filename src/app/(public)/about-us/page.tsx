import { appendApi } from "@/lib/utils";
import { axiosInstance } from "@/redux/api";
import { PageType } from "@/types";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const response = await axiosInstance.get(`/seo/${PageType.ABOUT}`)

    const data = response.data.data as ISeo
    return {
      title: `${data.title} | KAGOZ`, alternates: {
        canonical: data.canonical
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
        index: data.index === 'index',
        follow: data.follow === 'follow'
      }
    }
  } catch (error) {
    return {
      title: "About Us | KAGOZ",
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
    <main className="container">
      <h1>About Us Page</h1>
    </main>
  );
}
