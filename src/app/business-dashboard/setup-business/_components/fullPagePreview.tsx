"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  MapPin,
  Phone,
  Globe,
  Facebook,
  Calendar,
  Building2,
  Star,
  ArrowLeft,
  Share2,
  Eye,
  FileText,
  Tag,
  Camera,
  CheckCircle,
  User,
  ChevronDown,
} from "lucide-react"
import type { BusinessData } from "./businessSetup"

interface FullPagePreviewProps {
  businessData: BusinessData
  onBack: () => void
}

export function FullPagePreview({ businessData, onBack }: FullPagePreviewProps) {
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
    <div className="min-h-screen bg-white">
      {/* Header */}
        {/* <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-[#6F00FF] rounded-full"></div>
              <h1 className="text-xl font-bold text-gray-900">Complete Business Preview</h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <ChevronDown className="w-4 h-4 text-gray-700" />
            </div>
          </div>
        </div> */}

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Banner Image */}
        <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg overflow-hidden mb-6">
          {businessData.mediaBranding?.banner ? (
            <img 
              src={businessData.mediaBranding.banner.preview} 
              alt="Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          )}
        </div>

        {/* Business Info Card */}
        <Card className="border border-gray-200 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl overflow-hidden flex-shrink-0">
                {businessData.mediaBranding?.logo ? (
                  <img 
                    src={businessData.mediaBranding.logo.preview} 
                    alt="Logo"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span>{businessData.name ? businessData.name.charAt(0).toUpperCase() : "K"}</span>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{businessData.name || "Kagoz.com"}</h2>
                <p className="text-gray-600 mb-4">
                  {businessData.about || "Kagoz stands out by offering both free and premium listing options to cater to the diverse needs of businesses."}
                </p>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{businessData.city || "Dhaka"}, {businessData.country || "Bangladesh"}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>{businessData.mobile || "+880 1712345678"}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Globe className="w-4 h-4" />
                    <span>Open</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Details */}
        <div className="space-y-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">About</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {businessData.about || "Kagoz stands out by offering both free and premium listing options to cater to the diverse needs of businesses. Whether you're a start-up or an established enterprise, our platform provides a comprehensive solution to streamline your services and reach potential customers. From a Basic Listing, it already straightforward process to get businesses listed at no cost. Verified and Trusted Information Each business listing undergoes verification to ensure accuracy and reliability. User-Friendly Search Experience. Advanced search features allow users to find businesses by category, name, or location."}
            </p>
          </div>

          {/* Business Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <div>
                <span className="font-medium text-gray-700">Starting Date:</span>
                <p className="text-gray-600">
                  {businessData.startingDate.year && businessData.startingDate.month && businessData.startingDate.day 
                    ? formatDate(businessData.startingDate) 
                    : "July 12, 2025"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Tag className="w-5 h-5 text-gray-600" />
              <div>
                <span className="font-medium text-gray-700">Category:</span>
                <p className="text-gray-600">{businessData.category || "Business Media/IT"}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2 md:col-span-2">
              <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <span className="font-medium text-gray-700">Address:</span>
                <p className="text-gray-600">{getFullAddress() || "23/A, Mohammadpur 1st, Road 7 House 12, Mohammadpur, Dhaka, 1207, Bangladesh"}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-gray-600" />
              <div>
                <span className="font-medium text-gray-700">Phone:</span>
                <p className="text-gray-600">{businessData.mobile || "+880 1712345678"}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-gray-600" />
              <div>
                <span className="font-medium text-gray-700">Website:</span>
                <p className="text-blue-600 hover:underline cursor-pointer">{businessData.website || "https://www.kagoz.com"}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Facebook className="w-5 h-5 text-gray-600" />
              <div>
                <span className="font-medium text-gray-700">Facebook:</span>
                <p className="text-blue-600 hover:underline cursor-pointer">{businessData.facebook || "https://facebook.com/kagoz.com"}</p>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
            </div>
            <div className="space-y-2">
              {(() => {
                const hoursDisplay = getBusinessHoursDisplay()
                if (hoursDisplay.length === 0 || (hoursDisplay.length === 1 && hoursDisplay[0] === "Open 24/7")) {
                  return (
                    <>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-700">Monday:</span>
                        <span className="text-gray-600">9:00 AM - 1:00 PM, 2:00 PM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-700">Tuesday:</span>
                        <span className="text-gray-600">9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-700">Wednesday:</span>
                        <span className="text-gray-600">9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-700">Thursday:</span>
                        <span className="text-gray-600">9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-700">Friday:</span>
                        <span className="text-red-600 font-medium">Closed</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-700">Saturday:</span>
                        <span className="text-gray-600">9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-700">Sunday:</span>
                        <span className="text-gray-600">9:00 AM - 6:00 PM</span>
                      </div>
                    </>
                  )
                }
                return hoursDisplay.map((hours, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <span className="text-gray-700">{hours.split(':')[0]}:</span>
                    <span className={hours.includes('Closed') ? 'text-red-600 font-medium' : 'text-gray-600'}>
                      {hours.split(':')[1]}
                    </span>
                  </div>
                ))
              })()}
              {businessData.closedOnHolidays && (
                <div className="mt-4 p-3 bg-orange-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-red-600" />
                    <span className="text-orange-800 text-sm">Closed on public holidays</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Verified License */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Verified License</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                    <span className="text-gray-400 text-sm">ID Card/Certificate</span>
                  </div>
                  <div className="aspect-video bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Business License</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Business Gallery */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Camera className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Business Gallery</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
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

        {/* Progress and Action Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-lg font-semibold text-gray-900">95% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: "95%" }}></div>
          </div>
          <p className="text-gray-600 mb-8">Almost there! Add more details to improve visibility.</p>
          
          <div className="flex flex-col items-center space-y-4">
            <Button className="bg-[#6F00FF] hover:bg-purple-700 text-white px-8 py-3 rounded-lg">
              Publish My Business Listing
            </Button>
            <p className="text-sm text-gray-500">7 views today</p>
          </div>
        </div>
      </div>
    </div>
  )
}
