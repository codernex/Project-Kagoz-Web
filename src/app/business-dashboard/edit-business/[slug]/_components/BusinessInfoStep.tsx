"use client"

import { useState, useEffect, useMemo } from "react"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Building2, Tag, Search } from "lucide-react"
import { TextInput } from "@/components/shared/text-input"
import { Textarea } from "@/components/bizness/textarea"
import { TiptapEditor } from "@/components/ui/texteditor"
import { DateSelector } from "@/components/bizness/select-date"
import { useUpdateBusinessMutation, useAddCategoryToBusinessMutation } from "@/redux/api/business"
import { useGetCategoriesQuery } from "@/redux/api/category"
import { useParams, useRouter } from "next/navigation"

interface BusinessInfoStepProps {
  form: any
  onNext: () => void
  data: any
  onUpdate?: (data: any) => void
}

export default function BusinessInfoStep({ form, onNext, data, onUpdate }: BusinessInfoStepProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [updateBusiness] = useUpdateBusinessMutation()
  const [addCategoryToBusiness] = useAddCategoryToBusinessMutation()
  const { data: categoriesData } = useGetCategoriesQuery(undefined, {
    // Cache categories data to avoid refetching on every render
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false
  })
  const params = useParams() as { slug?: string }
  const slug = decodeURIComponent((params?.slug as string) || "").trim().toLowerCase().replace(/\s+/g, "-")
  const route = useRouter()

  const categories = useMemo(() => {
    if (!categoriesData) return []
    return categoriesData.map((category) => ({
      value: category.slug || category.id?.toString() || "",
      label: category.name || "",
      id: category.id,
    }))
  }, [categoriesData])

  const filteredCategories =
    categories?.filter((c) => c.label.toLowerCase().includes(searchQuery.toLowerCase())) || []

  useEffect(() => {
    if (!data) return

    const nextValues: Record<string, any> = {}
    if (data.name) nextValues["name"] = data.name
    if (data.tagLine) nextValues["tagLine"] = data.tagLine
    if (data.about) nextValues["about"] = data.about

    const categoryFromData = data.primaryCategory?.slug || data.primaryCategory?.name || data.category
    if (categoryFromData && categories && categories.length > 0) {
      const foundCategory = categories.find(
        (c) =>
          c.value === categoryFromData ||
          c.label === categoryFromData ||
          c.value === String(categoryFromData) ||
          c.label.toLowerCase() === String(categoryFromData).toLowerCase() ||
          c.id === data.primaryCategory?.id
      )
      if (foundCategory) {
        nextValues["category"] = foundCategory.value
      } else {
        nextValues["category"] = String(categoryFromData)
      }
    } else if (categoryFromData) {
      nextValues["category"] = String(categoryFromData)
    }

    Object.entries(nextValues).forEach(([k, v]) => {
      form.setValue(k, v, { shouldDirty: false, shouldValidate: true })
    })
  }, [data, form, categories])

  const handleNext = async () => {
    const currentFormValues = form.getValues()
    const hasData =
      currentFormValues.name ||
      currentFormValues.tagLine ||
      currentFormValues.about ||
      currentFormValues.category

    if (!hasData) {
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

    let startingDateValue = ""
    if (currentFormValues?.startingDate && typeof currentFormValues.startingDate === "object") {
      const { year, month, day } = currentFormValues.startingDate
      if (year && month && day) {
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ]
        const monthNum = monthNames.indexOf(month) + 1
        startingDateValue = `${year}-${monthNum.toString().padStart(2, "0")}-${day.padStart(2, "0")}`
      }
    } else if (currentFormValues?.startingDate) {
      startingDateValue = String(currentFormValues.startingDate)
    }

    const updateData = {
      name: currentFormValues?.name ?? "",
      tagLine: currentFormValues?.tagLine ?? "",
      about: currentFormValues?.about ?? "",
      startingDate: startingDateValue,
    }

    try {
      await updateBusiness({ slug, data: updateData }).unwrap()

      const originalCategory =
        data?.primaryCategory?.slug || data?.primaryCategory?.name || data?.category
      if (currentFormValues?.category && currentFormValues.category !== originalCategory) {
        const selectedCategory = categories?.find((c) => c.value === currentFormValues.category)
        const categoryData = selectedCategory?.id
          ? { categoryId: selectedCategory.id, subCategories: [] }
          : { category: currentFormValues.category, subCategories: [] }
        try {
          await addCategoryToBusiness({ slug, ...categoryData }).unwrap()
        } catch {
       console.log("Failed to add category to business")
        }
      }

      onNext()
    } catch {
      alert("Failed to update business information. Please try again.")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-[24px] h-[24px] text-[#9333EA]" />
          <h3 className="auth-heading !font-medium text-[#111827]">Business Information</h3>
        </div>
        <p className="text-[#2D3643] Subheading !text-start mb-6">Tell us about your business</p>

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
          label="tagLine"
          required
          name="tagLine"
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

        <DateSelector label="Business Starting Date" name="startingDate" required control={form.control} />

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
                  <div className="relative mb-3 p-2">
                    <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-gray-300"
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
                      <div className="col-span-2 text-center text-gray-400 py-2">No categories found</div>
                    )}
                  </div>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex lg:flex-row flex-col gap-10 lg:w-1/2 w-full mx-auto">
          <button
            disabled={isSubmitting}
            onClick={() => {
              setIsSubmitting(true)
              route.push("/business-dashboard")
            }}
            className="lg:px-20 px-4 !py-3 cursor-pointer border-blue-600 text-white lg:whitespace-pre whitespace-normal bg-[#163987] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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