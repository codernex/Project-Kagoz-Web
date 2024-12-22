import { Metadata } from "next";
import CategoriesSearchPage from "./client";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `KAGOZ | ${slug}`
  }

}

export default async function Page({ params }:any) {
  const { slug } = await params
  return (
    <CategoriesSearchPage slug={slug} />
  )
}