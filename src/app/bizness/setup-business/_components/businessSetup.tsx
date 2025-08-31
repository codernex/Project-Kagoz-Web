"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  MapPin,
  Phone,
  Globe,
  Facebook,
  Check,
  Calendar,
  Building2,
  Star,
  ChevronLeft,
  ChevronRight,
  Eye,
  Leaf,
} from "lucide-react"
import { StepBusinessInfo } from "./stepBusinessInfo"
import { StepHours } from "./stepHours"
import { StepMediaBranding } from "./stepMediaBranding"
import { StepLocationContact } from "./stepLocationContact" 
import { CompletionAndPublish } from "./completionAndPublish"
import { FullPagePreview } from "./fullPagePreview"
import { SuccessDialog } from "./successDialog"
import { useForm, FormProvider } from "react-hook-form"

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
  license: UploadedFile[]
  gallery: UploadedFile[]
}

export interface BusinessData {
  name: string
  tagline: string
  about: string
  startingDate: { year: string; month: string; day: string }
  issueDate: { year: string; month: string; day: string }
  category: string
  logo: string
  bannerImage: string
  gallery: string[]
  streetAddress: string
  houseInfo: string
  localArea: string
  city: string
  postalCode: string
  country: string
  mobile: string
  website: string
  facebook: string
  businessHours: {
    [key: string]: {
      isOpen: boolean
      openTime: string
      closeTime: string
    }
  }
  is24x7: boolean
  closedOnHolidays: boolean
  mediaBranding?: MediaBrandingData
}

const STEPS = [
  "Business Information",
  "Location & Contact",
  "Business Hours & Availability",
  "Media & Business Branding",
  "Complete",
]

// days moved to step component

export function BusinessSetupWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showFullPreview, setShowFullPreview] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  
  const defaultValues: BusinessData = {
    name: "",
    tagline: "",
    about: "",
    startingDate: { year: "", month: "", day: "" },
    issueDate: { year: "", month: "", day: "" },
    category: "",
    logo: "",
    bannerImage: "",
    gallery: [],
    streetAddress: "",
    houseInfo: "",
    localArea: "",
    city: "",
    postalCode: "",
    country: "",
    mobile: "",
    website: "",
    facebook: "",
    businessHours: {
      Mon: { isOpen: false, openTime: "9:00 AM", closeTime: "6:00 PM" },
      Tue: { isOpen: false, openTime: "9:00 AM", closeTime: "6:00 PM" },
      Wed: { isOpen: false, openTime: "9:00 AM", closeTime: "6:00 PM" },
      Thu: { isOpen: false, openTime: "9:00 AM", closeTime: "6:00 PM" },
      Fri: { isOpen: false, openTime: "9:00 AM", closeTime: "6:00 PM" },
      Sat: { isOpen: false, openTime: "9:00 AM", closeTime: "6:00 PM" },
      Sun: { isOpen: false, openTime: "9:00 AM", closeTime: "6:00 PM" },
    },
    is24x7: false,
    closedOnHolidays: false,
  }

  const methods = useForm<BusinessData>({
    defaultValues,
    mode: "onChange"
  })

  const { watch, setValue, getValues } = methods
  const businessData = watch()

  const updateBusinessData = (field: string, value: any) => {
    setValue(field as keyof BusinessData, value, { shouldValidate: true })
  }

  const nextStep = async () => {
    if (currentStep < STEPS.length - 1) {
      if (currentStep === 3) {
        await submitBusiness()
      }
      setCurrentStep(currentStep + 1)
    }
  }

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 0: 
        return businessData.name && businessData.tagline && businessData.about
      case 1: 
        return businessData.streetAddress && businessData.city && businessData.mobile
      case 2: 
        return Object.values(businessData.businessHours).some(hours => hours.isOpen) || businessData.is24x7
      case 3: 
        return true 
      default:
        return true
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }


const renderProgressBar = () => (
  <div className="w-full bg-white border-b border-gray-200 py-[25px] ">
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="learge-headeing ">Business Setup</h1>
        <div className="text-sm text-gray-500">
          Step {currentStep + 1} of 5 - {Math.round(((currentStep + 1) / STEPS.length) * 100)}% Complete
        </div>
      </div>
      {/* Progress container */}
      <div className="relative mt-10">
        {/* Gray background line */}
        <div className="absolute top-[20px] left-0 w-full h-[8px] bg-[#F2F2F2] rounded-full">
          {/* Purple active line */}
          <div
            className="h-[8px] bg-[#6F00FF] rounded-full transition-all duration-300"
            style={{
              width: `${((currentStep + 0.5) / STEPS.length) * 100}%`,
            }}
          />
        </div>
        {/* Step circles */}
        <div className="relative flex justify-between">
          {Array.from({ length: STEPS.length }, (_, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`sm:w-[32px] sm:h-[32px] w-[24px] h-[24px] rounded-full mb-8 flex items-center justify-center text-sm font-medium z-10 ${
                  index < currentStep
                    ? "bg-[#6F00FF] text-white"
                    : index === currentStep
                    ? "bg-[#6F00FF] text-white"
                    : "bg-white border-2 border-[#D1D1D1] text-gray-500"
                }`}
                style={{ marginTop: "-18px" }}
              >
                {index === STEPS.length - 1
                  ? <Check className="w-4 h-4" />
                  : index + 1}
              </div>
            
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

  const renderBusinessPreview = () => (
    <div className="w-full border border-[#E4E4E4] rounded-2xl">
      <div className="p-4">
          <div className="flex items-center space-x-3 mb-4 bg-gradient-to-r border border-[#CCFBF1] rounded-[12px] px-4 py-[20px] from-[#F0FDFA] to-[#FAF5FF]">
            <div className="size-16 basis-16 shrink-0 bg-[#6F00FF] rounded-lg flex items-center justify-center">
              <Building2 className="size-8 text-white" />
            </div>
                         <div className="flex-1 min-w-0">
               <h3 className="font-semibold text-sm truncate">{businessData.name || "Business Name"}</h3>
               <p className="text-xs text-gray-600 break-words">{businessData.tagline || "Business tagline"}</p>
             </div>
          </div>

        <div className="space-y-6 text-xs">
                     <div className="flex items-start space-x-2">
             <Building2 className="w-3 h-3 text-gray-400 mt-0.5" />
             <div>
               <p className="font-medium">About</p>
               <p className="text-gray-600 line-clamp-3">{businessData.about || "Business description will appear here"}</p>
             </div>
           </div>

                     <div className="flex items-center space-x-2">
             <Calendar className="w-3 h-3 text-gray-400" />
             <div>
               <p className="font-medium">Starting Date</p>
               <p className="text-gray-600">
                 {businessData.startingDate.year && businessData.startingDate.month && businessData.startingDate.day 
                   ? `${businessData.startingDate.year}-${businessData.startingDate.month}-${businessData.startingDate.day}`
                   : "Not specified"}
               </p>
             </div>
           </div>

           <div className="flex items-center space-x-2">
             <Star className="w-3 h-3 text-gray-400" />
             <div>
               <p className="font-medium">Category</p>
               <p className="text-gray-600">{businessData.category || "Not specified"}</p>
             </div>
           </div>

          {currentStep >= 1 && (
            <>
                             <div className="flex items-start space-x-2">
                 <MapPin className="w-3 h-3 text-gray-400 mt-0.5" />
                 <div>
                   <p className="font-medium">Address</p>
                   <p className="text-gray-600">
                     {(() => {
                       const parts = [businessData.streetAddress, businessData.houseInfo, businessData.localArea, businessData.city, businessData.postalCode, businessData.country].filter(Boolean)
                       return parts.length > 0 ? parts.join(", ") : "Address not provided"
                     })()}
                   </p>
                 </div>
               </div>

               <div className="flex items-center space-x-2">
                 <Phone className="w-3 h-3 text-gray-400" />
                 <div>
                   <p className="font-medium">Phone</p>
                   <p className="text-gray-600">{businessData.mobile || "Not provided"}</p>
                 </div>
               </div>

               <div className="flex items-center space-x-2">
                 <Globe className="w-3 h-3 text-gray-400" />
                 <div>
                   <p className="font-medium">Website</p>
                   <p className="text-blue-600">{businessData.website || "Not provided"}</p>
                 </div>
               </div>

               <div className="flex items-center space-x-2">
                 <Facebook className="w-3 h-3 text-gray-400" />
                 <div>
                   <p className="font-medium">Facebook</p>
                   <p className="text-blue-600">{businessData.facebook || "Not provided"}</p>
                 </div>
               </div>
            </>
          )}

          {currentStep >= 2 && (
            <div className="flex items-start space-x-2">
              <Clock className="w-3 h-3 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium">Business Hours</p>
                {businessData.is24x7 ? (
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      Open 24 hours a day, 7 days a week
                    </Badge>
                    {businessData.closedOnHolidays && (
                      <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800 flex items-center gap-1">
                        <Leaf className="w-3 h-3" />
                        Closed on public holidays
                      </Badge>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {(() => {
                      const hasOpenDays = Object.values(businessData.businessHours).some(hours => hours.isOpen)
                      if (!hasOpenDays) {
                        return <p className="text-xs text-gray-500">Business hours will appear here</p>
                      }
                      return (
                        <>
                          {Object.entries(businessData.businessHours).map(([day, hours]) => (
                            <div key={day} className="flex justify-between text-xs">
                              <span className="font-medium">{day}</span>
                              <span className={hours.isOpen ? "text-gray-600" : "text-red-600"}>
                                {hours.isOpen ? hours.openTime : "Closed"}
                              </span>
                            </div>
                          ))}
                          {businessData.closedOnHolidays && (
                            <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800 mt-2 flex items-center gap-1">
                              <Leaf className="w-3 h-3" />
                              Closed on public holidays
                            </Badge>
                          )}
                        </>
                      )
                    })()}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 py-3 px-5 rounded-[8px] bg-[#F9FAFB] border-l-[4px] border-[#6F00FF]  text-xs text-[#717684]">
          This preview shows how your business {currentStep < 1 ? "information will appear" : currentStep < 2 ? "location and contact information will appear" : currentStep < 3 ? "hours will appear" : "information will appear"} to
          customers. Make sure all {currentStep < 1 ? "details" : currentStep < 2 ? "details" : currentStep < 3 ? "times" : "details"} are accurate.
        </div>
      </div>
    </div>
  )

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepBusinessInfo
            businessData={businessData}
            updateBusinessData={updateBusinessData}
            renderBusinessPreview={renderBusinessPreview}
          />
        )
      case 1:
        return (
          <StepLocationContact
            businessData={businessData}
            updateBusinessData={updateBusinessData}
            renderBusinessPreview={renderBusinessPreview}
          />
        )
      case 2:
        return (
          <StepHours
            businessData={businessData}
            updateBusinessData={updateBusinessData}
            renderBusinessPreview={renderBusinessPreview}
          />
        )
      case 3:
        return (
          <StepMediaBranding
            businessData={businessData}
            updateBusinessData={updateBusinessData}
            renderBusinessPreview={renderBusinessPreview}
          />
        )
      case 4:
        return isPublished ? (
          <SuccessDialog
            onContinue={() => {
              setCurrentStep(0)
              setShowFullPreview(false)
              setIsPublished(false)
            }}
          />
        ) : showFullPreview ? (
          <FullPagePreview
            businessData={businessData}
            onBack={() => setShowFullPreview(false)}
          />
        ) : (
          <CompletionAndPublish
            businessData={businessData}
            completionPercentage={Math.round(((currentStep + 1) / STEPS.length) * 100)}
            onPreviewClick={() => setShowFullPreview(true)}
            onPublish={async () => {
              setIsPublished(true)
            }}
          />
        )
      default:
         return null
    }
  }
    

  const submitBusiness = async () => {
    try {
      const formData = getValues()
      console.log("Submitting business data:", formData)
      // const response = await fetch("/api/business/setup", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // })
      // if (!response.ok) {
      //   console.error("Failed to submit business data")
      // }
    } catch (error) {
      console.error("Error submitting business data", error)
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-white">
        {currentStep < STEPS.length - 1 && renderProgressBar()}

        <div className="max-w-[1184px] mx-auto mt-8">
          {renderStep()}

          {currentStep < STEPS.length - 1 && currentStep !== 4 && (
            <div className="flex gap-4 my-8 w-1/2">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg !px-10 y-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              <Button 
                onClick={nextStep} 
                disabled={!isCurrentStepValid()}
                className={`flex items-center w-full space-x-2 rounded-lg px-6 py-2 ${
                  isCurrentStepValid() 
                    ? "bg-[#6F00FF] hover:bg-purple-700 text-white" 
                    : "bg-gray-400 cursor-not-allowed text-white"
                }`}
              >
                <span>Next</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </FormProvider>
  )
}
