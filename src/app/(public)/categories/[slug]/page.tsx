import { Metadata } from "next";
import CategoriesSearchPage from "./client";
import { axiosInstance } from "@/redux/api";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = await params;
  try {
    const response = await axiosInstance.get<{ data: ICategory }>(`/categories/${slug}`);
    const data = response.data.data;
    return {
      title: `${data.name} | KAGOZ`,
      openGraph: {
        type: 'website',
        title: `${data.name} | KAGOZ`
      },
      keywords: ['kagoz']
    };
  } catch (error) {
    return {
      title: "Category not found",
    };
  }
}

export default async function Page({ params }: any) {
  const { slug } = await params
  return (
    <CategoriesSearchPage slug={slug} />
  )
}