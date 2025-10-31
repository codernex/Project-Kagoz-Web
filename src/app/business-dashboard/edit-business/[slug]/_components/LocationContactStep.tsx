"use client"

import { useEffect, useState } from "react"
import { MapPin, Building, Phone, Globe, Facebook } from "lucide-react"
import { TextInput } from "@/components/shared/text-input"
import { useUpdateBusinessMutation } from "@/redux/api/business"
import { toast } from "sonner"
import { Form } from "@/components/ui/form"
import { useParams } from "next/navigation"

interface LocationContactData {
  streetAddress: string
  house: string
  localArea: string
  city: string
  postalCode: string
  country: string
  mobile: string
  website: string
  facebook: string
}

interface LocationContactStepProps {
  data: LocationContactData
  onUpdate: (data: LocationContactData) => void
  onNext: () => void
  onBack: () => void
  onSaveAndBack: () => void
  form: any
}

export default function LocationContactStep({
  data,
  onUpdate,
  onNext,
  onSaveAndBack,
  form,
}: LocationContactStepProps) {
  const [formData, setFormData] = useState<LocationContactData>(data)
  const [errors, setErrors] = useState<Partial<LocationContactData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [updateBusiness] = useUpdateBusinessMutation()
  const params = useParams() as { slug?: string }
  const slug = decodeURIComponent((params?.slug as string) || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")

  // Sync RHF values to parent on change
  useEffect(() => {
    const subscription = form.watch((values: any) => {
      const next: LocationContactData = {
        streetAddress: values.streetAddress || "",
        house: values.house || "",
        localArea: values.localArea || "",
        city: values.city || "",
        postalCode: values.postalCode || "",
        country: values.country || "",
        mobile: values.mobile || "",
        website: values.website || "",
        facebook: values.facebook || "",
      }
      setFormData(next)
      onUpdate(next)
    })
    return () => subscription.unsubscribe()
  }, [form])

  const validateForm = () => {
    const newErrors: Partial<LocationContactData> = {}

    if (!(form.getValues("streetAddress") || "").trim()) {
      newErrors.streetAddress = "Street address is required"
    }
    if (!(form.getValues("house") || "").trim()) {
      newErrors.house = "House/Road info is required"
    }
    if (!(form.getValues("localArea") || "").trim()) {
      newErrors.localArea = "Local area is required"
    }
    if (!(form.getValues("city") || "").trim()) {
      newErrors.city = "City is required"
    }
    if (!(form.getValues("postalCode") || "").trim()) {
      newErrors.postalCode = "Postal code is required"
    }
    if (!(form.getValues("country") || "").trim()) {
      newErrors.country = "Country is required"
    }
    if (!(form.getValues("mobile") || "").trim()) {
      newErrors.mobile = "Mobile number is required"
    }

    setErrors(newErrors)
    
    // Show validation errors as toast
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0]
      toast.error(firstError || "Please fill in all required fields")
    }
    
    return Object.keys(newErrors).length === 0
  }

  const handleSaveAndBack = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const currentValues = form.getValues()
      const jsonPayload = {
        streetAddress: currentValues.streetAddress || "",
        house: currentValues.house || "",
        localArea: currentValues.localArea || "",
        city: currentValues.city || "",
        postalCode: currentValues.postalCode || "",
        country: currentValues.country || "",
        mobile: currentValues.mobile || "",
        website: currentValues.website || "",
        facebook: currentValues.facebook || "",
      }

      await updateBusiness({ slug, data: jsonPayload }).unwrap()
      toast.success("Location and contact information saved successfully!")
      onSaveAndBack()
    } catch (error) {
      toast.error("Failed to save location and contact information. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const currentValues = form.getValues()
      const jsonPayload = {
        streetAddress: currentValues.streetAddress || "",
        house: currentValues.house || "",
        localArea: currentValues.localArea || "",
        city: currentValues.city || "",
        postalCode: currentValues.postalCode || "",
        country: currentValues.country || "",
        mobile: currentValues.mobile || "",
        website: currentValues.website || "",
        facebook: currentValues.facebook || "",
      }

      await updateBusiness({ slug, data: jsonPayload }).unwrap()
      toast.success("Location and contact information saved successfully!")
      onNext()
    } catch (error) {
      toast.error("Failed to save location and contact information. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-[24px] h-[24px] text-[#9333EA]" />
          <h3 className="auth-heading !font-medium text-[#111827]">
            Location & Contact
          </h3>
        </div>
        <p className="text-[#2D3643] Subheading !text-start mb-6">
          Where is your business located?
        </p>

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
          <TextInput
            name="streetAddress"
            control={form.control}
            label="Street Address"
            placeholderIcon={Building}
            required
            width="100%"
          />
          <TextInput
            name="house"
            control={form.control}
            label="House / Road Info"
            required
            width="100%"
          />
          <TextInput
            name="localArea"
            control={form.control}
            label="Local Area"
            required
            width="100%"
          />
          <TextInput
            name="city"
            control={form.control}
            label="City"
            required
            width="100%"
          />
          <TextInput
            name="postalCode"
            control={form.control}
            label="Postal Code"
            required
            width="100%"
          />
          <TextInput
            name="country"
            control={form.control}
            label="Country"
            required
            width="100%"
            className="mt-1"
          />
        </div>

        <div className="space-y-4">
          <TextInput
            name="mobile"
            control={form.control}
            placeholder="Phone"
            required
            width="100%"
            placeholderIcon={Phone}
            label="Mobile Number"
            rules={{
              maxLength: { value: 11, message: 'Mobile number cannot exceed 11 digits' },
              pattern: { value: /^\d*$/, message: 'Only digits are allowed' }
            }}
          />

          <TextInput
            name="website"
            control={form.control}
            label="Website URL (Optional)"
            placeholderIcon={Globe}
            width="100%"
            placeholder="https://www.example.com"
            
          />

          <TextInput
            name="facebook"
            control={form.control}
            width="100%"
            placeholderIcon={Facebook}
            label="Facebook Page (Optional)"
            placeholder="https://facebook.com/example"
          />
        </div>

        <div className="flex lg:flex-row flex-col gap-10 lg:w-1/2 w-full mx-auto">
          <button
            onClick={handleSaveAndBack}
            disabled={isSubmitting}
            className="lg:px-20 px-4 !py-3 cursor-pointer border-blue-600 text-white bg-[#163987] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save & Back to Businesses
          </button>
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="lg:px-20 px-4 !py-3 cursor-pointer bg-[#6F00FF] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save & Continue
          </button>
        </div>
      </form>
    </Form>
  )
}
