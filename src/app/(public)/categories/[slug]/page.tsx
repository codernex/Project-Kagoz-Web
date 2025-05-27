import { NotFound } from "@/components/shared/not-found";
import { axiosInstance } from "@/redux/api";
import { Metadata } from "next";
import CategoriesSearchPage from "./client";

export async function generateMetadata({ params, searchParams }: any): Promise<Metadata> {
  const { slug } = await params;
  const location = slug.split('-in-')[1];
  try {
    const response = await axiosInstance.get<{ data: ICategory }>(
      `/categories/info/${slug.replace(`-in-${location}`, "")}`,
    );
    const data = response.data.data;
    return {
      title: location ? `Top 10 Best ${data.name} in ${location} - KAGOZ` : `Top 10 Best ${data.name} - KAGOZ`,
      description: data.about,
      alternates: {
        canonical: `/categories/${slug}`,
      },
      openGraph: {
        type: "website",
        title: location ? `Top 10 Best ${data.name} in ${location} - KAGOZ` : `Top 10 Best ${data.name} - KAGOZ`,
        description: data.about,
      },
      keywords: ["kagoz"],
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
      },
    };
  } catch (error) {
    return {
      title: "Category not found",
      description: "Category not found",
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
      },
    };
  }
}

export default async function Page({ params, searchParams }: any) {
  const { slug } = await params;
  const location = slug.split('-in-')[1];
  let data: ICategory | null;
  try {
    const response = await axiosInstance.get<{ data: ICategory }>(
      `/categories/info/${slug?.replace(`-in-${location}`, "")}`,
    );
    data = response.data.data;
  } catch (error) {
    return <NotFound />;
  }
  return <CategoriesSearchPage slug={slug} category={data!} searchLocation={location} />;
}
