"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"
import FileUploader from "@/components/bizness/file-upload"
import { useAddBannerMutation, useUpdateBusinessMutation, useUploadPhotoMutation } from "@/redux/api/business"
import { useParams } from "next/navigation"
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
  onSubmit?: () => void
}

export default function MediaBrandingStep({ data, onUpdate, onBack, onSubmit }: MediaBrandingStepProps) {
  const [formData, setFormData] = useState<MediaBrandingData>(data)
  const [errors, setErrors] = useState<{ logo?: string }>({})
  const [updateBusiness] = useUpdateBusinessMutation()
  const [addBanner] = useAddBannerMutation()
  const [uploadPhoto] = useUploadPhotoMutation()
  const params = useParams() as { slug?: string }
  const slug = (params?.slug as string) || ""

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

  const handleSubmit = async () => {
    if (!validateForm()) return
    try {
      if (formData.logo?.file) {
        const fd = new FormData()
        fd.append('logo', formData.logo.file)
        await updateBusiness({ slug, data: fd }).unwrap()
      }
      if (formData.banner?.file) {
        const fd = new FormData()
        fd.append('banner', formData.banner.file)
        await addBanner({ slug, data: fd }).unwrap()
      }
      if (formData.gallery && formData.gallery.length) {
        for (const g of formData.gallery) {
          if (g.file) {
            const fd = new FormData()
            fd.append('image', g.file)
            await uploadPhoto({ slug, data: fd }).unwrap()
          }
        }
      }
      onSubmit?.()
    } catch (e) {
      console.error('Failed to upload media', e)
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

     
       <div className="flex lg:flex-row flex-col gap-10 lg:w-1/2 w-full mx-auto">
        <button
          onClick={onBack}
          className="!px-20 !py-3 cursor-pointer border-blue-600 text-white lg:whitespace-pre whitespace-normal bg-[#163987]  rounded-lg"
        >
          Save & Back to Businesses
        </button>
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
