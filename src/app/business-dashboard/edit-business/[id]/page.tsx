"use client"

import { useParams } from "next/navigation"
import BusinessForm from "@/components/business/BusinessForm"

export default function EditBusiness() {
  const params = useParams()
  const businessId = params.id as string

  return (
    <BusinessForm 
      businessId={businessId}
      mode="edit"
      onSuccess={(businessId) => {
        console.log('Business updated successfully:', businessId)
        // You can add additional success handling here
        // For example, show a success toast or redirect
      }}
      onCancel={() => {
        // Handle cancel action
        console.log('Edit business cancelled')
      }}
    />
  )
}
