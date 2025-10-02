"use client"

import React, { useState, useCallback } from "react"
import type { BusinessData } from "./businessSetup"
import { Label } from "@/components/ui/label"
import { Building2, Camera, ChevronLeft, Clock, Star } from "lucide-react"
import FileUploader from "@/components/bizness/file-upload"
import { DateSelector } from "@/components/bizness/select-date"
import { useParams } from "next/navigation"


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

interface StepProps {
  businessData: BusinessData
  setFormValue: (field: string, value: any) => void
  onPrev: () => void
  onNext: () => void
  isNextDisabled?: boolean
  businessSlug?: string | null
}

export function StepMediaBranding({ businessData, setFormValue, onPrev, onNext, isNextDisabled, businessSlug }: StepProps) {
  const { slug } = useParams() as { slug?: string }
  
  // Media files will be submitted in CompletionAndPublish component
  const [formData, setFormData] = useState<MediaBrandingData>(() => {
    // Initialize from businessData if available
    return businessData.mediaBranding || {
      logo: null,
      banner: null,
      license: [],
      gallery: []
    }
  })

  // Sync formData with businessData when navigating back
  React.useEffect(() => {
    if (businessData.mediaBranding) {
      setFormData(businessData.mediaBranding)
    }
  }, [businessData.mediaBranding])
  
  const [errors, setErrors] = useState<{ 
    logo?: string
    banner?: string
    license?: string
    gallery?: string
  }>({})

  const handleLogoChange = (files: UploadedFile[]) => {
    const newData = { ...formData, logo: files[0] || null }
    setFormData(newData)
    // setFormValue is handled by useEffect
    
    if (errors.logo) {
      setErrors(prev => ({ ...prev, logo: undefined }))
    }
  }

  const handleBannerChange = (files: UploadedFile[]) => {
    const newData = { ...formData, banner: files[0] || null }
    setFormData(newData)
    // setFormValue is handled by useEffect
    
    if (errors.banner) {
      setErrors(prev => ({ ...prev, banner: undefined }))
    }
  }

  const handleLicenseChange = (files: UploadedFile[]) => {
    const newData = { ...formData, license: files }
    setFormData(newData)
    // setFormValue is handled by useEffect
    
    if (errors.license) {
      setErrors(prev => ({ ...prev, license: undefined }))
    }
  }

  // Update parent state when form data changes - removed setFormValue from dependencies to avoid infinite loops
  React.useEffect(() => {
    setFormValue('mediaBranding', formData)
  }, [formData]) // Removed setFormValue from dependencies

  const handleGalleryChange = (files: UploadedFile[]) => {
    const newData = { ...formData, gallery: files }
    setFormData(newData)
    // setFormValue is handled by useEffect
    
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

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    // Update parent state with media branding data
    setFormValue('mediaBranding', formData)
    
    // Media files will be submitted in CompletionAndPublish component
    onNext()
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
                maxSizeMB={2}
                acceptedTypes={["image/png"]}
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
                maxSizeMB={2}
                acceptedTypes={["image/png"]}
                recommendedSize="1200x500 px"
                value={formData.banner ? [formData.banner] : []}
                onChange={handleBannerChange}
                onError={(error:any) => handleError(error, 'banner')}
              />
              {errors.banner && (
                <p className="text-red-500 text-sm mt-1">{errors.banner}</p>
              )}
            </div>

            <div className="">
                <Label className="text-sm font-medium text-[#111827]">Verified License</Label>
              <p className="text-xs text-gray-500 mb-3">Upload your business license</p>
              
            <DateSelector
          name="licenseIssueDate"
          required
          value={businessData.issueDate}
          onChange={useCallback((v: any) => setFormValue('issueDate', v), [setFormValue])}
        />
            </div>
            {/* Business License */}
            <div>
            
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
            <div className="flex gap-4 py-[32px] w-full">
              <button
                onClick={onPrev}
                className="flex items-center space-x-2 bg-white border justify-center border-gray-300  text-gray-700 hover:bg-gray-50 rounded-[8px] w-1/3 !px-10 y-2"
              >
                <ChevronLeft /><span>Previous</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={!!isNextDisabled}
                aria-disabled={!!isNextDisabled}
                className={`flex items-center justify-center w-full rounded-[8px] px-6 py-[10px] transition-colors ${
                  isNextDisabled
                    ? "bg-[#CDD1D8] text-white cursor-not-allowed"
                    : "bg-[#6F00FF] text-white hover:bg-[#6F00FF]"
                }`}
              >
                <span>Next</span>
              </button>
            </div>
        </div>
        
      </div>

      <div>
        <div className="bg-white border border-gray-200 p-6 rounded-2xl">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-[8px] h-[8px] bg-[#6F00FF] rounded-full"></div>
            <h3 className="font-semibold text-gray-900">Business Card Preview</h3>
          </div>
          
          {/* Business Card Preview */}
          <div className="w-full border-0">
            <div className="p-0">
              {/* Banner Image */}
              <div className="h-[128px] bg-gray-200 rounded-t-lg relative overflow-hidden">
                {formData.banner ? (
                  <img 
                    src={formData.banner.preview} 
                    alt="Banner"
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <div className="text-gray-400 text-sm">Banner Image</div>
                  </div>
                )}
              </div>
              
              {/* Company Information Box */}
              <div className="bg-gradient-to-t from-[#F0FDFA] to-[#FAF5FF] border border-gray-200 rounded-b-lg p-4 -mt-2 relative z-10">
                <div className="flex items-start space-x-3">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    {formData.logo ? (
                      <img 
                        src={formData.logo.preview} 
                        alt="Logo"
                        className="w-12 sm:w-[64px] h-12 sm:h-[64px] rounded-[8px] object-cover "
                      />
                    ) : (
                      <div className="w-12 sm:w-[64px] h-12 sm:h-[64px] bg-[#6F00FF] rounded-[8px] flex items-center justify-center ">
                        <Building2 className="w-[24px] h-[24px] text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Company Details */}
                  <div className="flex-1">
                    <h3 className="font-medium sm:text-[20px] text-[16px] text-gray-900">{businessData.name }</h3>
                    <p className="text-[14px] text-gray-600 mt-1">
                      {businessData.tagLine }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Verified License Preview */}
          {formData.license.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-sm mb-3 text-gray-900">Verified License</h4>
              <div className="grid grid-cols-2 gap-2">
                {formData.license.slice(0, 2).map((file, index) => (
                  <div key={file.id} className="aspect-video bg-gray-100 rounded-[8px] overflow-hidden border border-gray-200">
                    <img 
                      src={file.preview} 
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Business Gallery Preview */}
          {
            formData.gallery.length > 0 && (
              <div className="mt-6">
            <h4 className="font-semibold text-sm mb-3 text-gray-900 flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Business Gallery
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {formData.gallery.length > 0 ? (
                formData.gallery.slice(0, 4).map((file, index) => (
                  <div 
                    key={file.id} 
                    className={`aspect-square bg-gray-100 rounded-[8px] overflow-hidden border border-gray-200 ${
                      index === 3 ? 'col-span-1' : ''
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
                Array.from({ length: 4 }, (_, i) => (
                  <div 
                    key={i} 
                    className={`aspect-square bg-gray-100 rounded-[8px] flex items-center justify-center border border-gray-200 ${
                      i === 3 ? 'col-span-1' : ''
                    }`}
                  >
                    <Camera className="w-4 h-4 text-gray-400" />
                  </div>
                ))
              )}
            </div>
          </div>
            )
          }

          {/* Business Gallery Status */}
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
                  <span className="text-sm text-red-500">Required</span>
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
                  <span className="text-sm text-gray-500">Optional</span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">License Documents</span>
                {formData.license.length > 0 ? (
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  <span className="text-sm text-red-500">Required</span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Gallery Images</span>
                <span className="text-sm text-gray-700">{formData.gallery.length}/5 uploaded</span>
              </div>
            </div>
          </div>

          {/* Call to Action Box */}
          <div className="mt-6 p-3 bg-gray-50 rounded-[8px] border-l-4 border-[#6F00FF]">
            <p className="text-[14px] text-gray-700 mb-1">
              Update your business card with logos, banners, and images instantly, giving you a sense of progress and ownership.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}