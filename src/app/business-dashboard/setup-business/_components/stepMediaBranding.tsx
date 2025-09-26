"use client"

import React, { useState } from "react"
import type { BusinessData } from "./businessSetup"
import { Label } from "@/components/ui/label"
import { Building2, Camera, ChevronLeft, Clock, Star } from "lucide-react"
import FileUploader from "@/components/bizness/file-upload"
import { DateSelector } from "@/components/bizness/select-date"
import { useParams } from "next/navigation"
import { useAddBannerMutation, useUpdateBusinessMutation, useUploadPhotoMutation, useUpdateLicenseMutation, useUpdateBusinessMediaMutation } from "@/redux/api"


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
  const { slug } = useParams() as { slug?: string }
  const [formData, setFormData] = useState<MediaBrandingData>({
    logo: null,
    banner: null,
    license: [],
    gallery: []
  })
  const [saving, setSaving] = useState(false)
  const [addBanner] = useAddBannerMutation()
  const [updateBusiness] = useUpdateBusinessMutation()
  const [updateBusinessMedia] = useUpdateBusinessMediaMutation()
  const [uploadPhoto] = useUploadPhotoMutation()
  const [updateLicense] = useUpdateLicenseMutation()
  // Track last auto-sent license payload to avoid duplicate requests
  const [lastLicenseSentKey, setLastLicenseSentKey] = useState<string | null>(null)
  
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

  // Auto-upload trade license when both date and at least one file are present
  React.useEffect(() => {
    const targetSlug = (slug || (businessData as any)?.slug) as string | undefined
    const issue = (businessData as any)?.issueDate || { year: '', month: '', day: '' }
    const monthMap: Record<string, number> = {
      January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
      July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
    }
    const yearNum = Number.parseInt((issue?.year ?? '').toString(), 10)
    const monthRaw = (issue?.month ?? '').toString()
    const monthNum = monthMap[monthRaw as keyof typeof monthMap] ?? Number.parseInt(monthRaw, 10)
    const dayNum = Number.parseInt((issue?.day ?? '').toString(), 10)
    const isValidDateParts = Number.isFinite(yearNum) && Number.isFinite(monthNum) && Number.isFinite(dayNum)
      && yearNum > 1900 && monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31

    const firstLicense = formData.license?.[0]
    const key = isValidDateParts && firstLicense ? `${yearNum}-${monthNum}-${dayNum}|${firstLicense.id}` : null

    if (!targetSlug || !isValidDateParts || !firstLicense?.file) return
    if (key && key === lastLicenseSentKey) return

    const send = async () => {
      try {
        const ymd = `${String(yearNum).padStart(4, '0')}-${String(monthNum).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
        const licenseFd = new FormData()
        licenseFd.append('date', ymd as any)
        licenseFd.append('image', firstLicense.file as any)
        await updateLicense({ slug: targetSlug, data: licenseFd }).unwrap()
        setLastLicenseSentKey(key)
      } catch (_) {
        // swallow here; explicit error handling occurs on manual submit
      }
    }

    void send()
  }, [formData.license, businessData?.issueDate, slug, updateLicense, lastLicenseSentKey])

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

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const targetSlug = slug || (businessData as any)?.slug
    if (!targetSlug) { onNext(); return }

    try {
      setSaving(true)
      
      // Create a single FormData object for logo and banner
      const fd = new FormData()
      
      // Add logo if present
      if (formData.logo?.file) {
        fd.append('logo', formData.logo.file as any)
      }
      
      // Add banner if present
      if (formData.banner?.file) {
        fd.append('banner', formData.banner.file as any)
      }
      
      // Send both logo and banner in a single request
      if (formData.logo?.file || formData.banner?.file) {
        await updateBusinessMedia({ slug: targetSlug, data: fd }).unwrap()
      }

      // Upload first license file with date if present
      if (formData.license && formData.license.length > 0) {
        const licenseFd = new FormData()
        // Build date as YYYY-MM-DD, only if all parts are valid numbers
        const issue = (businessData as any)?.issueDate || { year: '', month: '', day: '' }
        const monthMap: Record<string, number> = {
          January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
          July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
        }
        const yearNum = Number.parseInt((issue?.year ?? '').toString(), 10)
        const monthRaw = (issue?.month ?? '').toString()
        const monthNum = monthMap[monthRaw as keyof typeof monthMap] ?? Number.parseInt(monthRaw, 10)
        const dayNum = Number.parseInt((issue?.day ?? '').toString(), 10)
        const isValidDateParts = Number.isFinite(yearNum) && Number.isFinite(monthNum) && Number.isFinite(dayNum)
          && yearNum > 1900 && monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31
        if (isValidDateParts) {
          const ymd = `${String(yearNum).padStart(4, '0')}-${String(monthNum).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
          licenseFd.append('date', ymd as any)
        }
        const firstLicense = formData.license[0] as UploadedFile
        if (firstLicense?.file) {
          licenseFd.append('image', firstLicense.file as any)
        }
        await updateLicense({ slug: targetSlug, data: licenseFd }).unwrap()
      }

      // Upload gallery images
      if (formData.gallery && formData.gallery.length) {
        for (const g of formData.gallery) {
          const galleryFd = new FormData()
          galleryFd.append('image', g.file as any)
          await uploadPhoto({ slug: targetSlug, data: galleryFd }).unwrap()
        }
      }

      onNext()
    } finally {
      setSaving(false)
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

            <div className="">
                <Label className="text-sm font-medium text-[#111827]">Verified License</Label>
              <p className="text-xs text-gray-500 mb-3">Upload your business license</p>
              
            <DateSelector
          name="licenseIssueDate"
          required
          onChange={(v) => updateBusinessData('issueDate', v)}
        />
            </div>
            {/* Business License */}
            <div>
            

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
                <span>{saving ? "Saving..." : "Next"}</span>
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
                      {businessData.tagline }
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