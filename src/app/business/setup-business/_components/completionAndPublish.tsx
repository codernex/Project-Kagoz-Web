"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  Eye,
  ArrowLeft,
  CircleCheckBig,
  SquareArrowOutUpRight,
} from "lucide-react"
import type { BusinessData } from "./businessSetup"
import Image from "next/image"

interface CompletionAndPublishProps {
  businessData: BusinessData
  completionPercentage: number
  onPreviewClick: () => void
  onPublish?: () => void
}

export function CompletionAndPublish({ businessData, completionPercentage, onPreviewClick, onPublish }: CompletionAndPublishProps) {
  const [isPublishing, setIsPublishing] = useState(false)

  const handlePublish = async () => {
    setIsPublishing(true)
    // Simulate publishing process
    setTimeout(() => {
      setIsPublishing(false)
      if (onPublish) {
        onPublish()
      }
    }, 2000)
  }

  const getFullAddress = () => {
    const parts = [businessData.streetAddress, businessData.houseInfo, businessData.localArea, businessData.city, businessData.postalCode, businessData.country].filter(Boolean)
    return parts.join(", ")
  }

  const formatDate = (date: { year: string; month: string; day: string }) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
    return `${months[parseInt(date.month) - 1]} ${date.day}, ${date.year}`
  }

  const getBusinessHoursDisplay = () => {
    if (businessData.is24x7) {
      return ["Open 24/7"]
    }
    
    const days = {
      Mon: "Monday",
      Tue: "Tuesday", 
      Wed: "Wednesday",
      Thu: "Thursday",
      Fri: "Friday",
      Sat: "Saturday",
      Sun: "Sunday"
    }

    const hasOpenDays = Object.values(businessData.businessHours).some(hours => hours.isOpen)
    if (!hasOpenDays) {
      return []
    }

    return Object.entries(businessData.businessHours).map(([day, hours]) => {
      const dayName = days[day as keyof typeof days]
      if (hours.isOpen) {
        return `${dayName}: ${hours.openTime} → ${hours.closeTime}`
      } else {
        return `${dayName}: Closed`
      }
    })
  }



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Business Setup</h1>
          <div className="text-sm text-gray-500">
            Step 4 of 5 - 95% Complete
          </div>
        </div>
        
        {/* Progress Steps */}
        <div className="relative">
          <div className="absolute top-5 left-0 w-full h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-[#6F00FF] rounded-full transition-all duration-300" style={{ width: "95%" }} />
          </div>
          <div className="relative flex justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full mb-8 flex items-center justify-center text-sm font-medium z-10 ${
                    step < 5 ? "bg-[#6F00FF] text-white" : "bg-white border-2 border-gray-300 text-gray-500"
                  }`}
                  style={{ marginTop: "-18px" }}
                >
                  {step < 5 ? <Check className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section: Completion & Publish */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Completion & Publish</h2>
            <p className="text-gray-600">You're Almost Done! Review & Publish Your Listing.</p>
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
                         className="h-2 bg-[#6F00FF]  rounded-full transition-all duration-300" 
                         style={{ width: `${completionPercentage}%` }}
                       ></div>
                       <span className="absolute right-0 -top-5  text-xs font-semibold text-[#2D3643] pr-1">
                         {completionPercentage}%
                       </span>
                     </div>
                  
                
                 <div className="flex items-center space-x-2 text-[#15803D]">
                   
                   <span className="font-medium">
                     <Image width={1000} height={1000} src="/icons/checkmark.png" alt="Verified Badge" className="w-4 h-4 inline-block mr-1" />
                     {completionPercentage === 100 ? "Great job! You've completed your business profile." : "Keep going! Add more details to improve your listing."}</span>
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
                   <img 
                     src={businessData.mediaBranding.banner.preview} 
                     alt="Banner"
                     className="w-full h-full object-cover"
                   />
                 ) : (
                   <div className="absolute inset-0 bg-black bg-opacity-20"></div>
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
                       <img 
                         src={businessData.mediaBranding.logo.preview} 
                         alt="Logo"
                         className="w-full h-full object-cover rounded-full"
                       />
                     ) : (
                       <span>{businessData.name ? businessData.name.charAt(0).toUpperCase() : "B"}</span>
                     )}
                   </div>
                   <div className="flex-1">
                     <h3 className="text-xl font-bold text-gray-900">{businessData.name || "Business Name"}</h3>
                     <p className="text-gray-600 mt-1">{businessData.tagline || "Business tagline will appear here"}</p>
                   </div>
                 </div>

                                 {/* About Section */}
                 <div>
                   <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                   <p className="text-gray-600 text-sm leading-relaxed">{businessData.about || "Business description will appear here"}</p>
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
                     <p className="text-blue-600 hover:underline cursor-pointer">{businessData.website || "Not provided"}</p>
                   </div>
                   <div>
                     <span className="font-medium text-gray-700">Facebook:</span>
                     <p className="text-blue-600 hover:underline cursor-pointer">{businessData.facebook || "Not provided"}</p>
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
                       return hoursDisplay.map((hours, index) => (
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
                           <img 
                             src={file.preview} 
                             alt={`License ${index + 1}`}
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
                           <img 
                             src={file.preview} 
                             alt={`Gallery ${index + 1}`}
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
                                   <span className="common-text text-center flex justify-center !font-medium text-[#15803D]"><CircleCheckBig className="size-4" />{completionPercentage}% Complete</span>
             <div className="flex items-center justify-between">
               <div className="flex-1 mr-4">
                 <div className="w-full h-2 bg-gray-200 rounded-full">
                   <div 
                     className="h-2 bg-green-500 rounded-full transition-all duration-300" 
                     style={{ width: `${completionPercentage}%` }}
                   ></div>
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
              className="w-full text-[#6F00FF] bg-[#F1EBFF] flex items-center justify-center rounded-[8px] py-3 border !border-[#6F00FF] "
            >
              <SquareArrowOutUpRight className="w-4 h-4 mr-2" />
              See Full Page Preview
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      {/* <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <Button variant="outline" className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>
        
        <Button 
          onClick={handlePublish}
          disabled={isPublishing}
          className="bg-[#6F00FF] hover:bg-purple-700 text-white px-8"
        >
          {isPublishing ? "Publishing..." : "Publish My Business Listing"}
        </Button>
      </div> */}
    </div>
  )
}
