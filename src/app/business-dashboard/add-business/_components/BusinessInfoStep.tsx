"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building, MessageSquare, FileText, Search } from "lucide-react"

interface BusinessInfoData {
  businessName: string
  tagline: string
  about: string
  startYear: string
  startMonth: string
  startDay: string
  category: string
}

interface BusinessInfoStepProps {
  data: BusinessInfoData
  onUpdate: (data: BusinessInfoData) => void
  onNext: () => void
}

export default function BusinessInfoStep({ data, onUpdate, onNext }: BusinessInfoStepProps) {
  const [formData, setFormData] = useState<BusinessInfoData>(data)
  const [errors, setErrors] = useState<Partial<BusinessInfoData>>({})
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    { value: "pharmacy", label: "Pharmacy" },
    { value: "restaurant", label: "Restaurant" },
    { value: "retail-store", label: "Retail Store" },
    { value: "grocery-store", label: "Grocery Store" },
    { value: "clothing-store", label: "Clothing Store" },
    { value: "electronics-shop", label: "Electronics Shop" },
    { value: "beauty-salon", label: "Beauty Salon" },
    { value: "barbershop", label: "Barbershop" },
    { value: "cafe", label: "Cafe" },
    { value: "bakery", label: "Bakery" },
    { value: "bookstore", label: "Bookstore" },
    { value: "gym-fitness", label: "Gym/Fitness Center" },
    { value: "medical-clinic", label: "Medical Clinic" },
    { value: "dental-clinic", label: "Dental Clinic" },
    { value: "law-firm", label: "Law Firm" },
    { value: "accounting-firm", label: "Accounting Firm" },
    { value: "real-estate", label: "Real Estate" },
    { value: "travel-agency", label: "Travel Agency" },
    { value: "photography-studio", label: "Photography Studio" },
    { value: "auto-repair", label: "Auto Repair" },
    { value: "pet-store", label: "Pet Store" },
    { value: "jewelry-store", label: "Jewelry Store" },
    { value: "hardware-store", label: "Hardware Store" },
    { value: "flower-shop", label: "Flower Shop" },
    { value: "laundry-service", label: "Laundry Service" },
    { value: "other", label: "Other" }
  ]

  const filteredCategories = categories.filter(category =>
    category.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleInputChange = (field: keyof BusinessInfoData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    onUpdate({ ...formData, [field]: value })
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = () => {
    const newErrors: Partial<BusinessInfoData> = {}
    
    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required"
    }
    if (!formData.tagline.trim()) {
      newErrors.tagline = "Tagline is required"
    }
    if (formData.tagline.length > 150) {
      newErrors.tagline = "Tagline must be 150 characters or less"
    }
    if (!formData.about.trim()) {
      newErrors.about = "About section is required"
    }
    if (formData.about.length > 5000) {
      newErrors.about = "About section must be 5000 characters or less"
    }
    if (!formData.startYear || !formData.startMonth || !formData.startDay) {
      newErrors.startYear = "Business starting date is required"
    }
    if (!formData.category) {
      newErrors.category = "Business category is required"
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
        
          <Building className="size-6 text-[#9333EA]" />
        
        <h3 className="auth-heading !font-medium text-[#111827]">Business Information</h3>
      </div>
      <p className="text-[#2D3643] Subheading !text-start mb-6">Tell us about your business</p>

      <div className="space-y-4">
        <div>
        
          <div className="relative mt-1">
           
            <Input 
            placeholderIcon={Building}
            label="Business Name"
            required
            width="100%"
              placeholder="Business Name"
              id="businessName" 
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              className={` ${errors.businessName ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.businessName && (
            <p className="text-xs text-red-500 mt-1">{errors.businessName}</p>
          )}
        </div>

        <div>
          <div className="relative mt-1">
            
            <Textarea
            placeholder="Tagline"
            label="Tagline"
            required
            placeholderIcon={MessageSquare}
            rows={1}
            character={150}
              id="tagline"
              value={formData.tagline}
              onChange={(e) => handleInputChange('tagline', e.target.value)}
              className={` ${errors.tagline ? 'border-red-500' : ''}`}
            />
          </div>
          
        </div>

        <div>
          <div className="relative mt-1">
        
            <Textarea
            placeholder="About your business"
            label="About"
            required
            rows={5}
            character={5000}
              id="about"
              placeholderIcon={FileText}
              value={formData.about}
              onChange={(e) => handleInputChange('about', e.target.value)}
              className={` ${errors.about ? 'border-red-500' : ''}`}
            />
          </div>
          
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
           
            <div className="flex gap-2 mt-1">
              <Select
                label="Year"
                required
                placeholder="Year"
                value={formData.startYear}
                onValueChange={(value) => handleInputChange('startYear', value)}
                width="w-full"
              >
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => 2020 + i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                label="Month"
                required
                placeholder="Month"
                value={formData.startMonth}
                onValueChange={(value) => handleInputChange('startMonth', value)}
                width="!w-full"
              >
                <SelectContent>
                  <SelectItem value="january">January</SelectItem>
                  <SelectItem value="february">February</SelectItem>
                  <SelectItem value="march">March</SelectItem>
                  <SelectItem value="april">April</SelectItem>
                  <SelectItem value="may">May</SelectItem>
                  <SelectItem value="june">June</SelectItem>
                  <SelectItem value="july">July</SelectItem>
                  <SelectItem value="august">August</SelectItem>
                  <SelectItem value="september">September</SelectItem>
                  <SelectItem value="october">October</SelectItem>
                  <SelectItem value="november">November</SelectItem>
                  <SelectItem value="december">December</SelectItem>
                </SelectContent>
              </Select>
              <Select
                label="Day"
                required
                placeholder="Day"
                value={formData.startDay}
                onValueChange={(value) => handleInputChange('startDay', value)}
                width="w-full"
              >
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {errors.startYear && (
              <p className="text-xs text-red-500 mt-1">{errors.startYear}</p>
            )}
          </div>

          
        </div>
    
          <Select
            label="Business Category"
            required
            placeholder="Search categories..."
            value={formData.category}
            onValueChange={(value) => handleInputChange("category", value)}
            width="w-full"
          >
            <SelectContent>
              {/* Search Bar */}
              <div className="relative mb-3 p-2">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              {/* Category Grid */}
              <div className="grid grid-cols-2 gap-1 p-2 max-h-60 overflow-y-auto">
                {filteredCategories.map((category) => (
                  <SelectItem
                    key={category.value}
                    value={category.value}
                    className="text-sm"
                  >
                    {category.label}
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>

      </div>

      <div className="flex gap-10 w-1/2 mx-auto">
        <button
         
          onClick={handleNext}
          className="!px-20 !py-3 border-blue-600 text-white lg:whitespace-pre whitespace-normal bg-[#163987]  rounded-lg"
        >
          Save & Back to Businesses
        </button>
        <button
          onClick={handleNext}
          className="!px-20 !py-3 bg-[#6F00FF] lg:whitespace-pre whitespace-normal text-white rounded-lg"
        >
          Save & Continue
        </button>
      </div>
    </div>
  )
}
