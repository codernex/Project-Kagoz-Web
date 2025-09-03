"use client"

import { useParams } from "next/navigation"
import BusinessForm from "./_components/BusinessForm"

export default function EditBusiness() {
  const params = useParams()
  const businessId = params.slug as string

  return (
    <BusinessForm
      businessId={businessId}
      mode="edit"
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
