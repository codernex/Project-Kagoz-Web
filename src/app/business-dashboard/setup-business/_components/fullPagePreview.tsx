"use client"

import { Button } from "@/components/ui/button"
import {
  Clock,
  MapPin,
  Phone,
  Globe,
  Facebook,
  Calendar,
  FileText,
  Tag,
  Camera,
  CheckCircle,
  ChevronLeft,
} from "lucide-react"
import type { BusinessData } from "./businessSetup"
import Link from "next/link"
import { useGetCategoriesQuery } from "@/redux/api/category"

interface FullPagePreviewProps {
  businessData: BusinessData
  onBack: () => void
  onPublish?: () => void
}

export function FullPagePreview({ businessData, onBack, onPublish }: FullPagePreviewProps) {
  // Fetch categories to get category name
  const { data: categoriesData } = useGetCategoriesQuery()
  
  const getFullAddress = () => {
    const parts = [businessData.streetAddress, businessData.houseInfo, businessData.localArea, businessData.city, businessData.postalCode, businessData.country].filter(Boolean)
    return parts.join(", ")
  }

  // Get category name from ID
  const getCategoryName = (categoryId: string) => {
    if (!categoriesData || !categoryId) return "Business Platform"
    const category = categoriesData.find((cat: any) => 
      String(cat.id || cat._id) === String(categoryId)
    )
    return category?.name || "Business Platform"
  }

  const formatDate = (date: { year: string; month: string; day: string }) => {
    // Check if date object exists and has valid fields
    if (!date || !date.month || !date.day || !date.year || 
        date.month.trim() === '' || date.day.trim() === '' || date.year.trim() === '') {
      return "Not specified"
    }
    
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
    
    // Check if month is already a month name (like "January", "February", etc.)
    if (months.includes(date.month)) {
      return `${date.month} ${date.day}, ${date.year}`
    }
    
    // If month is numeric, convert to month name
    const monthIndex = parseInt(date.month) - 1
    if (monthIndex < 0 || monthIndex > 11 || isNaN(monthIndex)) return "Not specified"
    
    return `${months[monthIndex]} ${date.day}, ${date.year}`
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-[16px] h-[16px] bg-[#6F00FF] rounded-full"></div>
          <h1 className="text-[40px] font-medium text-[#111827]">Complete Business Preview</h1>
        </div>

        {/* Business Preview Card */}
        <div className="bg-gray-50 border border-[#CCFBF1] rounded-[8px] mb-8">
          {/* Banner Image */}
          <div className="h-32 sm:h-[260px] bg-gradient-to-r from-blue-500 to-[#6F00FF] relative overflow-hidden rounded-t-[8px] mb-4">
            {businessData.mediaBranding?.banner ? (
              <img 
                src={businessData.mediaBranding.banner.preview} 
                alt="Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-[#6F00FF]" />
            )}
            <div className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
              523 × 128
            </div>
          </div>
          
          {/* Logo and Basic Info */}
          <div className="flex items-start space-x-4 p-8">
            <div className="w-12 h-12  sm:h-[130px] sm:w-[130px] rounded-[8px] flex items-center justify-center text-white font-bold text-sm overflow-hidden">
              {businessData.mediaBranding?.logo ? (
                <img 
                  src={businessData.mediaBranding.logo.preview} 
                  alt="Logo"
                  className="w-full h-full object-cover rounded-[8px]"
                />
              ) : (
                <span>K</span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="sm:text-[32px] text-[24px] font-medium text-[#111827]">
                {businessData.name || "Kagoz.com"}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {businessData.tagLine || "Kagoz.com stands out by offering well-designed premium hosting spaces to cater to the diverse needs of businesses."}
              </p>
            
            </div>
          </div>
        </div>
        {/* Business Details */}
        <div className="space-y-6">
          {/* About Section */}
          <div>
            <h3 className="font-medium text-[#353535] mb-2 flex items-center gap-2">
            <FileText className="w-[16px] h-[16px]" />
              About
            </h3>
            <p dangerouslySetInnerHTML={{ __html: businessData.about || "Kagoz.com is a leading web hosting and domain registration service provider in Bangladesh. We offer a wide range of hosting solutions, including shared hosting, VPS hosting, dedicated servers, and cloud hosting, to meet the needs of businesses of all sizes. Our services are backed by a team of experienced professionals and 24/7 customer support." }} className="text-gray-600 text-sm leading-relaxed">
            </p>
          </div>
          
          {/* Starting Date & Category */}
          <div>
              <span className="font-medium text-[#353535] flex items-center gap-2">
                <Calendar className="w-[16px] h-[16px] text-gray-600" />
                Starting Date
              </span>
              <p className="text-gray-600 text-sm">
                {(() => {
                  console.log("Starting date data:", businessData.startingDate);
                  return formatDate(businessData.startingDate);
                })()}
              </p>
            </div>
            <div>
              <span className="font-medium text-[#353535] flex items-center gap-2">
                <Tag className="w-[16px] h-[16px] text-gray-600" />
                Category
              </span>
              <p className="text-gray-600 text-sm">{getCategoryName(businessData.category)}</p>
            </div>
          {/* Address */}
          <div>
            <span className="font-medium text-[#353535] flex items-center gap-2">
              <MapPin className="w-[16px] h-[16px] text-gray-600" />
              Address
            </span>
            <p className="text-gray-600 text-sm">{getFullAddress() || "25/A, Mohammandia, Lalmatia, Block D, House 24, Mohammadpur, Dhaka, 1207, Bangladesh"}</p>
          </div>
          
          {/* Phone & Website */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-[#353535] flex items-center gap-2">
                <Phone className="w-[16px] h-[16px] text-gray-600" />
                Phone
              </span>
              <p className="text-gray-600 text-sm">{businessData.mobile || "+88017*****"}</p>
            </div>
            
          </div>
          <div>
              <span className="font-medium text-[#353535] flex items-center gap-2">
                <Globe className="w-[16px] h-[16px] text-gray-600" />
                Website
              </span>
              <Link href={businessData.website} className="text-blue-600 hover:underline cursor-pointer text-sm">
                {businessData.website}
              </Link>
            </div>
          {/* Facebook */}
          <div>
            <span className="font-medium text-[#353535] flex items-center gap-2">
              <Facebook className="w-[16px] h-[16px] text-gray-600" />
              Facebook
            </span>
            <Link href={businessData.facebook} className="text-blue-600 hover:underline cursor-pointer text-sm">
              {businessData.facebook }
            </Link>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="font-medium text-[#353535] mb-3 flex items-center gap-2">
              <Clock className="w-[16px] h-[16px] text-gray-600" />
              Business Hours
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Monday:</span>
                <span className="text-gray-600">9:00 AM → 1:00 PM, 2:00 PM → 6:00 PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Tuesday:</span>
                <span className="text-gray-600">9:00 AM → 6:00 PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Wednesday:</span>
                <span className="text-gray-600">9:00 AM → 6:00 PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Thursday:</span>
                <span className="text-gray-600">9:00 AM → 6:00 PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Friday:</span>
                <span className="text-red-600">Closed</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Saturday:</span>
                <span className="text-gray-600">9:00 AM → 6:00 PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Sunday:</span>
                <span className="text-gray-600">9:00 AM → 6:00 PM</span>
              </div>
              <div className="mt-3">
                <div className="bg-orange-100 text-orange-800 border border-orange-200 rounded px-3 py-2 text-sm flex items-center gap-2">
                  <div className="w-[16px] h-[16px] bg-orange-300 rounded"></div>
                  Closed on public holidays
                </div>
              </div>
            </div>
          </div>

          {/* Verified License */}
          <div>
            <h3 className="font-medium text-[#353535] mb-3 flex items-center gap-2">
              <FileText className="w-[16px] h-[16px] text-gray-600" />
              Verified License
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {businessData.mediaBranding?.license && businessData.mediaBranding.license.length > 0 ? (
                businessData.mediaBranding.license.slice(0, 2).map((file, index) => (
                  <div key={file.id} className="sm:w-[227px] sm:h-[154px] w-[100px] h-[80px] bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                    <img 
                      src={file.preview} 
                      alt={`License ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              ) : (
                <>
                  <div className="sm:w-[227px] sm:h-[154px] w-[100px] h-[80px] bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">License Image 1</span>
                  </div>
                  <div className="sm:w-[227px] sm:h-[154px] w-[100px] h-[80px] bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">License Image 2</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Business Gallery */}
          <div>
            <h3 className="font-medium text-[#353535] mb-3 flex items-center gap-2">
              <Camera className="w-[16px] h-[16px] text-gray-600" />
              Business Gallery
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {businessData.mediaBranding?.gallery && businessData.mediaBranding.gallery.length > 0 ? (
                businessData.mediaBranding.gallery.slice(0, 5).map((file, index) => (
                  <div key={file.id} className="sm:w-[227px] sm:h-[154px] w-[100px] h-[80px] bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                    <img 
                      src={file.preview} 
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              ) : (
                Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="sm:w-[227px] sm:h-[154px] w-[100px] h-[80px] bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Gallery {i + 1}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Completion Status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 my-6 sm:my-10">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="text-center mb-4">
            <span className="text-2xl font-bold text-[#15803D]">95% Complete</span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-4 mb-4">
            <div className="bg-green-500 h-4 rounded-full" style={{ width: "95%" }}></div>
          </div>
          <p className="text-sm text-[#15803D] text-center flex items-center justify-center gap-1">
            🎯 Almost there! Add more details to improve visibility.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={onBack}
            variant="outline" 
            className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-[8px]  font-medium"
          >
            <ChevronLeft className="w-[16px] h-[16px]" />
            Continue Editing
          </Button>
          <Button 
            variant={"submit"} 
            className="bg-[#6F00FF] hover:bg-purple-700 text-white px-8 py-3 rounded-lg text-lg font-medium"
            onClick={onPublish}
          >
            Publish Business Listing
          </Button>
        </div>
      </div>
    </div>
  )
}
