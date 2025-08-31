"use client"

import BusinessForm from "@/components/business/BusinessForm"

export default function AddBusiness() {
  return (
    <BusinessForm 
      mode="add"
      onSuccess={(businessId) => {
        console.log('Business created successfully:', businessId)
        // You can add additional success handling here
      }}
      onCancel={() => {
        // Handle cancel action
        console.log('Add business cancelled')
      }}
    />
  )
}
