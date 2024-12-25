import dynamic from "next/dynamic";
import { NotFound } from "@/components/shared/not-found";
import { appendApi } from "@/lib/utils";
import axios from "axios";
import { cookies } from 'next/headers';
import { AboutBusiness } from "./_components/aboutBusiness";
import { BusinessFacilities } from "./_components/businessFacilities";
import { CustomerFeedback } from "./_components/customerFeedback";
import { FaqBusinessWrapper } from "./_components/FaqWrapper";
import { FeaturedCustomer } from "./_components/featuredCustomer";
import { FeaturedOffer } from "./_components/featuredOffer";
import { OwnerText } from "./_components/ownerText";
import { axiosInstance } from "@/redux/api";
import { Loader } from "@/components/shared/loader";
import { Metadata } from "next";
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
      title: data.name + ' | KAGOZ',
      description: data.about,
      openGraph: {
        title: data.name + ' | KAGOZ',
        description: data.about,
        images: appendApi(data.logoUrl),
        type: "website",
        url:`https://localhost:3000/business/${data.slug}`
      },
      twitter: {
        card: 'summary_large_image',
        title: data.name + ' | KAGOZ',
        description: data.about,
        images: appendApi(data.logoUrl),
      },
      keywords: categories.join(',')
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
  let isLoading: boolean = false;
  let err;

  isLoading = false
  axiosInstance.get(`/business/${slug}`, {
    withCredentials: true, headers: {
      Authorization: `Bearer ${cookie?.value}`
    }
  }).then(response => {
    data = response.data.data
  }).catch(err => {
    err = err
    data = null
  }).finally(() => {
    isLoading = false
  });

  if (isLoading) {
    return <Loader />
  }

  if (err && !data) {
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
            </div>
          </div>
          {
            isLoading ? <Loader /> : <div className="col-span-6 lg:col-span-2 ">
              <Sidebar />
              <div className="mt-[4rem] space-y-[4rem]">
                <AdSpace />
                <AdSpace />
              </div>
            </div>
          }
        </div>
        <div className="space-y-[1.6rem] container mb-[6rem]">
          <h2 className="text-mdx font-bold text-black">Related Business</h2>
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3rem]">
            {Array.from({ length: 2 }).map((_, index) => {
              return <FeaturedItem key={index}  business={}/>;
            })}
          </div> */}
        </div>
      </div>
    </>
  )
}
