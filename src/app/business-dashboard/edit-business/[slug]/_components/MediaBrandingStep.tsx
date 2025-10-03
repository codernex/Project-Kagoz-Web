"use client"

import React, { useState, useCallback } from "react"
import { Camera } from "lucide-react"
import FileUploader from "@/components/bizness/file-upload"
import { DateSelector } from "@/components/bizness/select-date"
import { 
  useGetPhotosQuery, 
  useUpdateBusinessMediaMutation,
  useUploadMultiplePhotosMutation,
  useUpdateLicenseMutation,
  useUpdateBusinessMutation
} from "@/redux/api/business"
import { useParams } from "next/navigation"
import { toast } from "sonner"


interface MediaBrandingStepProps {
  data: MediaBrandingData
  onUpdate: (data: MediaBrandingData) => void
  onBack: () => void
  onSubmit?: () => void
}


export default function MediaBrandingStep({ data, onUpdate, onBack, onSubmit }: MediaBrandingStepProps) {
  console.log("🚀 ~ MediaBrandingStep ~ 23421data:", data)
  const [formData, setFormData] = useState<MediaBrandingData>(data)
  const [errors, setErrors] = useState<{ logo?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // API mutations
  const [updateBusinessMedia] = useUpdateBusinessMediaMutation()
  const [uploadMultiplePhotos] = useUploadMultiplePhotosMutation()
  const [updateLicense] = useUpdateLicenseMutation()
  const [updateBusiness] = useUpdateBusinessMutation()
  
  const params = useParams() as { slug?: string }
  const slug = decodeURIComponent((params?.slug as string) || "").trim().toLowerCase().replace(/\s+/g, "-")
  
  // Get existing gallery photos - only fetch if we don't have gallery data yet
  const shouldFetchPhotos = !data.gallery || data.gallery.length === 0
  const { data: existingPhotos = [] } = useGetPhotosQuery(slug, { 
    skip: !shouldFetchPhotos || !slug 
  })

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

  // Set existing photos in gallery when they are loaded (only once)
  React.useEffect(() => {
    if (existingPhotos.length > 0 && (!formData.gallery || formData.gallery.length === 0)) {
      const existingGalleryFiles = existingPhotos.map(convertPhotoToUploadedFile)
      const newData = { ...formData, gallery: existingGalleryFiles }
      setFormData(newData)
    }
  }, [existingPhotos, formData.gallery])

  // Parse existing date for DateSelector
  const parseDate = (dateString: string) => {
    if (!dateString) return { year: "", month: "", day: "" }
    
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ]
    
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
      month: monthNames[date.getMonth()] || "", // Return month name instead of number
      day: date.getDate().toString()
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
    onUpdate(newData) // Sync with parent
    
    // Clear error when file is selected
    if (errors.logo) {
      setErrors({})
    }
  }

  const handleBannerChange = (files: UploadedFile[]) => {
    const newData = { ...formData, banner: files[0] || null }
    setFormData(newData)
    onUpdate(newData) // Sync with parent
  }

  const handleGalleryChange = (files: UploadedFile[]) => {
    const newData = { ...formData, gallery: files }
    setFormData(newData)
    onUpdate(newData) // Sync with parent
  }

  const handleTradeLicenseChange = (files: UploadedFile[]) => {
    const newData = { ...formData, tradeLicense: files[0] || null }
    setFormData(newData)
    onUpdate(newData) // Sync with parent
  }

  const handleTradeLicenseDateChange = (date: any) => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ]
    const monthNumber = monthNames.indexOf(date.month) + 1
    const dateString = `${date.year}-${monthNumber.toString().padStart(2, '0')}-${date.day.padStart(2, '0')}`
    const newData = { ...formData, tradeLicenseExpireDate: dateString }
    setFormData(newData)
    onUpdate(newData) // Sync with parent
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
    
    setIsSubmitting(true)
    
    try {
      // 1. Update logo and banner if they are new files
      if ((formData.logo?.file || formData.banner?.file) && slug) {
        const mediaFormData = new FormData()
        
        if (formData.logo?.file) {
          mediaFormData.append('logo', formData.logo.file)
        }
        if (formData.banner?.file) {
          mediaFormData.append('banner', formData.banner.file)
        }
        
        await updateBusinessMedia({ slug, data: mediaFormData }).unwrap()
      }
      
      // 2. Upload gallery photos if there are new files
      const newGalleryFiles = formData.gallery?.filter(item => item.file) || []
      if (newGalleryFiles.length > 0 && slug) {
        const galleryFiles = newGalleryFiles.map(item => item.file!).filter(Boolean)
        if (galleryFiles.length > 0) {
          await uploadMultiplePhotos({ slug, files: galleryFiles }).unwrap()
        }
      }
      
      // 3. Update trade license if it's a new file
      if (formData.tradeLicense?.file && slug) {
        const licenseFormData = new FormData()
        licenseFormData.append('tradeLicense', formData.tradeLicense.file)
        await updateLicense({ slug, data: licenseFormData }).unwrap()
      }
      
      // 4. Update trade license expire date if it exists
      if (formData.tradeLicenseExpireDate && slug) {
        await updateBusiness({ 
          slug, 
          data: { tradeLicenseExpireDate: formData.tradeLicenseExpireDate }
        }).unwrap()
      }
      
      toast.success("Media and branding updated successfully!")
      
      // Call parent's submit callback if provided
      onSubmit?.()
      
    } catch (error: any) {
      console.error("Error updating media and branding:", error)
      toast.error(error?.data?.message || "Failed to update media and branding")
    } finally {
      setIsSubmitting(false)
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
          onChange={handleTradeLicenseChange}
          onError={handleError}
        />

        {/* Trade License Expire Date */}
        <DateSelector
          label="Trade License Expire Date"
          name="tradeLicenseExpireDate"
          required
          value={initialDate}
          onChange={useCallback(handleTradeLicenseDateChange, [formData])}
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
          disabled={isSubmitting}
          className="!px-20 !py-3 bg-[#6F00FF] cursor-pointer lg:whitespace-pre whitespace-normal text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save & Continue"}
        </button>
      </div>
    </div>
  )
}
