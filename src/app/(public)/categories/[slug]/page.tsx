import { NotFound } from "@/components/shared/not-found";
import { axiosInstance } from "@/redux/api";
import { Metadata } from "next";
import CategoriesSearchPage from "./client";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = await params;
  try {
    const response = await axiosInstance.get<{ data: ICategory }>(`/categories/info/${slug}`);
    const data = response.data.data;
    return {
      title: `${data.name} | KAGOZ`,
      description: data.about,
      alternates: {
        canonical: `/categories/${slug}`,
      },
      openGraph: {
        type: 'website',
        title: `${data.name} | KAGOZ`,
        description: data.about
      },
      keywords: ['kagoz'],
      robots: {
        index: true,
        follow: true
      }
    };
  } catch (error) {
    return {
      title: "Category not found",
      robots: {
        index: true,
        follow: true
      }
    };
  }
}

export default async function Page({ params }: any) {
  const { slug } = await params
  let data: ICategory | null;
  try {
    const response = await axiosInstance.get<{ data: ICategory }>(`/categories/info/${slug}`);
    data = response.data.data;
  } catch (error) {
    return <NotFound />
  }
  return (
    <CategoriesSearchPage slug={slug} category={data!} />
  )
}