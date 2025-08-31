"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Building, Phone, Globe, Facebook } from "lucide-react"

interface LocationContactData {
  streetAddress: string
  houseRoad: string
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
}

export default function LocationContactStep({ data, onUpdate, onNext, onBack }: LocationContactStepProps) {
  const [formData, setFormData] = useState<LocationContactData>(data)
  const [errors, setErrors] = useState<Partial<LocationContactData>>({})

  const handleInputChange = (field: keyof LocationContactData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    onUpdate({ ...formData, [field]: value })
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = () => {
    const newErrors: Partial<LocationContactData> = {}
    
    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = "Street address is required"
    }
    if (!formData.houseRoad.trim()) {
      newErrors.houseRoad = "House/Road info is required"
    }
    if (!formData.localArea.trim()) {
      newErrors.localArea = "Local area is required"
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required"
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        
          <MapPin className="size-6 text-[#9333EA]" />
       
        <h3 className="auth-heading !font-medium text-[#111827]">Location & Contact</h3>
      </div>
      <p className="text-[#2D3643] Subheading !text-start mb-6">Where is your business located?</p>

    <div className="grid grid-cols-2 gap-5">
    <Input 
    label="streetAddress"
    placeholderIcon={Building}
    required
    width="100%"
              id="streetAddress" 
              value={formData.streetAddress}
              onChange={(e) => handleInputChange('streetAddress', e.target.value)}
              className={` ${errors.streetAddress ? 'border-red-500' : ''}`}
            />
            <Input 
            label="House / Road Info"
            required
            width="100%"
            id="houseRoad" 
            value={formData.houseRoad}
            onChange={(e) => handleInputChange('houseRoad', e.target.value)}
            className={` ${errors.houseRoad ? 'border-red-500' : ''}`}
          />
          <Input 
          required
          label="localArea"
          width="100%"
            id="localArea" 
            value={formData.localArea}
            onChange={(e) => handleInputChange('localArea', e.target.value)}
            className={` ${errors.localArea ? 'border-red-500' : ''}`}
          />
           <Input 
           label="city"
           required
           width="100%"
            id="city" 
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className={` ${errors.city ? 'border-red-500' : ''}`}
          />
           <Input 
           label="postal Code"
           required
           width="100%"
            id="postalCode" 
            value={formData.postalCode}
            onChange={(e) => handleInputChange('postalCode', e.target.value)}
            className={`mt-1 ${errors.postalCode ? 'border-red-500' : ''}`}
          />
            <Input 
            label="country"
            id="country" 
            readOnly
            width="100%"
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className="mt-1"
          />
    </div>

      <div className="space-y-4">
       

      
          <Input
            placeholder="phone"
            required
            width="100%"
            placeholderIcon={Phone}
              id="mobile" 
              value={formData.mobile}
              onChange={(e) => handleInputChange('mobile', e.target.value)}
              className={` ${errors.mobile ? 'border-red-500' : ''}`}
            />
        
       

    
        
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
            label="Website URL (Optional)"
            placeholderIcon={Globe}
            width="100%"
            placeholder="https://www.kagoz.com"
              id="website" 
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className=""
            />
          
    

       
          
            <Input 
            width="100%"
            placeholderIcon={Facebook}
            label="Facebook Page (Optional)"
            placeholder="https://facebook.com/kagoz"
              id="facebook" 
              value={formData.facebook}
              onChange={(e) => handleInputChange('facebook', e.target.value)}
              className=""
            />
         
      </div>

      <div className="flex gap-10 w-1/2 mx-auto">
        <button
         
          onClick={handleNext}
          className="!px-20 !py-3 cursor-pointer border-blue-600 text-white lg:whitespace-pre whitespace-normal bg-[#163987]  rounded-lg"
        >
          Save & Back to Businesses
        </button>
        <button
          onClick={handleNext}
          className="!px-20 !py-3 cursor-pointer bg-[#6F00FF] lg:whitespace-pre whitespace-normal text-white rounded-lg"
        >
          Save & Continue
        </button>
      </div>
    </div>
  )
}
