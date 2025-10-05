
import { Loader } from "@/components/shared/loader";
import { NotFound } from "@/components/shared/not-found";
import { appendApi } from "@/lib/utils";
import { axiosInstance } from "@/redux/api";
import axios from "axios";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { cookies } from 'next/headers';
import { AboutBusiness } from "./_components/aboutBusiness";
import { BusinessFacilities } from "./_components/businessFacilities";
import { CustomerFeedback } from "./_components/customerFeedback";
import { FaqBusinessWrapper } from "./_components/FaqWrapper";
import { FeaturedCustomer } from "./_components/featuredCustomer";
import { FeaturedOffer } from "./_components/featuredOffer";
import { OwnerText } from "./_components/ownerText";
import RelatedItemWrapper from "./_components/related-item-wrapper";
import { YtPlayerModal } from "./_components/yt-player-modal";
const AdSpace = dynamic(() => import('@/components/shared/ad-space').then(m => m.AdSpace))
const License = dynamic(() => import('./_components/license'))
const Sidebar = dynamic(() => import('./_components/sidebar'))
const TopSection = dynamic(() => import('@/app/(public)/(home)/section/top'))
const PhotoGallery = dynamic(() => import('./_components/photoGallery'))
const LocationAndHours = dynamic(() => import('./_components/location'))
const Reviews = dynamic(() => import('./_components/reviews'))

export async function generateMetadata({ params }: any): Promise<Metadata> {
  try {
    const cookieStore = await cookies()
    let cookie = cookieStore.get('access_token')

    const { slug } = await params
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/business/${slug}`, {
      withCredentials: true, headers: {
        Authorization: `Bearer ${cookie?.value}`
      }
    });

    const data = response.data.data as IBusiness

    const categories = [data?.primaryCategory?.name, ...data?.subcategories?.map(s => s.name)]

    return {
      title: data.name,
      description: data.about,
      alternates: {
        canonical: (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000') + `/business/${slug}`
      },
      openGraph: {
        title: data.name,
        description: data.about,
        images: appendApi(data.logoUrl),
        type: "website",
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/business/${data.slug}`
      },
      twitter: {
        card: 'summary_large_image',
        title: data.name + ' - KAGOZ',
        description: data.about,
        images: appendApi(data.logoUrl),
      },
      keywords: categories.join(','),
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
      }
    };
  } catch (error) {
    return {}
  }
}
export default async function SingleBusiness({ params }: any) {
  const { slug } = await params
  const cookieStore = await cookies()
  let cookie = cookieStore.get('access_token')
  let data: IBusiness | null = null;
  let isLoading: boolean = true;
  let err;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/business/${slug}`, {
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${cookie?.value}`
    }
  })

  if (response.ok) {
    const result = await response.json() as { data: IBusiness }
    isLoading = false
    data = result.data
  } else if (response.status !== 200) {
    err = "Something went wrong"
    isLoading = false
  }

  if (isLoading) {
    return <Loader />
  }
  if (err || !data) {
    return <NotFound />
  }
  return (
    <>
      <div>
        <div className="bg-single-business h-[28rem]"></div>
        <div className="container -mt-[6rem] grid grid-cols-6 md:gap-x-[6rem]">
          <div className="col-span-6 lg:col-span-4 bg-white px-[2.4rem] py-[3rem] rounded-smd drop-shadow-md lg:mb-[3rem]">
            <div className="space-y-[4rem]">
              {
                /**
                 *
                 * TOP SECTIONS
                 */
              }
              <TopSection />
              <div className="lg:hidden">
                <Sidebar />
              </div>
              <FeaturedCustomer />
              <CustomerFeedback />
              <FeaturedOffer />

              <BusinessFacilities />
              <AboutBusiness />
              <License />
              <PhotoGallery />
              <LocationAndHours />
              <OwnerText />
              <FaqBusinessWrapper />
              <Reviews />
              <YtPlayerModal />
            </div>
          </div>
          {
            isLoading ? <Loader /> : <div className="col-span-6 lg:col-span-2 hidden lg:block">
              <Sidebar />
              {/* <div className="mt-[4rem] space-y-[4rem]">
                <AdSpace />
                <AdSpace />
              </div> */}
            </div>
          }
        </div>
        <RelatedItemWrapper />

      </div>
    </>
  )
}
