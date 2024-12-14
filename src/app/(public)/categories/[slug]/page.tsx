import { Metadata } from "next";
import CategoriesSearchPage from "./client";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `KAGOZ | ${slug}`
  }

}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params
  return (
    <CategoriesSearchPage slug={slug} />
  )
}