"use client"

import type { BusinessData } from "./businessSetup"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Calendar,
  Star,
  MapPin,
  Phone,
  Globe,
  Facebook,
  Clock,
  Leaf,
} from "lucide-react"
import { useGetCategoriesQuery } from "@/redux/api/category"
import { useMemo } from "react"

interface BusinessPreviewProps {
  businessData: BusinessData
  stepIndex: number
}

export function BusinessPreview({ businessData, stepIndex }: BusinessPreviewProps) {
  const { data: categories } = useGetCategoriesQuery()
  const categoryLabel = useMemo(() => {
    const raw = (businessData as any)?.category
    if (!raw) return "Not specified"
    const str = String(raw)
    const match = (categories || []).find((c: any) => String(c?.id ?? c?._id ?? c?.slug) === str)
      || (categories || []).find((c: any) => String(c?.slug ?? c?.name) === str)
    return match?.name ?? match?.slug ?? str
  }, [categories, (businessData as any)?.category])
  return (
    <div className="w-full border border-[#E4E4E4] rounded-2xl">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-4">
              <div className="w-[8px] h-[8px] bg-[#6F00FF] rounded-full"></div>
              <h3 className="font-semibold text-[#111827]">Business Preview</h3>
            </div>
        <div className="flex items-center space-x-3 mb-4 bg-gradient-to-r border border-[#CCFBF1] rounded-[12px] px-4 py-[20px] from-[#F0FDFA] to-[#FAF5FF]">
            <div className="h-[64px] w-[64px] basis-[64px] shrink-0 bg-[#6F00FF] rounded-[8px] flex items-center justify-center">
              <Building2 className="h-[32px] w-[32px] text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{businessData?.name || "Business Name"}</h3>
            <p className="text-xs text-gray-600 break-words">{businessData?.tagLine || "Business tagline"}</p>
          </div>
        </div>

        <div className="space-y-6 text-xs">
          <div className="flex items-start space-x-2">
            <Building2 className="h-[16px] w-[16px] text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium">About</p>
              <p className="text-gray-600 line-clamp-3" dangerouslySetInnerHTML={
                {__html: businessData.about || "Business description will appear here"}
              }></p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="h-[16px] w-[16px] text-gray-400" />
            <div>
              <p className="font-medium">Starting Date</p>
              <p className="text-gray-600">
                {(() => {
                  if (typeof businessData.startingDate === 'object' && businessData.startingDate !== null) {
                    const date = businessData.startingDate as { year?: string; month?: string; day?: string }
                    if (date.year && date.month && date.day) {
                      return `${date.year}-${date.month}-${date.day}`
                    }
                  } else if (typeof businessData.startingDate === 'string' && businessData.startingDate !== '') {
                    return businessData.startingDate
                  }
                  return "Not specified"
                })()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Star className="h-[16px] w-[16px] text-gray-400" />
            <div>
              <p className="font-medium">Category</p>
              <p className="text-gray-600">{categoryLabel}</p>
            </div>
          </div>

          {stepIndex >= 1 && (
            <>
              <div className="flex items-start space-x-2">
                <MapPin className="h-[16px] w-[16px] text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-gray-600">
                    {(() => {
                      const parts = [
                        businessData.streetAddress,
                        businessData.houseInfo,
                        businessData.localArea,
                        businessData.city,
                        businessData.postalCode,
                        businessData.country,
                      ].filter(Boolean)
                      return parts.length > 0 ? parts.join(", ") : "Address not provided"
                    })()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="h-[16px] w-[16px] text-gray-400" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-gray-600">{businessData.mobile || "Not provided"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Globe className="h-[16px] w-[16px] text-gray-400" />
                <div>
                  <p className="font-medium">Website</p>
                  <p className="text-blue-600">{businessData.website || "Not provided"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Facebook className="h-[16px] w-[16px] text-gray-400" />
                <div>
                  <p className="font-medium">Facebook</p>
                  <p className="text-blue-600">{businessData.facebook || "Not provided"}</p>
                </div>
              </div>
            </>
          )}

          {stepIndex >= 2 && (
            <div className="flex items-start space-x-2">
              <Clock className="h-[16px] w-[16px] text-gray-400 mt-0.5" />
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
                        <Leaf className="h-[16px] w-[16px]" />
                            <Leaf className="h-[16px] w-[16px]" />
                        Closed on public holidays
                      </Badge>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {(() => {
                      const hasOpenDays = Object.values(businessData.businessHours).some((hours) => hours.isOpen)
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
          This preview shows how your business {stepIndex < 1 ? "information will appear" : stepIndex < 2 ? "location and contact information will appear" : stepIndex < 3 ? "hours will appear" : "information will appear"} to
          customers. Make sure all {stepIndex < 1 ? "details" : stepIndex < 2 ? "details" : stepIndex < 3 ? "times" : "details"} are accurate.
        </div>
      </div>
    </div>
  )
}


