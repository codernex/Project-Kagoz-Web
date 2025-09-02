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
import { useRegisterBusinessMutation, useGetBusinessBySlugQuery } from "@/redux/api"
import { useParams } from "next/navigation"
import { useForm, SubmitHandler } from "react-hook-form"

type BusinessInfoInput = {
  name: string
  tagline: string
  about: string
  startingDate: string
  category: string
}

interface StepProps {
  businessData: BusinessData
  updateBusinessData: (field: string, value: any) => void
  onPrev: () => void
  onNext: () => void
  isNextDisabled?: boolean
}

export function StepBusinessInfo({ onPrev, onNext }: StepProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [registerBusiness, { isLoading }] = useRegisterBusinessMutation()
  const { slug } = useParams() as { slug?: string }

  // fetch business data (skip if no slug on this route)
  const { data: existingBusiness } = useGetBusinessBySlugQuery(slug as string, { skip: !slug })

  // form setup
  const defaultValues: BusinessInfoInput = {
    name: (existingBusiness as any)?.name || "",
    tagline: (existingBusiness as any)?.tagline || "",
    about: (existingBusiness as any)?.about || "",
    startingDate: (existingBusiness as any)?.startingDate || "",
    category: (existingBusiness as any)?.category || "",
  }

  const form = useForm<BusinessInfoInput>({
    defaultValues,
    values: defaultValues,
    mode: "onChange",
    reValidateMode: "onChange"
  })

  const onSubmit: SubmitHandler<BusinessInfoInput> = async (d) => {
    try {
      const payload = {
        ...d,
        startingDate: typeof d.startingDate === "object"
          ? `${(d.startingDate as any).year}-${(d.startingDate as any).month}-${(d.startingDate as any).day}`
          : d.startingDate,
      }
      await registerBusiness(payload).unwrap()
      onNext()
    } catch (err) {
      // errors handled by RTK
    }
  }

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

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-10 xl:p-1 p-2">
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
                    onValueChange={field.onChange}
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
            disabled={!form.formState.isValid || isLoading}
            className={`flex items-center w-full my-[26px] rounded-[8px] px-6 py-[12px]  ${
              !form.formState.isValid || isLoading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-[#6F00FF] hover:bg-purple-700 text-white"
            }`}
          >
            <span className="mx-auto">{isLoading ? "Saving..." : "Next"}</span>
          </button>
        </div>

        {/* Right side preview */}
        <div>
          <div className="sticky top-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-[#6F00FF] rounded-full"></div>
              <h3 className="font-semibold">Business Preview</h3>
            </div>
            <BusinessPreview businessData={form.getValues() as any} stepIndex={0} />
          </div>
        </div>

       
      </form>
    </Form>
  )
}
