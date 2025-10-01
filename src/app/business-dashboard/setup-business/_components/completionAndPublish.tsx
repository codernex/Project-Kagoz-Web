"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowLeft, CircleCheckBig, SquareArrowOutUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  useRegisterBusinessMutation,
  useUpdateBusinessMutation,
  useUpdateLicenseMutation,
  useUploadPhotoMutation,
  useAddBannerMutation,
  useAddLogoMutation,
  useSetOpeningHoursMutation
} from "@/redux/api"
import type { BusinessData } from "./businessSetup"
import { axiosInstance } from "@/redux/api/base"

interface CompletionAndPublishProps {
  businessData: BusinessData
  completionPercentage: number
  onPreviewClick: () => void
  onPublish?: (businessResult?: any) => void
  onPrevious?: () => void
}

const DAY_MAP: Record<string, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday"
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export function CompletionAndPublish({
  businessData,
  completionPercentage,
  onPreviewClick,
  onPublish,
  onPrevious
}: CompletionAndPublishProps) {
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSubmittingMedia, setIsSubmittingMedia] = useState(false)
  const [registerBusiness, { isLoading }] = useRegisterBusinessMutation()
  const [updateBusiness] = useUpdateBusinessMutation()
  const [addBanner] = useAddBannerMutation()
  const [addLogo] = useAddLogoMutation()
  const [updateLicense] = useUpdateLicenseMutation()
  const [uploadPhoto] = useUploadPhotoMutation()
  const [setOpeningHours] = useSetOpeningHoursMutation()
  const [addCategoryToBusiness] = (require("@/redux/api") as any).useAddCategoryToBusinessMutation()

  const buildOpeningHoursPayload = () => {
    if (businessData.is24x7) {
      return {
        isOpen247: true,
        days: [],
        closedOnHolidays: businessData.closedOnHolidays ?? false
      }
    }

    const days = Object.entries(businessData.businessHours || {}).map(([dayKey, info]) => {
      const displayDay = DAY_MAP[dayKey] || dayKey
      const ranges: string[] = info?.openTime
        ? info.openTime.split(',').map((range) => range.trim())
        : []

      return {
        day: displayDay,
        isOpen: info?.isOpen ?? false,
        timeRanges: info?.isOpen
          ? ranges
              .map((range) => {
                const [from, to] = range.split('-').map((s) => s?.trim())
                if (!from || !to) return null
                return { from, to }
              })
              .filter(Boolean)
          : []
      }
    })

    return {
      isOpen247: false,
      closedOnHolidays: businessData.closedOnHolidays ?? false,
      days
    }
  }

  // API expects either { isOpen247: true } or { isOpen247: false, days: [...] }
  const buildOpeningHoursForApi = () => {
    // Use the new openingHours structure from stepHours
    const openingHours = (businessData as any)?.openingHours
    
    console.log('🔍 Debug openingHours in completionAndPublish:', openingHours)
    console.log('🔍 Debug businessData:', businessData)
    
    if (!openingHours) {
      console.log('🔍 No openingHours found, using fallback')
      // Fallback to old structure if openingHours doesn't exist
      if (businessData.is24x7) {
        return { isOpen247: true }
      }
      return { isOpen247: false, days: [] }
    }

    // If 24/7 is enabled
    if (openingHours.isOpen247) {
      console.log('🔍 24/7 enabled, returning isOpen247: true')
      return { isOpen247: true }
    }

    // If custom hours are set, use the days array from openingHours
    console.log('🔍 Custom hours, returning days:', openingHours.days)
    return {
      isOpen247: false,
      days: openingHours.days || []
    }
  }

  const formatStartingDate = () => {
    if (!businessData.startingDate?.year || !businessData.startingDate?.month || !businessData.startingDate?.day) {
      return null
    }
    
    const year = businessData.startingDate.year
    const month = businessData.startingDate.month.padStart(2, '0')
    const day = businessData.startingDate.day.padStart(2, '0')
    
    return `${year}-${month}-${day}`
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    
    try {
      // Validate required fields
      if (!businessData.name || !businessData.tagLine || !businessData.about) {
        throw new Error("Missing required business information")
      }

      const payload = {
        name: businessData.name,
        tagLine: businessData.tagLine,
        about: businessData.about || "Business description not provided",
        categoryId: businessData.category && businessData.category !== "" ? parseInt(businessData.category) : null,
        subCategories: [],
        streetAddress: businessData.streetAddress || "",
        house: businessData.houseInfo || "",
        localArea: businessData.localArea || "",
        city: businessData.city || "",
        state: businessData.state || "",
        postalCode: businessData.postalCode || "",
        country: businessData.country || "",
        mobile: businessData.mobile || "",
        email: businessData.email || "",
        website: businessData.website || "",
        youtubeVideo: businessData.youtubeVideo || "",
        facebook: businessData.facebook || "",
        linkedin: businessData.linkedin || "",
        instagram: businessData.instagram || "",
        twitter: businessData.twitter || "",
        startingDate: formatStartingDate(),
        openingHours: buildOpeningHoursPayload()
      }
      
      // Submit to API and get the business slug
      const result = await registerBusiness(payload).unwrap()
      const businessSlug = result?.slug || result?.data?.slug
      
      if (businessSlug) {
        await submitAllMediaFiles(businessSlug)

        // Some fields (about, facebook, startingDate) are not persisted on create.
        // Patch them immediately after creation to ensure they are saved.
        try {
          await updateBusiness({
            slug: businessSlug,
            data: {
              about: businessData.about || "",
              facebook: businessData.facebook || "",
              startingDate: formatStartingDate(),
            },
          }).unwrap()
        } catch (e) {
          console.error("Post-create update failed:", e)
        }

        // Set category via dedicated endpoint if we have a value
        try {
          const catId = businessData.category && businessData.category !== "" ? parseInt(businessData.category) : null
          if (catId) {
            await addCategoryToBusiness({ slug: businessSlug, categoryId: catId, subCategories: [] }).unwrap()
          }
        } catch (e) {
          console.error("Setting category failed:", e)
        }

        // Finally, set opening hours using its dedicated endpoint
        try {
          const openingPayload = buildOpeningHoursForApi()
          await setOpeningHours({ slug: businessSlug, ...openingPayload }).unwrap()
        } catch (e) {
          console.error("Setting opening hours failed:", e)
        }
      }
      
      // Call the onPublish callback with the business result
      if (onPublish) onPublish(result)
      
    } catch (error) {
      console.error("Error publishing business:", error)
    } finally {
      setIsPublishing(false)
    }
  }

  const submitAllMediaFiles = async (slug: string) => {
    setIsSubmittingMedia(true)
    
    try {
      // Submit Logo
      if (businessData.mediaBranding?.logo?.file) {
        try {
          const logoFormData = new FormData()
          logoFormData.append('logo', businessData.mediaBranding.logo.file, businessData.mediaBranding.logo.file.name)
          await addLogo({ slug, data: logoFormData }).unwrap()
        } catch (error) {
          console.error("Logo upload failed:", error)
        }
      }

      // Submit Banner
      if (businessData.mediaBranding?.banner?.file) {
        try {
          const maxSize = 5 * 1024 * 1024 // 5MB
          if (businessData.mediaBranding.banner.file.size > maxSize) {
            throw new Error("Banner file is too large. Maximum size allowed is 5MB.")
          }
          
          const bannerFormData = new FormData()
          bannerFormData.append('banner', businessData.mediaBranding.banner.file, businessData.mediaBranding.banner.file.name)
          await addBanner({ slug, data: bannerFormData }).unwrap()
        } catch (error) {
          console.error("Banner upload failed:", error)
        }
      }

      // Submit License Documents
      if (businessData.mediaBranding?.license && businessData.mediaBranding.license.length > 0) {
        for (const license of businessData.mediaBranding.license) {
          try {
            if (!license.file) {
              console.warn('License file is null, skipping upload')
              continue
            }
            const licenseFormData = new FormData()
            licenseFormData.append('image', license.file, license.file.name)
            
            // Format issue date
            let issueDate = new Date().toISOString().substring(0, 10)
            if (businessData.issueDate?.year && businessData.issueDate?.month && businessData.issueDate?.day) {
              const year = businessData.issueDate.year
              const month = businessData.issueDate.month.padStart(2, "0")
              const day = businessData.issueDate.day.padStart(2, "0")
              issueDate = `${year}-${month}-${day}`
            }
            
            licenseFormData.append('date', issueDate)
            await updateLicense({ slug, data: licenseFormData }).unwrap()
          } catch (error) {
            console.error("License upload failed:", error)
          }
        }
      }

      // Submit Business Gallery (server allows maximum 5 total photos)
      if (businessData.mediaBranding?.gallery && businessData.mediaBranding.gallery.length > 0) {
        try {
          // Determine how many photos are already uploaded so we do not exceed server limit
          const { data } = await axiosInstance.get<{ data: any[] }>(`/business/gallery/${slug}`)
          const existingCount = Array.isArray((data as any)?.data) ? (data as any).data.length : 0
          const maxPhotos = 5
          const remaining = Math.max(0, maxPhotos - existingCount)
          const photosToUpload = remaining > 0
            ? businessData.mediaBranding.gallery.slice(0, remaining)
            : []

          for (const gallery of photosToUpload) {
          try {
            if (!gallery.file) {
              console.warn('Gallery file is null, skipping upload')
              continue
            }
            const galleryFormData = new FormData()
            galleryFormData.append('image', gallery.file, gallery.file.name)
            await uploadPhoto({ slug, data: galleryFormData }).unwrap()
          } catch (error) {
            console.error("Gallery upload failed:", error)
          }
          }
        } catch (err) {
          console.error("Failed to fetch existing gallery count:", err)
        }
      }
      
    } catch (error) {
      console.error("Media submission error:", error)
    } finally {
      setIsSubmittingMedia(false)
    }
  }

  const getFullAddress = () => {
    const parts = [
      businessData.streetAddress,
      businessData.houseInfo,
      businessData.localArea,
      businessData.city,
      businessData.postalCode,
      businessData.country
    ].filter(Boolean)
    
    return parts.join(", ")
  }

  const formatDate = (date: { year: string; month: string; day: string }) => {
    const monthIndex = parseInt(date.month) - 1
    return `${MONTHS[monthIndex]} ${date.day}, ${date.year}`
  }

  const getBusinessHoursDisplay = () => {
    // Handle the new openingHours structure
    const openingHours = (businessData as any)?.openingHours
    
    if (!openingHours) return []
    
    // If 24/7 is enabled
    if (openingHours.isOpen247) {
      return ["Open 24/7"]
    }
    
    // If custom hours are set
    if (openingHours.days && Array.isArray(openingHours.days)) {
      return openingHours.days.map((dayData: any) => {
        const dayName = dayData.day
        if (dayData.isOpen && dayData.timeRanges && dayData.timeRanges.length > 0) {
          const timeSlots = dayData.timeRanges.map((range: any) => {
            const fromTime = `${range.from.hours}:${range.from.minutes} ${range.from.period}`
            const toTime = `${range.to.hours}:${range.to.minutes} ${range.to.period}`
            return `${fromTime} - ${toTime}`
          }).join(', ')
          return `${dayName}: ${timeSlots}`
        }
        return `${dayName}: Closed`
      })
    }
    
    return []
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section: Completion & Publish */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Completion & Publish</h2>
            <p className="text-gray-600">You&apos;re Almost Done! Review & Publish Your Listing.</p>
          </div>
          
          {/* Progress Summary Card */}
          <Card className="border-2 border-gray-100">
            <CardContent className="p-6">
              <h3 className="common-text text-[#111827] mb-4">Progress Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">📊 Your listing is {completionPercentage}% complete</span>
                </div>
                <div className="w-full h-2 bg-gray-200 relative rounded-full">
                  <div 
                    className="h-2 bg-[#6F00FF] rounded-full transition-all duration-300" 
                    style={{ width: `${completionPercentage}%` }}
                  />
                  <span className="absolute right-0 -top-5 text-xs font-semibold text-[#2D3643] pr-1">
                    {completionPercentage}%
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[#15803D]">
                  <span className="font-medium">
                    <Image 
                      width={1000} 
                      height={1000} 
                      src="/icons/checkmark.png" 
                      alt="Verified Badge" 
                      className="w-4 h-4 inline-block mr-1" 
                    />
                    {completionPercentage === 100 
                      ? "Great job! You've completed your business profile." 
                      : "Keep going! Add more details to improve your listing."}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Section: Complete Business Preview */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Complete Business Preview</h2>
          <Card className="border border-gray-200">
            <CardContent className="p-0">
              {/* Banner Image */}
              <div className="h-48 bg-gradient-to-r from-blue-500 to-[#6F00FF] relative overflow-hidden">
                {businessData.mediaBranding?.banner ? (
                  <Image 
                    src={businessData.mediaBranding.banner.preview} 
                    alt="Banner"
                    width={800}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-black bg-opacity-20" />
                )}
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{businessData.name}</h3>
                </div>
              </div>
              
              {/* Business Info */}
              <div className="p-6 space-y-6">
                {/* Logo and Basic Info */}
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                    {businessData.mediaBranding?.logo ? (
                      <Image 
                        src={businessData.mediaBranding.logo.preview} 
                        alt="Logo"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span>{businessData.name ? businessData.name.charAt(0).toUpperCase() : "B"}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {businessData.name || "Business Name"}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {businessData.tagLine || "Business tagLine will appear here"}
                    </p>
                  </div>
                </div>
                
                {/* About Section */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {businessData.about || "Business description will appear here"}
                  </p>
                </div>
                
                {/* Business Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Starting Date:</span>
                    <p className="text-gray-600">
                      {businessData.startingDate.year && businessData.startingDate.month && businessData.startingDate.day 
                        ? formatDate(businessData.startingDate) 
                        : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Category:</span>
                    <p className="text-gray-600">{businessData.category || "Not specified"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">Address:</span>
                    <p className="text-gray-600">{getFullAddress() || "Address not provided"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <p className="text-gray-600">{businessData.mobile || "Not provided"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Website:</span>
                    <p className="text-blue-600 hover:underline cursor-pointer">
                      {businessData.website || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Facebook:</span>
                    <p className="text-blue-600 hover:underline cursor-pointer">
                      {businessData.facebook || "Not provided"}
                    </p>
                  </div>
                </div>
                
                {/* Business Hours */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Business Hours</h4>
                  <div className="space-y-2">
                    {(() => {
                      const hoursDisplay = getBusinessHoursDisplay()
                      if (hoursDisplay.length === 0 || (hoursDisplay.length === 1 && hoursDisplay[0] === "Open 24/7")) {
                        return <p className="text-gray-500 text-sm">Business hours not configured</p>
                      }
                      return hoursDisplay.map((hours: string, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-700">{hours.split(':')[0]}:</span>
                          <span className={hours.includes('Closed') ? 'text-red-600' : 'text-gray-600'}>
                            {hours.split(':')[1]}
                          </span>
                        </div>
                      ))
                    })()}
                    {businessData.closedOnHolidays && (
                      <div className="mt-3">
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800 border border-red-200">
                          Closed on public holidays.
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Verified License */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Verified License</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {businessData.mediaBranding?.license && businessData.mediaBranding.license.length > 0 ? (
                      businessData.mediaBranding.license.slice(0, 2).map((file, index) => (
                        <div key={file.id} className="aspect-video bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                          <Image 
                            src={file.preview} 
                            alt={`License ${index + 1}`}
                            width={200}
                            height={112}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="aspect-video bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">License Image 1</span>
                        </div>
                        <div className="aspect-video bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">License Image 2</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Business Gallery */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Business Gallery</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {businessData.mediaBranding?.gallery && businessData.mediaBranding.gallery.length > 0 ? (
                      businessData.mediaBranding.gallery.slice(0, 6).map((file, index) => (
                        <div key={file.id} className="aspect-square bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                          <Image 
                            src={file.preview} 
                            alt={`Gallery ${index + 1}`}
                            width={150}
                            height={150}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))
                    ) : (
                      Array.from({ length: 6 }, (_, i) => (
                        <div key={i} className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">Gallery {i + 1}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Progress and Preview Button */}
          <div className="space-y-4">
            <span className="common-text text-center flex justify-center !font-medium text-[#15803D]">
              <CircleCheckBig className="size-4" />
              {completionPercentage}% Complete
            </span>
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-4">
                <div className="w-full h-2 bg-green-500 rounded-full">
                  <div 
                    className="h-2 bg-green-500 rounded-full transition-all duration-300" 
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="text-sm text-[#15803D] text-center">
              {completionPercentage === 100 
                ? "Perfect! Your listing is complete and ready to publish." 
                : "🎯 Almost there! Add more details to improve visibility."}
            </p>
            <button 
              onClick={onPreviewClick}
              className="w-full text-[#6F00FF] bg-[#F1EBFF] flex items-center justify-center rounded-[8px] py-3 border !border-[#6F00FF]"
            >
              <SquareArrowOutUpRight className="w-4 h-4 mr-2" />
              See Full Page Preview
            </button>
          </div>
        </div>
        
        {/* Upload Progress */}
        {(isPublishing || isSubmittingMedia) && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  {isPublishing ? "Creating your business listing..." : "Uploading media files..."}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  {isPublishing 
                    ? "Please wait while we create your business profile"
                    : "Uploading logo, banner, license documents, and gallery images separately"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <Button 
            variant="outline" 
            className="flex items-center space-x-2"
            onClick={onPrevious}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>
          <Button 
            onClick={handlePublish}
            disabled={isPublishing || isLoading || isSubmittingMedia}
            className="bg-[#6F00FF] hover:bg-purple-700 text-white px-8"
          >
            {isPublishing ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Business...</span>
              </div>
            ) : isSubmittingMedia ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Uploading Media...</span>
              </div>
            ) : (
              "Publish My Business Listing"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}