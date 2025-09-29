"use client"

import { useState } from "react"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Building2, Tag } from "lucide-react"
import { TextInput } from "@/components/shared/text-input"
import { Textarea } from "@/components/bizness/textarea"
import { TiptapEditor } from "@/components/ui/texteditor"
import { DateSelector } from "@/components/bizness/select-date"
import { useUpdateBusinessMutation } from "@/redux/api/business"
import { useParams, useRouter } from "next/navigation"


interface BusinessInfoStepProps {
  form: any // react-hook-form instance
  onNext: () => void
  data: any // existing business data
  onUpdate?: (data: any) => void
}

export default function BusinessInfoStep({ form, onNext ,data, onUpdate }: BusinessInfoStepProps) {
  const [searchQuery, setSearchQuery] = useState("")
   const [isSubmitting, setIsSubmitting] = useState(false)
  const [updateBusiness] = useUpdateBusinessMutation()
  const params = useParams() as { slug?: string }
  const slug = decodeURIComponent((params?.slug as string) || "").trim().toLowerCase().replace(/\s+/g, "-")
  const route = useRouter();

  // Debug: Log form state on component mount
  console.log("🔍 BusinessInfoStep - Form values on mount:", form.getValues())
  console.log("🔍 BusinessInfoStep - Data prop:", data)
  console.log("🔍 BusinessInfoStep - Form watch all:", form.watch())
  console.log("🔍 BusinessInfoStep - Form errors:", form.formState.errors)
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
    { value: "other", label: "Other" },
  ]

  const filteredCategories = categories.filter((c) =>
    c.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleNext = async (values: any) => {
    // Get the current form values directly from the form
    const currentFormValues = form.getValues()
    
    // Check if form has any data
    const hasData = currentFormValues.name || currentFormValues.tagline || currentFormValues.about || currentFormValues.category
    
    console.log("🔍 Form values being submitted:", values)
    console.log("🔍 Form current values:", currentFormValues)
    console.log("🔍 Form has data:", hasData)
    
    if (!hasData) {
      console.error("❌ Form has no data! Form values:", currentFormValues)
      alert("Form has no data. Please check if the business data is loaded correctly.")
      return
    }
    
    if (onUpdate) {
      onUpdate({
        businessName: currentFormValues?.name ?? "",
        tagline: currentFormValues?.tagline ?? "",
        about: currentFormValues?.about ?? "",
        startYear: "",
        startMonth: "",
        startDay: "",
        category: currentFormValues?.category ?? "",
      })
    }

    const formData = new FormData()
    ;[
      ["name", currentFormValues?.name ?? ""],
      ["tagline", currentFormValues?.tagline ?? ""],
      ["about", currentFormValues?.about ?? ""],
      ["startingDate", currentFormValues?.startingDate ?? ""],
      ["category", currentFormValues?.category ?? ""],
    ].forEach(([k, v]) => {
      console.log(`🔍 Adding to FormData: ${k} = ${v}`)
      formData.append(k as string, v as string)
    })

    // Debug: Log the FormData contents
    console.log("🔍 FormData contents:")
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`)
    }

    try {
      await updateBusiness({ slug, data: formData }).unwrap()
      onNext()
    } catch (e) {
      
      console.error("Failed to save business info", e)
    }
  }

  // Debug: Add a test button to see current form values
  const testFormValues = () => {
    console.log("🔍 Test - Current form values:", form.getValues())
    console.log("🔍 Test - Form is valid:", form.formState.isValid)
    console.log("🔍 Test - Form errors:", form.formState.errors)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleNext)} className="space-y-6">
        {/* Heading */}
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="size-6 text-[#9333EA]" />
          <h3 className="auth-heading !font-medium text-[#111827]">
            Business Information
          </h3>
        </div>
        <p className="text-[#2D3643] Subheading !text-start mb-6">
          Tell us about your business
        </p>

        {/* Business Name */}
        <TextInput
          name="name"
          placeholderIcon={Building2}
          label="Business Name"
          required
          width="100%"
          placeholder="Enter your business name"
          control={form.control}
        />

        {/* Tagline */}
        <Textarea
          placeholderIcon={Tag}
          label="Tagline"
          required
          name="tagline"
          control={form.control}
          character={150}
          rows={2}
          placeholder="Brief description of your business"
        />

        {/* About */}
        <TiptapEditor
          label="About"
          name="about"
          control={form.control}
          required
          id="about"
          placeholder="Detailed description of your business, services, and what makes you unique..."
        />

        {/* Starting Date */}
        <DateSelector
          label="Business Starting Date"
          name="startingDate"
          required
          control={form.control}
        />


        {/* Business Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Category</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full h-[48px] border border-[#E5E7EB] rounded-[8px] bg-white text-[#23272E] px-4 focus:border-[#23272E] focus:ring-2 focus:ring-[#23272E] placeholder:text-[#6B7280] shadow-sm">
                  <SelectValue placeholder="Search categories..." />
                </SelectTrigger>
                <SelectContent>
                  {/* Search box */}
                  <div className="relative mb-3 p-2">
                    <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-gray-300"
                    />
                  </div>
                  {/* Grid list */}
                  <div className="grid grid-cols-2 gap-1 p-2 max-h-60 overflow-y-auto">
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((category) => (
                        <SelectItem
                          key={category.value}
                          value={category.value}
                          className="text-sm text-gray-700 cursor-pointer"
                        >
                          {category.label}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="col-span-2 text-center text-gray-400 py-2">
                        No categories found
                      </div>
                    )}
                  </div>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Debug Test Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={testFormValues}
            className="px-4 py-2 bg-yellow-500 text-white rounded"
          >
            Test Form Values (Debug)
          </button>
        </div>

        {/* Buttons */}
          <div className="flex lg:flex-row flex-col gap-10 lg:w-1/2 w-full mx-auto">
        <button
          disabled={isSubmitting}
          onClick={() => {
            setIsSubmitting(true);
            route.push('/business-dashboard');
          }}
          className="lg:px-20 px-4 !py-3 cursor-pointer border-blue-600 text-white lg:whitespace-pre whitespace-normal bg-[#163987]  rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save & Back to Businesses"}
        </button>
        <button
          disabled={isSubmitting}
          onClick={handleNext}
          className="lg:px-20 px-4 !py-3 cursor-pointer bg-[#6F00FF] lg:whitespace-pre whitespace-normal text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save & Continue"}
        </button>
      </div>
      </form>
    </Form>
  )
}
