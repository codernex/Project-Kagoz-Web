"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import BusinessInfoStep from "./BusinessInfoStep"
import LocationContactStep from "./LocationContactStep"
import BusinessHoursStep from "./BusinessHoursStep"
import MediaBrandingStep from "./MediaBrandingStep"
import { useForm } from "react-hook-form"

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

interface BusinessInfoData {
  businessName: string
  tagline: string
  about: string
  startYear: string
  startMonth: string
  startDay: string
  category: string
}

interface LocationContactData {
  streetAddress: string
  houseRoad: string
  localArea: string
  city: string
  postalCode: string
  country: string
  mobile: string
  website: string
  facebook: string
}

interface TimeSlot {
  start: string
  end: string
}

interface DaySchedule {
  isOpen: boolean
  slots: TimeSlot[]
}

interface BusinessHoursData {
  is24Hours: boolean
  closedOnHolidays: boolean
  businessHours: Record<string, DaySchedule>
}

interface UploadedFile {
  id: string
  file: File
  preview: string
  name: string
  size: string
}

interface MediaBrandingData {
  logo: UploadedFile | null
  banner: UploadedFile | null
  gallery: UploadedFile[]
  tradeLicense: UploadedFile | null
  tradeLicenseExpireDate: string
}

interface FormData {
  businessInfo: BusinessInfoData
  locationContact: LocationContactData
  businessHours: BusinessHoursData
  mediaBranding: MediaBrandingData
}

interface BusinessFormProps {
  businessId?: string
  mode: 'add' | 'edit'
  businessData?: any
  onSuccess?: (businessId: string) => void
  onCancel?: () => void
}

export default function BusinessForm({ businessId, mode, businessData, onSuccess, onCancel }: BusinessFormProps) {
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(mode === 'edit')
  const rhfForm = useForm({
    defaultValues: {
      name: "",
      tagline: "",
      about: "",
      startingDate: "",
      category: "",
      streetAddress: "",
      houseRoad: "",
      localArea: "",
      city: "",
      postalCode: "",
      country: "",
      mobile: "",
      website: "",
      facebook: "",
      tradeLicenseUrl: "",
      tradeLicenseExpireDate: ""
    },
  })

  const [formData, setFormData] = useState<FormData>({
    businessInfo: {
      businessName: "",
      tagline: "",
      about: "",
      startYear: "",
      startMonth: "",
      startDay: "",
      category: ""
    },
    locationContact: {
      streetAddress: "",
      houseRoad: "",
      localArea: "",
      city: "",
      postalCode: "",
      country: "",
      mobile: "",
      website: "",
      facebook: ""
    },
    businessHours: {
      is24Hours: false,
      closedOnHolidays: true,
      businessHours: days.reduce(
        (acc, day) => {
          acc[day] = {
            isOpen: day !== "Friday",
            slots: [{ start: "9:00 AM", end: "6:00 PM" }],
          }
          return acc
        },
        {} as Record<string, DaySchedule>,
      ),
    },
     mediaBranding: {
       logo: null,
       banner: null,
       gallery: [],
       tradeLicense: null,
       tradeLicenseExpireDate: ""
     }
  })

  const tabs = [
    "Business Information",
    "Location & Contact",
    "Business Hours & Availability",
    "Media & Business Branding",
  ]

  // Use the passed business data directly since we're fetching it in the parent component
  const fetchedBusiness = businessData
  const isFetching = false // No need to fetch here since parent component handles it

  useEffect(() => {
    const loading = mode === 'edit' && !!businessId && isFetching
    setIsLoading(loading)
  }, [isFetching, businessId, mode])

  useEffect(() => {
    if (fetchedBusiness) {
      const b = fetchedBusiness as any
      
      // Parse starting date if available
      let startYear = "", startMonth = "", startDay = ""
      if (b?.startingDate) {
        const dateParts = b.startingDate.split('-')
        if (dateParts.length === 3) {
          startYear = dateParts[0]
          startMonth = dateParts[1]
          startDay = dateParts[2]
        }
      }
      
      const transformed: FormData = {
        businessInfo: {
          businessName: b?.name || "",
          tagline: b?.tagline || "",
          about: b?.about || "",
          startYear: startYear,
          startMonth: startMonth,
          startDay: startDay,
          category: b?.primaryCategory || b?.category || "",
        },
        locationContact: {
          streetAddress: b?.streetAddress || "",
          houseRoad: b?.house || "",
          localArea: b?.localArea || "",
          city: b?.city || "",
          postalCode: b?.postalCode || "",
          country: b?.country || "",
          mobile: b?.mobile || "",
          website: b?.website || "",
          facebook: b?.facebook || "",
        },
        businessHours: {
          is24Hours: false, // Default values, will be updated from API if available
          closedOnHolidays: true,
          businessHours: days.reduce(
            (acc, day) => {
              acc[day] = {
                isOpen: day !== "Friday",
                slots: [{ start: "9:00 AM", end: "6:00 PM" }],
              }
              return acc
            },
            {} as Record<string, DaySchedule>,
          ),
        },
         mediaBranding: {
           logo: b?.logoUrl ? { 
             id: 'existing-logo',
             file: null as any, 
             preview: b.logoUrl,
             name: b.logoUrl.split('/').pop() || 'logo.png',
             size: '0 KB'
           } : null,
           banner: b?.bannerUrl ? { 
             id: 'existing-banner',
             file: null as any, 
             preview: b.bannerUrl,
             name: b.bannerUrl.split('/').pop() || 'banner.png',
             size: '0 KB'
           } : null,
           gallery: [],
           tradeLicense: b?.tradeLicenseUrl ? {
             id: 'existing-trade-license',
             file: null as any,
             preview: b.tradeLicenseUrl,
             name: b.tradeLicenseUrl.split('/').pop() || 'trade-license.pdf',
             size: '0 KB'
           } : null,
           tradeLicenseExpireDate: b?.tradeLicenseExpireDate || ""
         },
      }
      
      setFormData(transformed)
      
      // Reset react-hook-form with the fetched data
      const resetValues = {
        name: transformed.businessInfo.businessName,
        tagline: transformed.businessInfo.tagline,
        about: transformed.businessInfo.about,
        startingDate: startYear && startMonth && startDay 
          ? `${startYear}-${startMonth}-${startDay}` 
          : b?.startingDate || "",
        category: transformed.businessInfo.category,
        streetAddress: transformed.locationContact.streetAddress,
        houseRoad: transformed.locationContact.houseRoad,
        localArea: transformed.locationContact.localArea,
        city: transformed.locationContact.city,
        postalCode: transformed.locationContact.postalCode,
        country: transformed.locationContact.country,
        mobile: transformed.locationContact.mobile,
        website: transformed.locationContact.website,
        facebook: transformed.locationContact.facebook,
        tradeLicenseUrl: b?.tradeLicenseUrl || "",
        tradeLicenseExpireDate: b?.tradeLicenseExpireDate || "",
      }
      
      console.log("🔍 BusinessForm - Resetting form with values:", resetValues)
      rhfForm.reset(resetValues)
      
      // Debug: Check form values after reset
      setTimeout(() => {
        console.log("🔍 BusinessForm - Form values after reset:", rhfForm.getValues())
      }, 100)
      
      console.log("📋 BusinessForm - Processing API Data:", {
        original: b,
        transformed: transformed,
        formValues: rhfForm.getValues()
      })
      
      // Debug: Log each field to ensure proper mapping
      console.log("🔍 Field Mappings from API to Form:", {
        name: b?.name,
        tagline: b?.tagline,
        about: b?.about,
        category: b?.primaryCategory || b?.category,
        streetAddress: b?.streetAddress,
        house: b?.house,
        localArea: b?.localArea,
        city: b?.city,
        postalCode: b?.postalCode,
        country: b?.country,
        mobile: b?.mobile,
        website: b?.website,
        facebook: b?.facebook
      })
      
      console.log("✅ Form Fields Populated Successfully!")
    }
  }, [fetchedBusiness, rhfForm])

  const updateBusinessInfo = (data: BusinessInfoData) => {
    setFormData(prev => ({ ...prev, businessInfo: data }))
  }

  const updateLocationContact = (data: LocationContactData) => {
    setFormData(prev => ({ ...prev, locationContact: data }))
  }

  const updateBusinessHours = (data: BusinessHoursData) => {
    setFormData(prev => ({ ...prev, businessHours: data }))
  }

  const updateMediaBranding = (data: MediaBrandingData) => {
    setFormData(prev => ({ ...prev, mediaBranding: data }))
  }

  // Debug: Watch form changes
  useEffect(() => {
    const subscription = rhfForm.watch((values) => {
      console.log("Form values changed:", values)
    })
    return () => subscription.unsubscribe()
  }, [rhfForm])

  const handleNext = () => {
    if (currentTab < tabs.length - 1) {
      setCurrentTab(currentTab + 1)
    }
  }

  const handleBack = () => {
    if (currentTab > 0) {
      setCurrentTab(currentTab - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const submitData = new FormData()
      
      submitData.append('businessInfo', JSON.stringify(formData.businessInfo))
      submitData.append('locationContact', JSON.stringify(formData.locationContact))
      submitData.append('businessHours', JSON.stringify(formData.businessHours))
      
      // if (formData.mediaBranding.logo?.file.size > 0) {
      //   submitData.append('logo', formData.mediaBranding.logo.file)
      // }
      // if (formData.mediaBranding.banner?.file.size > 0) {
      //   submitData.append('banner', formData.mediaBranding.banner.file)
      // }
      // formData.mediaBranding.gallery.forEach((file, index) => {
      //   if (file.file.size > 0) {
      //     submitData.append(`gallery_${index}`, file.file)
      //   }
      // })

      const url = mode === 'edit' ? `/api/businesses/${businessId}` : '/api/businesses'
      const method = mode === 'edit' ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        body: submitData,
      })

      if (!response.ok) {
        throw new Error(`Failed to ${mode} business`)
      }

      const result = await response.json()
      
      if (onSuccess) {
        onSuccess(result.id || businessId || '')
      } else {
        router.push('/business-dashboard')
      }
      
    } catch (error) {
      console.error(`Error ${mode}ing business:`, error)
      alert(`Failed to ${mode} business. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderCurrentStep = () => {
    switch (currentTab) {
      case 0:
        return (
          <BusinessInfoStep
            form={rhfForm}
            data={formData.businessInfo}
            onUpdate={updateBusinessInfo}
            onNext={handleNext}
          />
        )
      case 1:
        return (
          <LocationContactStep
            data={formData.locationContact}
            onUpdate={updateLocationContact}
            onNext={handleNext}
            onBack={handleBack}
            onSaveAndBack={handleBack}
            form={rhfForm}
          />
        )
      case 2:
        return (
          <BusinessHoursStep
            data={formData.businessHours}
            businessData={fetchedBusiness}
            onUpdate={updateBusinessHours}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 3:
        return (
          <MediaBrandingStep
            data={formData.mediaBranding}
            onUpdate={updateMediaBranding}
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        )
      default:
        return null
    }
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

  return (
    <main className="min-h-screen mt-4">
      <div className="w-full mx-auto">
        {/* Page header */}
        <div className="bg-white py-8 pl-9 pr-6">
          <div>
            <h1 className="learge-headeing mb-[26px]">
              {mode === 'edit' ? 'Edit Business' : 'Add New Business'}
            </h1>
          </div>

          {/* Tab Navigation */}
          <div className="bg-[#F4F4F5] rounded-[8px] shadow-sm border">
            <div className="flex md:flex-row flex-col p-1">
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  className={`flex-1 min-w-0 px-4 py-2 cursor-pointer common-text transition-colors ${
                    currentTab === index
                      ? "bg-[#6F00FF] text-white rounded-[8px]"
                      : "text-[#717684] hover:text-gray-900 bg-[#F4F4F5]"
                  } ${index === 0 ? "rounded-[8px]" : ""} ${index === tabs.length - 1 ? "rounded-[8px]" : ""}`}
                  onClick={() => setCurrentTab(index)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderCurrentStep()}
        </div>

        {/* Loading overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#6F00FF]"></div>
              <p className="text-gray-700">
                {mode === 'edit' ? 'Updating your business...' : 'Creating your business...'}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
