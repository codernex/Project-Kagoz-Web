"use client"

import { useParams } from "next/navigation"
import BusinessForm from "./_components/BusinessForm"
import { useGetBusinessBySlugQuery } from "@/redux/api/business"

export default function EditBusiness() {
  const params = useParams()
  const slug = params.slug as string
  
  // Use the slug directly from URL params to fetch business data
  const { data, isLoading, error } = useGetBusinessBySlugQuery(slug, { skip: !slug })
  
  
  // Log the specific business data when it's loaded
  if (data) {
    console.log("✅ Single Business API Response:", {
      id: data.id,
      slug: data.slug,
      name: data.name,
      primaryCategory: data.primaryCategory,
      streetAddress: data.streetAddress,
      city: data.city,
      mobile: data.mobile,
      website: data.website,
      facebook: data.facebook,
      logoUrl: data.logoUrl,
      bannerUrl: data.bannerUrl,
      startingDate: data.startingDate,
      tradeLicenseUrl: data.tradeLicenseUrl,
      tradeLicenseExpireDate: data.tradeLicenseExpireDate
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#6F00FF]"></div>
          <p className="text-gray-700">Loading business data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 text-center">
          <p className="text-red-600">Error loading business data. Please try again.</p>
        </div>
      </div>
    )
  }

  return (
    <BusinessForm
      businessId={slug}
      mode="edit"
      businessData={data || null}
      onSuccess={(businessId) => {
        console.log('Business updated successfully:', businessId)
      }}
      onCancel={() => {
        // Handle cancel action
        console.log('Edit business cancelled')
      }}
    />
  )
}
