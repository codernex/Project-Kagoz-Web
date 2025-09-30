"use client"

import type { BusinessData } from "./businessSetup"
import { BusinessPreview } from "./BusinessPreview"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Tag } from "lucide-react"
import { useState, useMemo } from "react"
import { TextInput } from "@/components/shared/text-input"
import { Textarea } from "@/components/bizness/textarea"
import { TiptapEditor } from "@/components/ui/texteditor"
import { DateSelector } from "@/components/bizness/select-date"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useGetBusinessBySlugQuery } from "@/redux/api"
import { useGetCategoriesQuery } from "@/redux/api/category"
import { useParams } from "next/navigation"
import { useForm, SubmitHandler } from "react-hook-form"

type BusinessInfoInput = {
  name: string
  tagline: string
  about: string
  startingDate: string | { year: string; month: string; day: string }
  category: string
}

interface StepProps {
  businessData: BusinessData
  setFormValue: (field: string, value: any) => void
  onPrev: () => void
  onNext: () => void
  isNextDisabled?: boolean
}

export function StepBusinessInfo({ businessData, onPrev, onNext, setFormValue }: StepProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { slug } = useParams() as { slug?: string }

  // fetch business data (skip if no slug on this route)
  const { data: existingBusiness } = useGetBusinessBySlugQuery(slug as string, { skip: !slug })

  // Prepare starting date default as an object so DateSelector can hydrate
  const defaultStartingDate = ((): { year: string; month: string; day: string } | "" => {
    if (businessData.startingDate?.year && businessData.startingDate?.month && businessData.startingDate?.day) {
      return {
        year: businessData.startingDate.year,
        month: businessData.startingDate.month,
        day: businessData.startingDate.day,
      }
    }
    const apiDate: string | undefined = (existingBusiness as any)?.startingDate
    if (apiDate && apiDate.includes("-")) {
      const [y, m, d] = apiDate.split("-") as [string, string, string]
      return { year: y ?? "", month: m ?? "", day: d ?? "" }
    }
    return ""
  })()

  // form setup - prioritize businessData from parent state
  const defaultValues: BusinessInfoInput = {
    name: businessData.name || (existingBusiness as any)?.name || "",
    tagline: businessData.tagline || (existingBusiness as any)?.tagline || "",
    about: businessData.about || (existingBusiness as any)?.about || "",
    startingDate: defaultStartingDate,
    // Keep the category ID in state to match the Select options
    category: businessData.category || (existingBusiness as any)?.category || "",
  }

  const form = useForm<BusinessInfoInput>({
    defaultValues,
    values: defaultValues,
    mode: "onChange",
    reValidateMode: "onChange"
  })

  // Add form validation rules
  const validateForm = () => {
    const values = form.getValues()
    const errors: any = {}
    
    if (!values.name || values.name.trim() === '') {
      errors.name = 'Business name is required'
    }
    
    if (!values.tagline || values.tagline.trim() === '') {
      errors.tagline = 'Tagline is required'
    }
    
    if (!values.about || values.about.trim() === '') {
      errors.about = 'About section is required'
    }
    
    // Fix startingDate validation - handle both string and object formats
    if (!values.startingDate) {
      errors.startingDate = 'Starting date is required'
    } else if (typeof values.startingDate === 'string' && values.startingDate.trim() === '') {
      errors.startingDate = 'Starting date is required'
    } else if (typeof values.startingDate === 'object' && values.startingDate !== null) {
      const dateObj = values.startingDate as { year?: string; month?: string; day?: string }
      if (!dateObj.year || !dateObj.month || !dateObj.day) {
        errors.startingDate = 'Starting date is required'
      }
    }
    
    return Object.keys(errors).length === 0
  }

  const onSubmit: SubmitHandler<BusinessInfoInput> = async (d) => {
    try {
      // Update parent state with form data
      setFormValue("name", d.name)
      setFormValue("tagline", d.tagline)
      setFormValue("about", d.about)
      
      // Persist the selected category VALUE (ID) to keep Select hydrated when returning
      setFormValue("category", d.category)
      
      // Handle starting date
      if (typeof d.startingDate === "object") {
        setFormValue("startingDate", d.startingDate)
      } else if (typeof d.startingDate === "string" && d.startingDate.includes("-")) {
        const [year, month, day] = d.startingDate.split("-")
        setFormValue("startingDate", { year, month, day })
      }
      
      onNext()
    } catch (err) {
      console.error("Error updating form value:", err)
    }
  }

  // fetch categories for select
  const { data: categoriesData } = useGetCategoriesQuery()
  const categories = useMemo(() => {
    return (categoriesData || []).map((c: any) => ({
      value: String(c.id ?? c._id ?? c.slug ?? c.value ?? ""),
      label: String(c.name ?? c.title ?? c.label ?? c.slug ?? ""),
    })).filter(c => c.value && c.label)
  }, [categoriesData])

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, categories])

  return (
    <Form {...form}>
      <form 
      onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-10 xl:p-1 p-2">
        {/* Left side form fields */}
        <div className="lg:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <Building2 className="w-6 h-6 text-[#6F00FF]" />
            <h2 className="auth-heading !font-medium text-[#111827]">Business Information</h2>
          </div>
          <p className="text-[#2D3643] mb-6">Tell us about your business</p>

          <div className="space-y-6">
            <TextInput
              name="name"
              placeholderIcon={Building2}
              label="Business Name"
              required
              width="100%"
              placeholder="Enter your business name"
              control={form.control}
            />

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

            <TiptapEditor
              label="About"
              name="about"
              control={form.control}
              required
              id="about"
              placeholder="Detailed description of your business, services, and what makes you unique..."
            />

            <DateSelector
              label="Business Starting Date"
              name="startingDate"
              required
              control={form.control}
            />

            {/* Category select with search */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Category</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Also update the form state immediately
                      form.setValue("category", value);
                    }}
                  >
                    <SelectTrigger className="w-full h-[48px] border border-[#E5E7EB] rounded-[8px] bg-white text-[#23272E] px-4 focus:border-[#23272E] focus:ring-2 focus:ring-[#23272E] placeholder:text-[#6B7280] shadow-sm">
                      <SelectValue placeholder="Search categories..." />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="relative mb-3 p-2">
                        <Input
                          placeholder="Search categories..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 border-gray-300 "
                        />
                      </div>
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
          </div>
          <button
            type="submit"
            disabled={!validateForm()}
            className={`flex items-center w-full my-[26px] rounded-[8px] px-6 py-[12px]  ${
              !validateForm()
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-[#6F00FF] hover:bg-purple-700 text-white"
            }`}
          >
            <span className="mx-auto">Next</span>
          </button>
          
        </div>

        {/* Right side preview */}
        <div>
          <div className="sticky top-6">
          
            <BusinessPreview businessData={form.getValues() as any} stepIndex={0} />
          </div>
        </div>

       
      </form>
    </Form>
  )
}
