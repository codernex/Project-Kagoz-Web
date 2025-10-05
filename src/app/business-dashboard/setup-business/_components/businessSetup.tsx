"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, ChevronLeft } from "lucide-react"
import { StepBusinessInfo } from "./stepBusinessInfo"
import { StepHours } from "./stepHours"
import { StepMediaBranding } from "./stepMediaBranding"
import { StepLocationContact } from "./stepLocationContact" 
import { CompletionAndPublish } from "./completionAndPublish"
import { FullPagePreview } from "./fullPagePreview"
import { SuccessDialog } from "./successDialog"
// removed react-hook-form provider; each step handles its own submission

interface UploadedFile {
  id: string
  file: File | null
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
  slug?: string
  name: string
  tagLine: string
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
  state: string
  postalCode: string
  country: string
  mobile: string
  email: string
  website: string
  openingHours?: any
  youtubeVideo: string
  facebook: string
  linkedin: string
  instagram: string
  twitter: string
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
  const [businessSlug, setBusinessSlug] = useState<string | null>(null)

  const defaultValues: BusinessData = {
    name: "",
    tagLine: "",
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
    state: "",
    postalCode: "",
    country: "",
    mobile: "",
    email: "",
    website: "",
    youtubeVideo: "",
    facebook: "",
    linkedin: "",
    instagram: "",
    twitter: "",
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

  const [businessData, setBusinessData] = useState<BusinessData>(defaultValues)
  const [publishFunction, setPublishFunction] = useState<(() => Promise<void>) | null>(null)

  const setFormValue = (field: string, value: any) => {
    setBusinessData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Calculate completion percentage based on actual filled fields
  const calculateCompletionPercentage = () => {
    let completedFields = 0
    let totalFields = 0

    // Business Information (Step 0)
    const businessInfoFields = ['name', 'tagLine', 'about']
    businessInfoFields.forEach(field => {
      totalFields++
      if (businessData[field as keyof BusinessData] && businessData[field as keyof BusinessData] !== '') {
        completedFields++
      }
    })

    // Location & Contact (Step 1)
    const locationFields = ['streetAddress', 'city', 'mobile']
    locationFields.forEach(field => {
      totalFields++
      if (businessData[field as keyof BusinessData] && businessData[field as keyof BusinessData] !== '') {
        completedFields++
      }
    })

    // Business Hours (Step 2) - Check if any hours are configured
    totalFields++
    const hasHoursConfigured = businessData.is24x7 || 
      Object.values(businessData.businessHours || {}).some(hour => hour.isOpen) ||
      (businessData.openingHours && businessData.openingHours.days && businessData.openingHours.days.length > 0)
    if (hasHoursConfigured) {
      completedFields++
    }

    // Media & Branding (Step 3)
    totalFields += 3 // logo, license, gallery
    if (businessData.mediaBranding?.logo) completedFields++
    if (businessData.mediaBranding?.license && businessData.mediaBranding.license.length > 0) completedFields++
    if (businessData.mediaBranding?.gallery && businessData.mediaBranding.gallery.length > 0) completedFields++

    // Optional fields that improve completion
    const optionalFields = ['website', 'facebook', 'email', 'startingDate']
    optionalFields.forEach(field => {
      if (field === 'startingDate') {
        totalFields++
        if (businessData.startingDate?.year && businessData.startingDate?.month && businessData.startingDate?.day) {
          completedFields++
        }
      } else {
        totalFields++
        if (businessData[field as keyof BusinessData] && businessData[field as keyof BusinessData] !== '') {
          completedFields++
        }
      }
    })

    return Math.round((completedFields / totalFields) * 100)
  }

  const nextStep = async (data?: any) => {
    if (currentStep < STEPS.length - 1) {
      // If moving from step 2 (business hours), capture the data
      if (currentStep === 2 && data) {
        // Update all business hours data in a single state update to avoid multiple re-renders
        setBusinessData((prev) => ({
          ...prev,
          businessHours: data.businessHours,
          is24x7: data.is24x7,
          closedOnHolidays: data.closedOnHolidays,
          // Add the new openingHours structure
          openingHours: data.openingHours
        }));
      }
      setCurrentStep(currentStep + 1)
    }
  }

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 0: 
        return businessData.name && businessData.tagLine && businessData.about
      case 1: 
        return businessData.streetAddress && businessData.city && businessData.mobile
      case 2: 
        // For step 2 (business hours), always allow next since we handle validation internally
        return true
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


const renderProgressBar = (opts?: { published?: boolean }) => {
  const published = opts?.published;
  const totalSteps = STEPS.length - 1; // 4 for published (0-based)
  const isPublished = published === true;
  const stepNum = isPublished ? totalSteps + 1 : currentStep + 1;
  const percent = isPublished ? 100 : Math.round(((currentStep + 1) / STEPS.length) * 100);
  return (
    <div className="w-full bg-white border-b border-gray-200 py-[25px] ">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="learge-headeing ">Business Setup</h1>
          <div className="text-sm text-gray-500">
            Step {isPublished ? `${totalSteps + 1} of ${totalSteps + 1}` : `${currentStep + 1} of ${STEPS.length}`} - {percent}% Complete
          </div>
        </div>
        {/* Progress container */}
        <div className="relative mt-10">
          {/* Gray background line */}
          <div className="absolute top-[20px] left-0 w-full h-[8px] bg-[#F2F2F2] rounded-full">
            {/* Purple active line */}
            <div
              className="h-[8px] bg-[#6F00FF] rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
          {/* Step circles */}
          <div className="relative flex justify-between">
            {Array.from({ length: totalSteps + 1 }, (_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`sm:w-[32px] sm:h-[32px] w-[24px] h-[24px] rounded-full mb-8 flex items-center justify-center text-sm font-normal z-10 bg-[#6F00FF] text-white`}
                  style={{ marginTop: "-18px" }}
                >
                  {/* <Check className="w-4 h-4" /> */}
                  {index < stepNum - 1 ? <Check className="w-4 h-4" /> : index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepBusinessInfo
          businessData={businessData}
          setFormValue={setFormValue}
          onPrev={prevStep}
          onNext={nextStep}
            isNextDisabled={!isCurrentStepValid()}
          />
        );
      case 1:
        return (
          <StepLocationContact
          businessData={businessData}
          setFormValue={setFormValue}
          onPrev={prevStep}
          onNext={nextStep}
            isNextDisabled={!isCurrentStepValid()}
          />
        );
      case 2:
        return (
          <StepHours
          businessData={businessData}
          onPrev={prevStep}
          onNext={nextStep}
          isNextDisabled={!isCurrentStepValid()}
          />
        );
      case 3:
        return (
          <StepMediaBranding
          businessData={businessData}
          setFormValue={setFormValue}
          onPrev={prevStep}
          onNext={nextStep}
            isNextDisabled={!isCurrentStepValid()}
            businessSlug={businessSlug}
          />
        );
      case 4:
        if (isPublished) {
          // Only show SuccessDialog, progress bar will be rendered at 100% outside
          return (
            <SuccessDialog
              onContinue={() => {
                setCurrentStep(0);
                setShowFullPreview(false);
                setIsPublished(false);
              }}
            />
          );
        } else if (showFullPreview) {
          // Only show FullPagePreview, progress bar will be rendered at 90% outside
          return (
            <FullPagePreview
              businessData={businessData}
              onBack={() => setShowFullPreview(false)}
              onPublish={async () => {
                if (publishFunction) {
                  await publishFunction();
                } else {
                  // Fallback: go back to completion page
                  setShowFullPreview(false);
                }
              }}
            />
          );
        } else {
          // Only show CompletionAndPublish, progress bar will be rendered at 90% outside
          return (
            <CompletionAndPublish
              businessData={businessData}
              completionPercentage={calculateCompletionPercentage()}
              onPreviewClick={() => setShowFullPreview(true)}
              onPrevious={prevStep}
              onPublish={async (businessResult?: any) => {
                // Store the business slug from the API response
                if (businessResult?.slug) {
                  setBusinessSlug(businessResult.slug);
                }
                setIsPublished(true);
              }}
              onPublishFunctionReady={(publishFn) => setPublishFunction(() => publishFn)}
            />
          );
        }
      default:
        return null;
    }
  };

  // Render progress bar at 90% for step 4 (before publish), 100% after publish, else normal
  let progressBar = null;
  if (currentStep === 4 && isPublished) {
    progressBar = renderProgressBar({ published: true }); // 100%
  } else if (currentStep === 4) {
    // 90% for preview and completion
    progressBar = (
      <div className="w-full bg-white border-b border-gray-200 py-[25px] ">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="learge-headeing ">Business Setup</h1>
            <div className="text-sm text-gray-500">
              Step 4 of 5 - 90% Complete
            </div>
          </div>
          {/* Progress container */}
          <div className="relative mt-10">
            {/* Gray background line */}
            <div className="absolute top-[20px] left-0 w-full h-[8px] bg-[#F2F2F2] rounded-full">
              {/* Purple active line */}
              <div
                className="h-[8px] bg-[#6F00FF] rounded-full transition-all duration-300"
                style={{ width: `90%` }}
              />
            </div>
            {/* Step circles */}
            <div className="relative flex justify-between">
              {Array.from({ length: 5 }, (_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`sm:w-[32px] sm:h-[32px] w-[24px] h-[24px] rounded-full mb-8 flex items-center justify-center text-sm font-normal z-10 bg-[#6F00FF] text-white`}
                    style={{ marginTop: "-18px" }}
                  >
                    {index < 3 ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    progressBar = renderProgressBar();
  }
  return (
    <div className="min-h-screen bg-white">
      {progressBar}
      <div className="max-w-[1184px] mx-auto mt-8">{renderStep()}</div>
    </div>
  );
}
