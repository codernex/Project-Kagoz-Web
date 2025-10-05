"use client"

import React, { useState, useCallback } from "react"
import { Camera } from "lucide-react"
import { ImageUpload, type ImageUploadFile } from "@/components/bizness/image-uploader"
import { DateSelector } from "@/components/bizness/select-date"
import { 
  useGetPhotosQuery, 
  useAddLogoMutation,
  useAddBannerMutation,
  useUploadPhotoMutation,
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

  const [formData, setFormData] = useState<MediaBrandingData>(data)
  const [errors, setErrors] = useState<{ logo?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // API mutations
  const [addLogo] = useAddLogoMutation()
  const [addBanner] = useAddBannerMutation()
  const [uploadPhoto] = useUploadPhotoMutation()
  const [updateLicense] = useUpdateLicenseMutation()
  const [updateBusiness] = useUpdateBusinessMutation()
  
  const params = useParams() as { slug?: string }
  const slug = decodeURIComponent((params?.slug as string) || "").trim().toLowerCase().replace(/\s+/g, "-")
  
  const shouldFetchPhotos = !data.gallery || data.gallery.length === 0
  const { data: existingPhotos = [] } = useGetPhotosQuery(slug, { 
    skip: !shouldFetchPhotos || !slug 
  })

  // Convert existing photos to UploadedFile format
  const convertPhotoToUploadedFile = (photo: IPhoto): UploadedFile => ({
    id: `existing-${photo.id}`,
    file: null, // No file object for existing photos
    preview: photo.url.startsWith('http') 
      ? photo.url 
      : `http://localhost:9000/api/v1/uploads/${photo.url}`,
    name: `Photo ${photo.id}`,
    size: 'Existing'
  })

  // Convert UploadedFile to ImageUploadFile
  const convertToImageUploadFile = (uploadedFile: UploadedFile | null): ImageUploadFile[] => {
    if (!uploadedFile) return []
    let previewUrl = uploadedFile.preview;
    if (uploadedFile.preview && !uploadedFile.preview.startsWith('blob:') && !uploadedFile.preview.startsWith('http')) {
      previewUrl = `http://localhost:9000/api/v1/uploads/${uploadedFile.preview}`;
    }
    
    return [{
      id: uploadedFile.id,
      file: uploadedFile.file,
      preview: previewUrl,
      name: uploadedFile.name,
      size: uploadedFile.size,
      uploaded: !uploadedFile.file, // If no file object, it's already uploaded
    }]
  }

  // Convert ImageUploadFile to UploadedFile
  const convertFromImageUploadFile = (imageFiles: ImageUploadFile[]): UploadedFile | null => {
    if (imageFiles.length === 0) return null
    const imageFile = imageFiles[0]
    if (!imageFile) return null
    return {
      id: imageFile.id,
      file: imageFile.file,
      preview: imageFile.preview,
      name: imageFile.name,
      size: imageFile.size,
    }
  }

  // Convert array of ImageUploadFile to array of UploadedFile
  const convertArrayFromImageUploadFile = (imageFiles: ImageUploadFile[]): UploadedFile[] => {
    return imageFiles.map(imageFile => ({
      id: imageFile.id,
      file: imageFile.file,
      preview: imageFile.preview,
      name: imageFile.name,
      size: imageFile.size,
    }))
  }

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

  const handleLogoChange = (files: ImageUploadFile[]) => {
    const uploadedFile = convertFromImageUploadFile(files)
    const newData = { ...formData, logo: uploadedFile }
    setFormData(newData)
    onUpdate(newData) // Sync with parent
    
    // Clear error when file is selected
    if (errors.logo) {
      setErrors({})
    }
  }

  const handleBannerChange = (files: ImageUploadFile[]) => {
    const uploadedFile = convertFromImageUploadFile(files)
    const newData = { ...formData, banner: uploadedFile }
    setFormData(newData)
    onUpdate(newData) // Sync with parent
  }

  const handleGalleryChange = (files: ImageUploadFile[]) => {
    const uploadedFiles = convertArrayFromImageUploadFile(files)
    const newData = { ...formData, gallery: uploadedFiles }
    setFormData(newData)
    onUpdate(newData) // Sync with parent
  }

  const handleTradeLicenseChange = (files: ImageUploadFile[]) => {
    const uploadedFile = convertFromImageUploadFile(files)
    const newData = { ...formData, tradeLicense: uploadedFile }
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
      // 1. Update logo if it's a new file
      if (formData.logo?.file && slug) {
        const logoFormData = new FormData()
        logoFormData.append('logo', formData.logo.file)
        await addLogo({ slug, data: logoFormData }).unwrap()
      }
      
      // 2. Update banner if it's a new file
      if (formData.banner?.file && slug) {
        const bannerFormData = new FormData()
        bannerFormData.append('banner', formData.banner.file)
        await addBanner({ slug, data: bannerFormData }).unwrap()
      }
      
      // 3. Upload gallery photos if there are new files
      const newGalleryFiles = formData.gallery?.filter(item => item.file) || []
      if (newGalleryFiles.length > 0 && slug) {
        // Upload each photo individually using the single photo API
        for (const galleryFile of newGalleryFiles) {
          if (galleryFile.file) {
            const formData = new FormData()
            formData.append('image', galleryFile.file)
            await uploadPhoto({ slug, data: formData }).unwrap()
          }
        }
      }
      
      // 4. Update trade license if it's a new file
      if (formData.tradeLicense?.file && slug) {
        const licenseFormData = new FormData()
        licenseFormData.append('tradeLicense', formData.tradeLicense.file)
        await updateLicense({ slug, data: licenseFormData }).unwrap()
      }
      
      // 5. Update trade license expire date if it exists
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
        
          <Camera className="w-[24px] h-[24px] text-[#9333EA]" />
      
        <h3 className="auth-heading !font-medium text-[#111827]">Media & Business Branding</h3>
      </div>
      <p className="text-[#2D3643] Subheading !text-start mb-6">Add Visuals to Represent Your Business</p>

      <div className="space-y-6">
        {/* Business Logo */}
        <ImageUpload
          label="Business Logo"
          description="Logo for your business profile"
          required={true}
          max={1}
          maxSizeMB={10}
          acceptedTypes={["image/png", "image/jpeg", "image/jpg", "image/webp"]}
          recommendedSize="500×500 px"
          value={convertToImageUploadFile(formData.logo)}
          onChange={handleLogoChange}
          onError={handleError}
        />

        {/* Banner Image */}
        <ImageUpload
          label="Banner Image"
          description="Banner image for your business profile"
          max={1}
          maxSizeMB={10}
          acceptedTypes={["image/png", "image/jpeg", "image/jpg", "image/webp"]}
          recommendedSize="1200×500 px"
          value={convertToImageUploadFile(formData.banner)}
          onChange={handleBannerChange}
          onError={handleError}
        />

     

        {/* Trade License File */}
        <ImageUpload
          label="Trade License"
          description="Upload your trade license document"
          max={1}
          maxSizeMB={10}
          acceptedTypes={["image/png", "image/jpeg", "image/jpg", "image/webp"]}
          recommendedSize="A4 document"
          value={convertToImageUploadFile(formData.tradeLicense)}
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
           <ImageUpload
          label="Business Gallery"
          description="Add gallery images to showcase your business"
          max={5}
          maxSizeMB={10}
          acceptedTypes={["image/png"]}
          recommendedSize="800×600 px"
          value={formData.gallery.map(file => {
            console.log("🚀 ~ MediaBrandingStep ~ file:", file)
            let previewUrl = file.preview;
            if (file.preview && !file.preview.startsWith('blob:') && !file.preview.startsWith('http')) {
              previewUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api/v1"}/uploads/${file.preview}`;
            }
            
            const imageUploadFile = {
              id: file.id,
              file: file.file,
              preview: previewUrl,
              name: file?.name,
              size: file.size,
              uploaded: !file.file, // If no file object, it's already uploaded
            };
            return imageUploadFile;
          })}
          onChange={handleGalleryChange}
          onError={handleError}
          disableRemove={true}
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
