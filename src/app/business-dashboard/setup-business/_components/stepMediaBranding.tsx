"use client"

import { useState } from "react"
import type { BusinessData } from "./businessSetup"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Building2, Camera, Clock, Star } from "lucide-react"
import { JSX } from "react"
import FileUploader from "@/components/bizness/file-upload"
// import FileUploader from "@/components/ui/file-upload"
// import BusinessStartDate from "@/components/ui/date-selector"

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

interface StepProps {
  businessData: BusinessData
  updateBusinessData: (field: string, value: any) => void
  onPrev: () => void
  onNext: () => void
  isNextDisabled?: boolean
}

export function StepMediaBranding({ businessData, updateBusinessData, onPrev, onNext, isNextDisabled }: StepProps) {
  const [formData, setFormData] = useState<MediaBrandingData>({
    logo: null,
    banner: null,
    license: [],
    gallery: []
  })
  
  const [errors, setErrors] = useState<{ 
    logo?: string
    banner?: string
    license?: string
    gallery?: string
  }>({})

  const handleLogoChange = (files: UploadedFile[]) => {
    const newData = { ...formData, logo: files[0] || null }
    setFormData(newData)
    updateBusinessData('mediaBranding', newData)
    
    if (errors.logo) {
      setErrors(prev => ({ ...prev, logo: undefined }))
    }
  }

  const handleBannerChange = (files: UploadedFile[]) => {
    const newData = { ...formData, banner: files[0] || null }
    setFormData(newData)
    updateBusinessData('mediaBranding', newData)
    
    if (errors.banner) {
      setErrors(prev => ({ ...prev, banner: undefined }))
    }
  }

  const handleLicenseChange = (files: UploadedFile[]) => {
    const newData = { ...formData, license: files }
    setFormData(newData)
    updateBusinessData('mediaBranding', newData)
    
    if (errors.license) {
      setErrors(prev => ({ ...prev, license: undefined }))
    }
  }

  const handleGalleryChange = (files: UploadedFile[]) => {
    const newData = { ...formData, gallery: files }
    setFormData(newData)
    updateBusinessData('mediaBranding', newData)
    
    if (errors.gallery) {
      setErrors(prev => ({ ...prev, gallery: undefined }))
    }
  }

  const handleError = (error: string, field: keyof MediaBrandingData) => {
    setErrors(prev => ({ ...prev, [field]: error }))
    console.error(`Error in ${field}:`, error)
  }

  const validateForm = () => {
    const newErrors: { 
      logo?: string
      banner?: string
      license?: string
      gallery?: string
    } = {}
    
    if (!formData.logo) {
      newErrors.logo = "Business logo is required"
    }

    if (formData.license.length === 0) {
      newErrors.license = "At least one business license is required"
    }

    if (formData.gallery.length === 0) {
      newErrors.gallery = "At least one gallery image is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Form is valid, proceeding...")
    } else {
      console.log("Form has errors:", errors)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <Camera className="w-[16px] h-[16px] text-[#6F00FF]" />
            <h2 className="auth-heading !font-medium text-[#111827]">Media & Business Branding</h2>
          </div>
          <p className="text-[#2D3643] mb-6">Add Visuals to Represent Your Business</p>

          <div className="space-y-8">
            {/* Business Logo */}
            <div>
              <FileUploader
                label="Business Logo"
                description="Logo for your business profile"
                required={true}
                max={1}
                maxSizeMB={10}
                recommendedSize="500x500 px"
                value={formData.logo ? [formData.logo] : []}
                onChange={handleLogoChange}
                onError={(error:any) => handleError(error, 'logo')}
              />
              {errors.logo && (
                <p className="text-red-500 text-sm mt-1">{errors.logo}</p>
              )}
            </div>

            {/* Banner Image */}
            <div>
              <FileUploader
                label="Banner Image"
                description="Banner image for your business profile"
                max={1}
                maxSizeMB={10}
                recommendedSize="1200x500 px"
                value={formData.banner ? [formData.banner] : []}
                onChange={handleBannerChange}
                onError={(error:any) => handleError(error, 'banner')}
              />
              {errors.banner && (
                <p className="text-red-500 text-sm mt-1">{errors.banner}</p>
              )}
            </div>

            {/* Business License */}
            <div>
              <Label className="text-sm font-medium">Verified License</Label>
              <p className="text-xs text-gray-500 mb-3">Upload your business license</p>
              
          

              {/* Document Upload */}
              <div className="mb-3">
                <Label className="text-sm font-medium text-gray-700">Document</Label>
              </div>
              <FileUploader
                label=""
                description=""
                required={true}
                max={2}
                maxSizeMB={10}
                recommendedSize="1200x800 px"
                value={formData.license}
                onChange={handleLicenseChange}
                onError={(error) => handleError(error, 'license')}
              />
              {errors.license && (
                <p className="text-red-500 text-sm mt-1">{errors.license}</p>
              )}
            </div>

            {/* Business Starting Date */}
            {/* <div>
              <BusinessStartDate
                id="startingDate"
                label="Business Starting Date"
                required
                value={
                  typeof businessData.startingDate === "string"
                    ? { year: "", month: "", day: "" }
                    : businessData.startingDate
                }
                onChange={e => updateBusinessData("startingDate", e)}
              />
            </div> */}

            {/* Business Gallery */}
            <div>
              <FileUploader
                label="Business Gallery"
                description="Add gallery images"
                required={true}
                max={5}
                maxSizeMB={10}
                recommendedSize="800x600 px"
                value={formData.gallery}
                onChange={handleGalleryChange}
                onError={(error) => handleError(error, 'gallery')}
              />
              {errors.gallery && (
                <p className="text-red-500 text-sm mt-1">{errors.gallery}</p>
              )}

              {/* Gallery Upload Status */}
              {formData.gallery.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  {formData.gallery.length}/5 images uploaded
                </div>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 my-8 w-1/2">
            <button
              onClick={onPrev}
              className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg !px-10 y-2"
            >
              <span>Previous</span>
            </button>
            <button
              onClick={onNext}
              disabled={!!isNextDisabled}
              className={`flex items-center w-full space-x-2 rounded-lg px-6 py-2 ${
                isNextDisabled ? "bg-gray-400 cursor-not-allowed text-white" : "bg-[#6F00FF] hover:bg-purple-700 text-white"
              }`}
            >
              <span>Next</span>
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className=" border p-6 rounded-2xl">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-[#6F00FF] rounded-full"></div>
            <h3 className="font-semibold">Business Card Preview</h3>
          </div>
          <div className="w-full  border-0 ">
            <div className="p-0">
              {/* Banner Image */}
              <div className="h-30 bg-gray-200 rounded-t-lg relative overflow-hidden">
                {formData.banner && (
                  <img 
                    src={formData.banner.preview} 
                    alt="Banner"
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                )}
              </div>
              
              {/* Company Information Box */}
              <div className="bg-gradient-to-r from-[#F0FDFA] to-[#FAF5FF] border p-2 border-[#CCFBF1] rounded-b-[12px]">
                <div className="flex items-start space-x-3">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    {formData.logo ? (
                      <img 
                        src={formData.logo.preview} 
                        alt="Logo"
                        className="w-12 h-12 rounded-full object-cover border-2 border-red-500"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-[#6F00FF] rounded-full flex items-center justify-center border-2 border-red-500">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Company Details */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{businessData.name || "Kagoz.com"}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {businessData.tagline || "KAGOZ stands out by offering both free and premium listing options to cater to the diverse needs of businesses."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Verified License Preview */}
          <div className="mt-6">
            <h4 className="font-semibold text-sm mb-3 text-gray-900">Verified License</h4>
            <div className="grid grid-cols-2 gap-2">
              {formData.license.length > 0 ? (
                formData.license.slice(0, 2).map((file, index) => (
                  <div key={file.id} className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img 
                      src={file.preview} 
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              ) : (
                Array.from({ length: 2 }, (_, i) => (
                  <div key={i} className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                    <Camera className="w-4 h-4 text-gray-400" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Business Gallery Preview */}
          <div className="mt-6">
            <h4 className="font-semibold text-sm mb-3 text-gray-900 flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Business Gallery
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {formData.gallery.length > 0 ? (
                formData.gallery.map((file, index) => (
                  <div 
                    key={file.id} 
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative ${
                      index >= 3 ? 'col-span-1' : ''
                    }`}
                  >
                    <img 
                      src={file.preview} 
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              ) : (
                Array.from({ length: 5 }, (_, i) => (
                  <div 
                    key={i} 
                    className={`aspect-square bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 ${
                      i >= 3 ? 'col-span-1' : ''
                    }`}
                  >
                    <Camera className="w-4 h-4 text-gray-400" />
                  </div>
                ))
              )}
            </div>
            {formData.gallery.length > 0 && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                {formData.gallery.length}/5 uploaded
              </p>
            )}
          </div>

          {/* Profile Completion Status */}
          <div className="mt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Business Logo</span>
                {formData.logo ? (
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Banner Image</span>
                {formData.banner ? (
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Gallery Images</span>
                {formData.gallery.length > 0 ? (
                  <span className="text-sm text-gray-700">{formData.gallery.length}/5 uploaded</span>
                ) : (
                  <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                )}
              </div>
            </div>
          </div>

          {/* Call to Action Box */}
          <div className="mt-6 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
            <p className="text-xs text-purple-700">
              Update your business card with logos, banners, and images instantly, giving you a sense of progress and ownership.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}