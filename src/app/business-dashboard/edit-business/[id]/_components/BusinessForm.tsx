"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import BusinessInfoStep from "./BusinessInfoStep"
import LocationContactStep from "./LocationContactStep"
import BusinessHoursStep from "./BusinessHoursStep"
import MediaBrandingStep from "./MediaBrandingStep"

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
  onSuccess?: (businessId: string) => void
  onCancel?: () => void
}

export default function BusinessForm({ businessId, mode, onSuccess, onCancel }: BusinessFormProps) {
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(mode === 'edit')
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
      gallery: []
    }
  })

  const tabs = [
    "Business Information",
    "Location & Contact",
    "Business Hours & Availability",
    "Media & Business Branding",
  ]

  // Fetch business data if editing
  useEffect(() => {
    if (mode === 'edit' && businessId) {
      fetchBusinessData()
    }
  }, [businessId, mode])

  const fetchBusinessData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch business data from API
      // const response = await fetch(`/api/businesses/${businessId}`)
      
      // if (!response.ok) {
      //   throw new Error('Failed to fetch business data')
      // }

      // const businessData = await response.json()
      
      // Transform API data to form data format
      // const transformedData: FormData = {
      //   businessInfo: {
      //     businessName: businessData.businessName || "",
      //     tagline: businessData.tagline || "",
      //     about: businessData.about || "",
      //     startYear: businessData.startYear || "",
      //     startMonth: businessData.startMonth || "",
      //     startDay: businessData.startDay || "",
      //     category: businessData.category || ""
      //   },
      //   locationContact: {
      //     streetAddress: businessData.streetAddress || "",
      //     houseRoad: businessData.houseRoad || "",
      //     localArea: businessData.localArea || "",
      //     city: businessData.city || "",
      //     postalCode: businessData.postalCode || "",
      //     country: businessData.country || "",
      //     mobile: businessData.mobile || "",
      //     website: businessData.website || "",
      //     facebook: businessData.facebook || ""
      //   },
      //   businessHours: {
      //     is24Hours: businessData.is24Hours || false,
      //     closedOnHolidays: businessData.closedOnHolidays || true,
      //     businessHours: businessData.businessHours || days.reduce(
      //       (acc: any, day: string) => {
      //         acc[day] = {
      //           isOpen: day !== "Friday",
      //           slots: [{ start: "9:00 AM", end: "6:00 PM" }],
      //         }
      //         return acc
      //       },
      //       {} as Record<string, DaySchedule>,
      //     ),
      //   },
      //   mediaBranding: {
      //     logo: businessData.logo ? {
      //       id: 'logo',
      //       file: new File([], 'logo.png'),
      //       preview: businessData.logo,
      //       name: 'logo.png',
      //       size: '0 KB'
      //     } : null,
      //     banner: businessData.banner ? {
      //       id: 'banner',
      //       file: new File([], 'banner.png'),
      //       preview: businessData.banner,
      //       name: 'banner.png',
      //       size: '0 KB'
      //     } : null,
      //     gallery: businessData.gallery ? businessData.gallery.map((url: string, index: number) => ({
      //       id: `gallery-${index}`,
      //       file: new File([], `gallery-${index}.png`),
      //       preview: url,
      //       name: `gallery-${index}.png`,
      //       size: '0 KB'
      //     })) : []
      //   }
      // }
      
      // setFormData(transformedData)
      
    } catch (error) {
      console.error('Error fetching business data:', error)
      alert('Failed to load business data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

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
      // Create FormData for file uploads
      const submitData = new FormData()
      
      // Add business info
      submitData.append('businessInfo', JSON.stringify(formData.businessInfo))
      
      // Add location contact
      submitData.append('locationContact', JSON.stringify(formData.locationContact))
      
      // Add business hours
      submitData.append('businessHours', JSON.stringify(formData.businessHours))
      
      // Add media files
      if (formData.mediaBranding.logo && formData.mediaBranding.logo.file.size > 0) {
        submitData.append('logo', formData.mediaBranding.logo.file)
      }
      if (formData.mediaBranding.banner && formData.mediaBranding.banner.file.size > 0) {
        submitData.append('banner', formData.mediaBranding.banner.file)
      }
      formData.mediaBranding.gallery.forEach((file, index) => {
        if (file.file.size > 0) {
          submitData.append(`gallery_${index}`, file.file)
        }
      })

      // Determine API endpoint and method
      const url = mode === 'edit' ? `/api/businesses/${businessId}` : '/api/businesses'
      const method = mode === 'edit' ? 'PUT' : 'POST'

      // Make API call
      const response = await fetch(url, {
        method,
        body: submitData,
      })

      if (!response.ok) {
        throw new Error(`Failed to ${mode} business`)
      }

      const result = await response.json()
      
      // Call success callback or redirect
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

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      router.back()
    }
  }

  const renderCurrentStep = () => {
    switch (currentTab) {
      case 0:
        return (
          <BusinessInfoStep
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
          />
        )
      case 2:
        return (
          <BusinessHoursStep
            data={formData.businessHours}
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
          <div className="">
            <h1 className="learge-headeing mb-[26px]">
              {mode === 'edit' ? 'Edit Business' : 'Add New Business'}
            </h1>
          </div>

          {/* Tab Navigation */}
          <div className="bg-[#F4F4F5] rounded-[8px] shadow-sm border">
            <div className="flex flex-wrap p-1">
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  className={`flex-1 min-w-0 px-4 py-2 cursor-pointer common-text transition-colors ${
                    currentTab === index
                      ? "bg-[#6F00FF] text-white rounded-[8px]"
                      : "text-[#717684] hover:text-gray-900 bg-[#F4F4F5]"
                  } ${index === 0 ? "rounded-[8px]" : ""} ${index === tabs.length - 1 ? "rounded-r-lg" : ""}`}
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
