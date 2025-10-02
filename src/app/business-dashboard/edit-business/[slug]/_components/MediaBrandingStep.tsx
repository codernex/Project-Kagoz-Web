"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera } from "lucide-react"
import FileUploader from "@/components/bizness/file-upload"
import { DateSelector } from "@/components/bizness/select-date"
import { useAddBannerMutation, useUpdateBusinessMutation, useUploadPhotoMutation, useUpdateBusinessMediaMutation, useGetPhotosQuery, useUploadMultiplePhotosMutation } from "@/redux/api/business"
import { useParams } from "next/navigation"
// import FileUploader from "@/components/ui/file-upload"

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
  gallery: UploadedFile[]
  tradeLicense: UploadedFile | null
  tradeLicenseExpireDate: string
}

interface MediaBrandingStepProps {
  data: MediaBrandingData
  onUpdate: (data: MediaBrandingData) => void
  onBack: () => void
  onSubmit?: () => void
}

// Custom DateSelector with initial values
interface TradeLicenseDateSelectorProps {
  label: string
  name: string
  required?: boolean
  initialDate: { year: string; month: string; day: string }
  onChange: (date: { year: string; month: string; day: string }) => void
}

function TradeLicenseDateSelector({ label, name, required, initialDate, onChange }: TradeLicenseDateSelectorProps) {
  const [year, setYear] = useState(initialDate.year)
  const [month, setMonth] = useState(initialDate.month)
  const [day, setDay] = useState(initialDate.day)

  // Debug logging
  console.log("🔍 DateSelector Initial Values:", {
    initialDate,
    year,
    month,
    day
  })

  const years = Array.from({ length: 50 }, (_, i) => `${2000 + i}`)
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ]
  const days = Array.from({ length: 31 }, (_, i) => `${i + 1}`)

  const handleChange = (field: 'year' | 'month' | 'day', value: string) => {
    if (field === 'year') setYear(value)
    if (field === 'month') setMonth(value)
    if (field === 'day') setDay(value)
    
    // Call onChange with updated values
    const updatedDate = {
      year: field === 'year' ? value : year,
      month: field === 'month' ? value : month,
      day: field === 'day' ? value : day
    }
    onChange(updatedDate)
  }

  return (
    <div className="space-y-2">
      <Label className="text-[#23272E] font-medium text-[16px]">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="flex gap-4 mt-1">
        <Select value={year} onValueChange={(value) => handleChange('year', value)}>
          <SelectTrigger className="w-[120px] h-[48px] border border-[#E5E7EB] rounded-[8px] bg-white text-[#23272E] px-4 focus:border-[#23272E] focus:ring-2 focus:ring-[#23272E]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y} className="text-[#23272E]">
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={month} onValueChange={(value) => handleChange('month', value)}>
          <SelectTrigger className="w-[120px] h-[48px] border border-[#E5E7EB] rounded-[8px] bg-white text-[#23272E] px-4 focus:border-[#23272E] focus:ring-2 focus:ring-[#23272E]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m, index) => (
              <SelectItem key={m} value={(index + 1).toString().padStart(2, '0')} className="text-[#23272E]">
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={day} onValueChange={(value) => handleChange('day', value)}>
          <SelectTrigger className="w-[120px] h-[48px] border border-[#E5E7EB] rounded-[8px] bg-white text-[#23272E] px-4 focus:border-[#23272E] focus:ring-2 focus:ring-[#23272E]">
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent>
            {days.map((d) => (
              <SelectItem key={d} value={d} className="text-[#23272E]">
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default function MediaBrandingStep({ data, onUpdate, onBack, onSubmit }: MediaBrandingStepProps) {
  const [formData, setFormData] = useState<MediaBrandingData>(data)
  const [errors, setErrors] = useState<{ logo?: string }>({})
  const [updateBusiness] = useUpdateBusinessMutation()
  const [updateBusinessMedia] = useUpdateBusinessMediaMutation()
  const [addBanner] = useAddBannerMutation()
  const [uploadPhoto] = useUploadPhotoMutation()
  const [uploadMultiplePhotos] = useUploadMultiplePhotosMutation()
  const params = useParams() as { slug?: string }
  const slug = decodeURIComponent((params?.slug as string) || "").trim().toLowerCase().replace(/\s+/g, "-")
  
  // Get existing gallery photos
  const { data: existingPhotos = [] } = useGetPhotosQuery(slug)

  // Convert existing photos to UploadedFile format
  const convertPhotoToUploadedFile = (photo: IPhoto): UploadedFile => ({
    id: `existing-${photo.id}`,
    file: null, // No file object for existing photos
    preview: photo.url,
    name: `Photo ${photo.id}`,
    size: 'Existing'
  })

  // Update formData when data prop changes (from API response)
  React.useEffect(() => {
    setFormData(data)
  }, [data])

  // Set existing photos in gallery when they are loaded
  React.useEffect(() => {
    if (existingPhotos.length > 0) {
      const existingGalleryFiles = existingPhotos.map(convertPhotoToUploadedFile)
      const newData = { ...formData, gallery: existingGalleryFiles }
      setFormData(newData)
      onUpdate(newData)
    }
  }, [existingPhotos])

  // Parse existing date for DateSelector
  const parseDate = (dateString: string) => {
    if (!dateString) return { year: "", month: "", day: "" }
    
    // Handle both "YYYY-MM-DD" format and other date formats
    let date: Date
    if (dateString.includes('-')) {
      // Handle "YYYY-MM-DD" format
      const [year, month, day] = dateString.split('-')
      date = new Date(parseInt(year || '0'), parseInt(month || '1') - 1, parseInt(day || '1'))
    } else {
      // Handle other date formats
      date = new Date(dateString)
    }
    
    return {
      year: date.getFullYear().toString(),
      month: (date.getMonth() + 1).toString().padStart(2, '0'),
      day: date.getDate().toString() // Remove padding for day to match SelectItem values
    }
  }

  const initialDate = parseDate(formData.tradeLicenseExpireDate)
  
  // Debug logging
  console.log("🔍 Trade License Date Debug:", {
    originalDate: formData.tradeLicenseExpireDate,
    parsedDate: initialDate
  })

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
      // Create a single FormData object for logo and banner
      const fd = new FormData()
      
      // Add logo if present
      if (formData.logo?.file) {
        fd.append('logo', formData.logo.file)
      }
      
      // Add banner if present
      if (formData.banner?.file) {
        fd.append('banner', formData.banner.file)
      }
      
      // Send both logo and banner in a single request
      if (formData.logo?.file || formData.banner?.file) {
        await updateBusinessMedia({ slug, data: fd }).unwrap()
      }
      
      // Upload gallery images using multiple photos API
      if (formData.gallery && formData.gallery.length) {
        const filesToUpload = formData.gallery
          .filter(g => g.file)
          .map(g => g.file!)
        
        if (filesToUpload.length > 0) {
          await uploadMultiplePhotos({ slug, files: filesToUpload }).unwrap()
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
      

        {/* Trade License File */}
        <FileUploader
          label="Trade License"
          description="Upload your trade license document"
          max={1}
          maxSizeMB={10}
          recommendedSize="A4 document"
          value={formData.tradeLicense ? [formData.tradeLicense] : []}
          onChange={(files) => {
            const newData = { 
              ...formData, 
              tradeLicense: files[0] || null 
            }
            setFormData(newData)
            onUpdate(newData)
          }}
          onError={handleError}
        />

        {/* Trade License Expire Date */}
        <TradeLicenseDateSelector
          label="Trade License Expire Date"
          name="tradeLicenseExpireDate"
          required
          initialDate={initialDate}
          onChange={(date) => {
            const dateString = `${date.year}-${date.month.padStart(2, '0')}-${date.day.padStart(2, '0')}`
            const newData = { ...formData, tradeLicenseExpireDate: dateString }
            setFormData(newData)
            onUpdate(newData)
          }}
        />
          <FileUploader
          label="Business Gallery"
          description="Add gallery images"
          max={5}
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
