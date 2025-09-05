"use client"

import { useParams } from "next/navigation"
import BusinessForm from "./_components/BusinessForm"
import { useGetBusinessBySlugQuery } from "@/redux/api/business"

export default function EditBusiness() {
  const params = useParams()
  const slug = params.slug as string
  
  const { data } = useGetBusinessBySlugQuery(slug, { skip: !slug })

  return (
    <BusinessForm
      businessId={slug}
      mode="edit"
      businessData={data}
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
