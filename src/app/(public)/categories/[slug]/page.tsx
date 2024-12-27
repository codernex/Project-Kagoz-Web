import { Metadata } from "next";
import CategoriesSearchPage from "./client";
import { axiosInstance } from "@/redux/api";
import { NotFound } from "@/components/shared/not-found";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = await params;
  try {
    const response = await axiosInstance.get<{ data: ICategory }>(`/categories/${slug}`);
    const data = response.data.data;
    return {
      title: `${data.name} | KAGOZ`,
      description: data.about,
      openGraph: {
        type: 'website',
        title: `${data.name} | KAGOZ`,
        description: data.about
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
  let data: ICategory | null;
  try {
    const response = await axiosInstance.get<{ data: ICategory }>(`/categories/${slug}`);
    data = response.data.data;
  } catch (error) {
    return <NotFound />
  }
  return (
    <CategoriesSearchPage slug={slug} category={data!} />
  )
}