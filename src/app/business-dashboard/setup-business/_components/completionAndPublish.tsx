"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Calendar, CalendarCheck, Camera, ChevronLeft, CircleCheckBig, Facebook, FileText, Globe, MapPin, Phone, SquareArrowOutUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  useRegisterBusinessMutation,
  useUpdateBusinessMutation,
  useUpdateLicenseMutation,
  useUploadPhotoMutation,
  useAddBannerMutation,
  useAddLogoMutation,
  useSetOpeningHoursMutation
} from "@/redux/api"
import { useGetCategoriesQuery } from "@/redux/api/category"
import type { BusinessData } from "./businessSetup"
import { axiosInstance } from "@/redux/api/base"

interface CompletionAndPublishProps {
  businessData: BusinessData
  completionPercentage: number
  onPreviewClick: () => void
  onPublish?: (businessResult?: any) => void
  onPrevious?: () => void
  onPublishFunctionReady?: (publishFn: () => Promise<void>) => void
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
  onPrevious,
  onPublishFunctionReady
}: CompletionAndPublishProps) {
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSubmittingMedia, setIsSubmittingMedia] = useState(false)
  
  // Fetch categories to get category name
  const { data: categoriesData } = useGetCategoriesQuery()
  const [registerBusiness, { isLoading }] = useRegisterBusinessMutation()
  const [updateBusiness] = useUpdateBusinessMutation()
  const [addBanner] = useAddBannerMutation()
  const [addLogo] = useAddLogoMutation()
  const [updateLicense] = useUpdateLicenseMutation()
  const [uploadPhoto] = useUploadPhotoMutation()
  const [setOpeningHours] = useSetOpeningHoursMutation()
  const [addCategoryToBusiness] = (require("@/redux/api") as any).useAddCategoryToBusinessMutation()

  // Expose the publish function to parent component
  React.useEffect(() => {
    if (onPublishFunctionReady) {
      onPublishFunctionReady(handlePublish)
    }
  }, [onPublishFunctionReady])

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

  const buildOpeningHoursForApi = () => {
    // Use the new openingHours structure from stepHours
    const openingHours = (businessData as any)?.openingHours
    
    
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
    if (!date.month || !date.day || !date.year) return "Not specified"
    const monthIndex = parseInt(date.month) - 1
    if (monthIndex < 0 || monthIndex > 11) return "Not specified"
    return `${MONTHS[monthIndex]} ${date.day}, ${date.year}`
  }

  // Get category name from ID
  const getCategoryName = (categoryId: string) => {
    if (!categoriesData || !categoryId) return "Not specified"
    const category = categoriesData.find((cat: any) => 
      String(cat.id || cat._id) === String(categoryId)
    )
    return category?.name || "Not specified"
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
            <h2 className="text-2xl font-medium flex items-center gap-2 text-[#111827] mb-2"><CircleCheckBig className="text-[#9333EA]" /> Completion & Publish</h2>
            <p className="text-gray-600">You&apos;re Almost Done! Review & Publish Your Listing.</p>
          </div>
          
          {/* Progress Summary Card */}
          <div className="border border-gray-100 rounded-[8px] shadow-lg">
            <div className="p-6">
              <h3 className="common-text text-[#111827] mb-10">Progress Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#353535]">📊 Your listing is {completionPercentage}% complete</span>
                </div>
                <div className="w-full h-2 bg-gray-200 relative rounded-full">
                  <div 
                    className="h-2 bg-[#6F00FF] rounded-full  transition-all duration-300" 
                    style={{ width: `${completionPercentage}%` }}
                  />
                  <span className="absolute right-0  mb-12 -top-9 text-[14px] font-semibold text-[#2D3643] pr-1">
                    {completionPercentage}%
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[#2D3643]">
                  <span className="font-medium">
                    <Image 
                      width={1000} 
                      height={1000} 
                      src="/checkmark.png" 
                      alt="Verified Badge" 
                      className="w-[16px] h-[16px] inline-block mr-1" 
                    />
                    {completionPercentage === 100 
                      ? " Great job! You've completed your business profile." 
                      : "Keep going! Add more details to improve your listing."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Section: Complete Business Preview */}
        <div className="space-y-6 border border-gray-200 rounded-[8px] p-[12px] sm:p-[24px]">
          <h2 className="sm:text-[20px] text-[16px] font-medium text-[#111827] flex items-center gap-2">
            <span className="bg-[#6F00FF] rounded-full h-3 w-3"></span>
            Complete Business Preview</h2>

            <div className="space-y-4 rounded-[8px] bg-gradient-to-r from-[#F0FDFA] to-[#FAF5FF] border border-[#CCFBF1]">
            <div className="h-48 relative overflow-hidden rounded-t-[8px]">
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
               
              </div>
              <div className="flex items-start space-x-4 p-8">
                  <div className="w-16 sm:w-[64px] h-16 sm:h-[64px] bg-red-500 rounded-[8px] flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                    {businessData.mediaBranding?.logo ? (
                      <Image 
                        src={businessData.mediaBranding.logo.preview} 
                        alt="Logo"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover "
                      />
                    ) : (
                      <span>{businessData.name ? businessData.name.charAt(0).toUpperCase() : "B"}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[20px] font-medium text-[#111827]">
                      {businessData.name || "Business Name"}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {businessData.tagLine || "Business tagLine will appear here"}
                    </p>
                  </div>
                </div>
            </div>
          <div className="">
            <div className="space-y-6 ">
              
              
                {/* About Section */}
                <div>
                  <h4 className="font-medium text-[#353535] mb-2 flex items-center gap-2"> <span><FileText className="w-[16px] h-[16px] text-gray-600" /></span> About</h4>
                  <p 
                    dangerouslySetInnerHTML={{
                      __html: businessData.about || "Business description will appear here"
                    }} 
                    className="text-gray-600 text-sm leading-relaxed"
                  />
                </div>
                <div>
                    <span className="font-medium text-[#353535] flex gap-2 items-center"><Calendar className="w-[16px] h-[16px] text-gray-600" />Starting Date</span>
                    <p className="text-gray-600">
                      {businessData.startingDate?.year && businessData.startingDate?.month && businessData.startingDate?.day 
                        ? formatDate(businessData.startingDate) 
                        : "Not specified"}
                    </p>
                  </div>
                <div>
                    <span className="font-medium text-[#353535] flex gap-2 items-center"><CalendarCheck className="w-[16px] h-[16px] text-gray-600" />Category</span>
                    <p className="text-gray-600">{getCategoryName(businessData.category) || "Not specified"}</p>
                  </div>
                <div>
                    <span className="font-medium text-[#353535] flex gap-2 items-center"><MapPin className="w-[16px] h-[16px] text-gray-600" />Address</span>
                    <p className="text-gray-600">{getFullAddress() || "Address not provided"}</p>
                  </div>
                <div>
                    <span className="font-medium text-[#353535] flex gap-2 items-center"><Phone className="w-[16px] h-[16px] text-gray-600" />Phone</span>
                    <p className="text-gray-600">{businessData.mobile || "Not provided"}</p>
                  </div>
                <div>
                    <span className="font-medium text-[#353535] flex gap-2 items-center"><Globe className="w-[16px] h-[16px] text-gray-600" />Website</span>
                    <p className="text-gray-600">{businessData.website || "Not provided"}</p>
                  </div>
                <div>
                    <span className="font-medium text-[#353535] flex gap-2 items-center"><Facebook className="w-[16px] h-[16px] text-gray-600" />Facebook</span>
                    <p className="text-gray-600">{businessData.facebook || "Not provided"}</p>
                  </div>
                        
                      
              
                
                {/* Business Hours */}
                <div>
                  <h4 className="font-medium text-[#353535] mb-3 flex items-center gap-2">
                    <div className=""><Calendar className="w-[16px] h-[16px] text-gray-600" /></div>
                    Business Hours
                  </h4>
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
                        <div className="bg-orange-100 text-orange-800 border border-orange-200 rounded px-3 py-2 text-sm flex items-center gap-2">
                          <div className="w-4 h-4 bg-orange-300 rounded"></div>
                          Closed on public holidays
                        </div>
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
                  <h4 className="font-medium text-[#353535] mb-3 flex items-center gap-2">
                  <Camera className="w-[16px] h-[16px] text-gray-600" />
                    Business Gallery
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {businessData.mediaBranding?.gallery && businessData.mediaBranding.gallery.length > 0 ? (
                      businessData.mediaBranding.gallery.slice(0, 5).map((file, index) => (
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
                      Array.from({ length: 5 }, (_, i) => (
                        <div key={i} className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">Gallery {i + 1}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            
          </div>
          
          {/* Progress and Preview Button */}
          {/* Completion Status Card */}
          <div className="bg-green-50 border border-green-200 rounded-[8px] p-6 space-y-6 flex flex-col items-center justify-center mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-[30px] h-[30px] bg-green-500 rounded-full flex items-center justify-center">
                <CircleCheckBig className="w-[20px] h-[20px] text-white" />
              </div>
              <span className="font-medium text-[#15803D]">{completionPercentage}% Complete</span>
            </div>
            <div className="w-full bg-[#15803D] rounded-full h-4 mb-3">
              <div 
                className="bg-green-500 h-4 rounded-full transition-all duration-300" 
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-sm text-[#15803D] flex items-center gap-1">
              🎯 Almost there! Add more details to improve visibility.
            </p>
          </div>
          
          {/* Preview Button */}
          <button 
            onClick={onPreviewClick}
            className="w-full text-[#6F00FF] bg-[#F1EBFF] flex items-center justify-center rounded-[8px] py-3 border border-[#6F00FF] hover:bg-[#6F00FF] hover:text-white transition-colors"
          >
            <SquareArrowOutUpRight className="w-[20px] h-[20px] mr-2" />
            See Full Page Preview
          </button>
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
        <div className="flex justify-between gap-6 mt-8 pt-6 border-t border-gray-200">
          <Button 
            variant="outline" 
            className="flex items-center w-[50%] space-x-2"
            onClick={onPrevious}
          >
            <ChevronLeft className="w-[16px] h-[16px]" />
            <span>Previous</span>
          </Button>
          <Button 
          variant="submit"  
            onClick={handlePublish}
            disabled={isPublishing || isLoading || isSubmittingMedia}
            className="bg-[#6F00FF] hover:bg-purple-700 text-white px-8"
          >
            {isPublishing ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-[8px] animate-spin" />
                <span>Creating Business...</span>
              </div>
            ) : isSubmittingMedia ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-[8px] animate-spin" />
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