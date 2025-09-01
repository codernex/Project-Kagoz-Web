"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"
import FileUploader from "@/components/bizness/file-upload"
// import FileUploader from "@/components/ui/file-upload"

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
  gallery: UploadedFile[]
}

interface MediaBrandingStepProps {
  data: MediaBrandingData
  onUpdate: (data: MediaBrandingData) => void
  onBack: () => void
  onSubmit: () => void
}

export default function MediaBrandingStep({ data, onUpdate, onBack, onSubmit }: MediaBrandingStepProps) {
  const [formData, setFormData] = useState<MediaBrandingData>(data)
  const [errors, setErrors] = useState<{ logo?: string }>({})

  const handleLogoChange = (files: UploadedFile[]) => {
    const newData = { ...formData, logo: files[0] || null }
    setFormData(newData)
    onUpdate(newData)
    
    // Clear error when file is uploaded
    if (errors.logo) {
      setErrors({})
    }
  }

  const handleBannerChange = (files: UploadedFile[]) => {
    const newData = { ...formData, banner: files[0] || null }
    setFormData(newData)
    onUpdate(newData)
  }

  const handleGalleryChange = (files: UploadedFile[]) => {
    const newData = { ...formData, gallery: files }
    setFormData(newData)
    onUpdate(newData)
  }

  const handleError = (error: string) => {
    // You can show a toast notification here instead of alert
    alert(error)
  }

  const validateForm = () => {
    const newErrors: { logo?: string } = {}
    
    if (!formData.logo) {
      newErrors.logo = "Business logo is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        
          <Camera className="size-6 text-[#9333EA]" />
      
        <h3 className="auth-heading !font-medium text-[#111827]">Media & Business Branding</h3>
      </div>
      <p className="text-[#2D3643] Subheading !text-start mb-6">Add Visuals to Represent Your Business</p>

      <div className="space-y-6">
        {/* Business Logo */}
        <FileUploader
          label="Business Logo"
          description="Logo for your business profile"
          required={true}
          max={1}
          maxSizeMB={10}
          recommendedSize="500x500 px"
          value={formData.logo ? [formData.logo] : []}
          onChange={handleLogoChange}
          onError={handleError}
        />

        {/* Banner Image */}
        <FileUploader
          label="Banner Image"
          description="Banner image for your business profile"
          max={1}
          maxSizeMB={10}
          recommendedSize="1200x500 px"
          value={formData.banner ? [formData.banner] : []}
          onChange={handleBannerChange}
          onError={handleError}
        />

        {/* Business Gallery */}
        <FileUploader
          label="Business Gallery"
          description="Add gallery images"
          max={8}
          maxSizeMB={10}
          value={formData.gallery}
          onChange={handleGalleryChange}
          onError={handleError}
        />
      </div>

     
       <div className="flex gap-10 justify-center mx-auto">
        
        <button
          onClick={handleSubmit}
          className="!px-20 !py-3 bg-[#6F00FF] cursor-pointer lg:whitespace-pre whitespace-normal text-white rounded-lg"
        >
          Save & Continue
        </button>
      </div>
    </div>
  )
}
