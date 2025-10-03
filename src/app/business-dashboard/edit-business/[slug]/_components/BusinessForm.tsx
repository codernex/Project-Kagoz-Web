"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import BusinessInfoStep from "./BusinessInfoStep"
import LocationContactStep from "./LocationContactStep"
import BusinessHoursStep from "./BusinessHoursStep"
import MediaBrandingStep from "./MediaBrandingStep"

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
]

interface BusinessFormProps {
  businessId: string
  mode: string
  businessData: IBusiness | null
  onSuccess: (businessId: string) => void
  onCancel: () => void
}

export default function BusinessForm({ businessId, mode, businessData, onSuccess, onCancel }: BusinessFormProps) {
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const rhfForm = useForm({
    defaultValues: {
      name: "",
      tagLine: "",
      about: "",
      startingDate: { year: "", month: "", day: "" },
      category: "",
      streetAddress: "",
      house: "",
      localArea: "",
      city: "",
      postalCode: "",
      country: "",
      mobile: "",
      website: "",
      facebook: "",
      tradeLicenseUrl: "",
      tradeLicenseExpireDate: ""
    }
  })

  const defaultBusinessHours = days.reduce((acc: Record<string, any>, day) => {
    acc[day] = { isOpen: day !== "Friday", slots: [{ start: "9:00 AM", end: "6:00 PM" }] }
    return acc
  }, {})

  interface FormData {
    businessInfo: any
    locationContact: any
    businessHours: any
    mediaBranding: any
  }

  const [formData, setFormData] = useState<FormData | null>(null)

  const tabs = [
    "Business Information",
    "Location & Contact",
    "Business Hours & Availability",
    "Media & Business Branding"
  ]

  // Load existing business data for editing
  useEffect(() => {
    if (!businessData) return

    const b = businessData
    let [startYear, startMonth, startDay] = ["", "", ""]
    if (b?.startingDate) {
      const [y, m, d] = b.startingDate.split("-")
      startYear = y || ""
      startMonth = monthNames[parseInt(m || "1") - 1] || ""
      startDay = String(parseInt(d || "1"))
    }

    const transformed = {
      businessInfo: {
        businessName: b?.name || "",
        tagLine: b?.tagLine || "",
        about: b?.about || "",
        startYear,
        startMonth,
        startDay,
        category: b?.primaryCategory?.slug || b?.primaryCategory?.name || ""
      },
      locationContact: {
        streetAddress: b?.streetAddress || "",
        house: b?.house || "",
        localArea: b?.localArea || "",
        city: b?.city || "",
        postalCode: b?.postalCode || "",
        country: b?.country || "",
        mobile: b?.mobile || "",
        website: b?.website || "",
        facebook: b?.facebook || ""
      },
      businessHours: {
        is24Hours: false,
        closedOnHolidays: true,
        businessHours: defaultBusinessHours
      },
      mediaBranding: {
        logo: b?.logoUrl ? { id: "logo", file: null, preview: b.logoUrl, name: "logo", size: "0 KB" } : null,
        banner: b?.bannerUrl ? { id: "banner", file: null, preview: b.bannerUrl, name: "banner", size: "0 KB" } : null,
        gallery: [],
        tradeLicense: b?.tradeLicenseUrl ? { id: "tradeLicense", file: null, preview: b.tradeLicenseUrl, name: "trade-license", size: "0 KB" } : null,
        tradeLicenseExpireDate: b?.tradeLicenseExpireDate || ""
      }
    }

    setFormData(transformed)

    rhfForm.reset({
      name: transformed.businessInfo.businessName,
      tagLine: transformed.businessInfo.tagLine,
      about: transformed.businessInfo.about,
      startingDate: { year: startYear, month: startMonth, day: startDay },
      category: transformed.businessInfo.category,
      streetAddress: transformed.locationContact.streetAddress,
      house: transformed.locationContact.house,
      localArea: transformed.locationContact.localArea,
      city: transformed.locationContact.city,
      postalCode: transformed.locationContact.postalCode,
      country: transformed.locationContact.country,
      mobile: transformed.locationContact.mobile,
      website: transformed.locationContact.website,
      facebook: transformed.locationContact.facebook,
      tradeLicenseUrl: b?.tradeLicenseUrl || "",
      tradeLicenseExpireDate: b?.tradeLicenseExpireDate ? b.tradeLicenseExpireDate.toString() : ""
    })

    setIsLoading(false)
  }, [businessData, rhfForm])

  const updateSection = (key: keyof FormData, data: any) => setFormData(prev => prev ? ({ ...prev, [key]: data }) : null)
  const handleNext = () => currentTab < tabs.length - 1 && setCurrentTab(t => t + 1)
  const handleBack = () => currentTab > 0 && setCurrentTab(t => t - 1)

  const handleSaveAndBack = () => {
    router.push('/business-dashboard')
  }

  const renderStep = () => {
    if (!formData) return null
    const props = { onNext: handleNext, onBack: handleBack, onSaveAndBack: handleSaveAndBack }
    switch (currentTab) {
      case 0: return <BusinessInfoStep form={rhfForm} data={formData.businessInfo} onUpdate={d => updateSection("businessInfo", d)} {...props} />
      case 1: return <LocationContactStep form={rhfForm} data={formData.locationContact} onUpdate={d => updateSection("locationContact", d)} {...props} />
      case 2: return <BusinessHoursStep data={formData.businessHours} businessData={businessData} onUpdate={d => updateSection("businessHours", d)} {...props} />
      case 3: return <MediaBrandingStep data={formData.mediaBranding} onUpdate={d => updateSection("mediaBranding", d)} onBack={handleBack} onSubmit={() => router.push('/business-dashboard')} />
    }
  }

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 flex items-center gap-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#6F00FF]" />
        <p className="text-gray-700">Loading business data...</p>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen mt-4">
      <div className="w-full mx-auto">
        <div className="bg-white py-8 pl-9 pr-6">
          <h1 className="learge-headeing mb-[26px]">Edit Business</h1>
          <div className="bg-[#F4F4F5] rounded-[8px] shadow-sm border">
            <div className="flex md:flex-row flex-col p-1">
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  className={`flex-1 min-w-0 px-4 py-2 cursor-pointer common-text transition-colors ${currentTab === index ? "bg-[#6F00FF] text-white rounded-[8px]" : "text-[#717684] hover:text-gray-900 bg-[#F4F4F5]"}`}
                  onClick={() => setCurrentTab(index)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">{renderStep()}</div>
      </div>
    </main>
  )
}
