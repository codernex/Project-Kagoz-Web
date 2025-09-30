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
import { useGetCategoriesQuery } from "@/redux/api/category"
import { useParams, useRouter } from "next/navigation"
import * as React from "react"


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
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery()
  const params = useParams() as { slug?: string }
  const slug = decodeURIComponent((params?.slug as string) || "").trim().toLowerCase().replace(/\s+/g, "-")
  const route = useRouter();

  
  // Transform API categories to the format expected by the component
  const categories = React.useMemo(() => {
    if (!categoriesData) return []
    return categoriesData.map(category => ({
      value: category.slug || category.id?.toString() || "",
      label: category.name || "",
      id: category.id
    }))
  }, [categoriesData])

  const filteredCategories = categories.filter((c) =>
    c.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Hydrate form with incoming data (including tagLine, starting date, and category)
  React.useEffect(() => {
    if (!data) {
      console.log("🔍 No data provided to BusinessInfoStep")
      return
    }
    
    console.log("🔍 BusinessInfoStep - Hydrating form with data:", data)
    console.log("🔍 BusinessInfoStep - Current form startingDate:", form.getValues().startingDate)

    const monthMap: Record<string, string> = {
      january: "01",
      february: "02",
      march: "03",
      april: "04",
      may: "05",
      june: "06",
      july: "07",
      august: "08",
      september: "09",
      october: "10",
      november: "11",
      december: "12",
    }

    const parseStartingDate = (v: any): { year: string; month: string; day: string } | undefined => {
      if (!v) return undefined
      if (typeof v === "object" && v.year && v.month && v.day) {
        return { year: String(v.year), month: String(v.month), day: String(v.day) }
      }
      if (typeof v === "string") {
        const parts = v.split(/[-/]/)
        if (parts.length >= 3) {
          const year = parts[0] ?? ""
          let month: string = parts[1] ?? ""
          const day = parts[2] ?? ""
          const lower = month.toLowerCase()
          if (monthMap[lower]) month = monthMap[lower]
          return { year: String(year ?? ""), month: String(month ?? ""), day: String(day ?? "") }
        }
      }
      return undefined
    }

    const nextValues: Record<string, any> = {}
    if (data.name) nextValues["name"] = data.name
    // API sometimes returns tagLine instead of tagLine
    if (data.tagLine) nextValues["tagLine"] = data.tagLine
    if (data.about) nextValues["about"] = data.about

    // startingDate is already handled by BusinessForm.tsx, no need to parse again
    // Check if startingDate is already set in the form
    const currentStartingDate = form.getValues().startingDate
    console.log("🔍 BusinessInfoStep - Current form startingDate:", currentStartingDate)
    if (currentStartingDate && typeof currentStartingDate === 'object' && currentStartingDate.year) {
      console.log("🔍 BusinessInfoStep - startingDate already set, not overriding")
    } else {
      console.log("🔍 BusinessInfoStep - startingDate not set, will not set it here as BusinessForm handles it")
    }

    // Category: try a few common shapes and find matching value from categories list
    const categoryFromData = data.primaryCategory?.slug || data.primaryCategory?.name || data.category
    console.log("🔍 BusinessInfoStep - Category from data:", categoryFromData)
    console.log("🔍 BusinessInfoStep - Primary category object:", data.primaryCategory)
    console.log("🔍 BusinessInfoStep - Available categories:", categories)
    
    if (categoryFromData && categories.length > 0) {
      // Try to find the category in our categories list
      const foundCategory = categories.find(c => 
        c.value === categoryFromData || 
        c.label === categoryFromData ||
        c.value === String(categoryFromData) ||
        c.label.toLowerCase() === String(categoryFromData).toLowerCase() ||
        c.id === data.primaryCategory?.id
      )
      
      console.log("🔍 BusinessInfoStep - Found category:", foundCategory)
      
      if (foundCategory) {
        nextValues["category"] = foundCategory.value
        console.log("🔍 BusinessInfoStep - Setting category to:", foundCategory.value)
      } else {
        // If not found, use the raw value
        nextValues["category"] = String(categoryFromData)
        console.log("🔍 BusinessInfoStep - Category not found in list, using raw value:", categoryFromData)
      }
    } else if (categoryFromData) {
      // If categories haven't loaded yet, store the raw value
      nextValues["category"] = String(categoryFromData)
      console.log("🔍 BusinessInfoStep - Categories not loaded yet, using raw value:", categoryFromData)
    }

    console.log("🔍 Setting form values:", nextValues)
    
    // Set values into the form without wiping other fields
    Object.entries(nextValues).forEach(([k, v]) => {
      console.log(`🔍 Setting ${k} to:`, v)
      form.setValue(k, v, { shouldDirty: false, shouldValidate: true })
    })
    
    // Debug: Check form values after setting
    setTimeout(() => {
      console.log("🔍 BusinessInfoStep - Form values after setting:", form.getValues())
      console.log("🔍 BusinessInfoStep - Category field value:", form.getValues().category)
    }, 100)
  }, [data, form, categories])

  // Debug: Watch form changes
  React.useEffect(() => {
    const subscription = form.watch((value: any, { name, type }: { name?: string; type?: string }) => {
      console.log("🔍 Form field changed:", { name, type, value })
    })
    return () => subscription.unsubscribe()
  }, [form])

  const handleNext = async (values: any) => {
    // Get the current form values directly from the form
    const currentFormValues = form.getValues()
    
    // Check if form has any data
    const hasData = currentFormValues.name || currentFormValues.tagLine || currentFormValues.about || currentFormValues.category
    
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
        tagLine: currentFormValues?.tagLine ?? "",
        about: currentFormValues?.about ?? "",
        startYear: "",
        startMonth: "",
        startDay: "",
        category: currentFormValues?.category ?? "",
      })
    }

    // Handle startingDate properly - convert object to string format
    let startingDateValue = ""
    if (currentFormValues?.startingDate && typeof currentFormValues.startingDate === 'object') {
      const { year, month, day } = currentFormValues.startingDate
      if (year && month && day) {
        // Convert month name to number
        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ]
        const monthNum = monthNames.indexOf(month) + 1
        startingDateValue = `${year}-${monthNum.toString().padStart(2, '0')}-${day.padStart(2, '0')}`
      }
    } else if (currentFormValues?.startingDate) {
      startingDateValue = String(currentFormValues.startingDate)
    }
    
    // Create JSON payload instead of FormData
    const updateData = {
      name: currentFormValues?.name ?? "",
      tagLine: currentFormValues?.tagLine ?? "",
      about: currentFormValues?.about ?? "",
      startingDate: startingDateValue,
      category: currentFormValues?.category ?? "",
    }

    // Debug: Log the JSON payload
    console.log("🔍 JSON payload being sent:")
    console.log(JSON.stringify(updateData, null, 2))

    try {
      console.log("🔍 Sending update request with slug:", slug)
      
      const result = await updateBusiness({ slug, data: updateData }).unwrap()
      console.log("🔍 Update successful:", result)
      onNext()
    } catch (e) {
      console.error("❌ Failed to save business info", e)
      alert("Failed to update business information. Please try again.")
    }
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

        {/* tagLine */}
        <Textarea
          placeholderIcon={Tag}
          label="tagLine"
          required
          name="tagLine"
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
          value={(() => {
            const watchedValue = form.watch("startingDate")
            console.log("🔍 BusinessInfoStep - DateSelector value prop:", watchedValue)
            return watchedValue
          })()}
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
