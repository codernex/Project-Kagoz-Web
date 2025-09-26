"use client"

import { useParams } from "next/navigation"
import { useEffect } from "react"
import { useBusinessStore } from "@/hooks/selectedBusiness"
import BusinessForm from "./_components/BusinessForm"
import { useGetBusinessBySlugQuery } from "@/redux/api/business"

export default function EditBusiness() {
  const params = useParams()
  const raw = params.slug as string
  const paramSlug = decodeURIComponent(raw || "").trim().toLowerCase().replace(/\s+/g, "-")
  const { selectedSlug, loadSelectedSlug } = useBusinessStore()
  useEffect(() => { loadSelectedSlug() }, [loadSelectedSlug])
  // Prefer stored slug; if not yet available, try reading it directly from localStorage to avoid a wrong initial fetch
  const stored = typeof window !== 'undefined' ? (localStorage.getItem('selectedBusinessSlug') || null) : null
  const slug = (stored && stored !== 'null') ? stored : ((selectedSlug && selectedSlug !== 'null') ? selectedSlug : paramSlug)
  
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
