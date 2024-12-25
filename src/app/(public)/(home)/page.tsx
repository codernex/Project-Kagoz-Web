import { Metadata } from "next";
import HomePage from "./client";

export async function generateMetadata(): Promise<Metadata> {
  try {
    return {
      title: "Home | KAGOZ",
      openGraph: {
        images: ["/images/logo.png"],
        type: "website",
        locale: "en-US",
        countryName: "Bangladesh",
        title: "Home | KAGOZ"
      }
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