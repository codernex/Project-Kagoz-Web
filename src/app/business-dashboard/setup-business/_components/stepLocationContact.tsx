"use client";

import type { BusinessData } from "./businessSetup";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Home, Phone, Globe, Facebook, Building2 } from "lucide-react";
import { TextInput } from "@/components/shared/text-input";
import { Form } from "@/components/ui/form";
import { useForm, SubmitHandler } from "react-hook-form";
import { useGetBusinessBySlugQuery, useUpdateBusinessMutation } from "@/redux/api";
import { useParams } from "next/navigation";
import { useEffect } from "react";

interface StepProps {
  businessData: BusinessData;
  updateBusinessData: (field: string, value: any) => void;
  onPrev: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
}

export function StepLocationContact({
  businessData,
  updateBusinessData,
  onPrev,
  onNext,
  isNextDisabled
}: StepProps) {
  const { slug } = useParams() as { slug?: string }
  const { data: existingBusiness } = useGetBusinessBySlugQuery(slug as string, { skip: !slug })
  const [update] = useUpdateBusinessMutation()

  type LocationContactInput = {
    streetAddress: string
    houseInfo: string
    localArea: string
    city: string
    postalCode: string
    country: string
    mobile: string
    website: string
    facebook: string
  }

  // Readable defaults like general-info.tsx (prefer API data → parent → empty string)
  const api = (existingBusiness as any) || {}
  const defaultValues: LocationContactInput = {
    city: api.city || businessData.city || "",
    country: api.country || businessData.country || "",
    facebook: api.facebook || businessData.facebook || "",
    houseInfo: api.houseInfo || businessData.houseInfo || "",
    localArea: api.localArea || businessData.localArea || "",
    mobile: api.mobile || businessData.mobile || "",
    postalCode: api.postalCode || businessData.postalCode || "",
    streetAddress: api.streetAddress || businessData.streetAddress || "",
    website: api.website || businessData.website || "",
  }

  const form = useForm<LocationContactInput>({
    defaultValues,
    values: defaultValues,
    mode: "onChange",
  })

  // Keep parent preview and validation in sync as user types
  useEffect(() => {
    const sub = form.watch((values) => {
      Object.entries(values as Record<string, string>).forEach(([k, v]) => {
        updateBusinessData(k, v || "")
      })
    })
    return () => sub.unsubscribe()
  }, [form])

  const onSubmit: SubmitHandler<LocationContactInput> = async (d) => {
    // reflect back to parent state
    Object.entries(d).forEach(([k, v]) => updateBusinessData(k, v))
    if (!slug) {
      onNext()
      return
    }
    const formData = new FormData()
    Object.entries(d).forEach(([key, value]) => formData.append(key, value as string))
    try {
      await update({ slug, data: formData }).unwrap()
      onNext()
    } catch (_e) {
   
    }
  }

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <MapPin className="w-6 h-6 text-[#6F00FF]" />
        <h2 className="auth-heading !font-medium text-[#111827]">Location & Contact</h2>
      </div>
      <p className="text-gray-600 mb-6">Where is your business located?</p>

      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section: Location & Contact Form */}
        <div className="col-span-2 w-full space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <TextInput
              name="streetAddress"
              control={form.control}
              placeholderIcon={Home}
              label="Street Address"
              width="100%"
              required
              placeholder="Enter street address"
            />
            <TextInput
              name="houseInfo"
              control={form.control}
              label="House / Road Info"
              required
              width="100%"
              placeholder="Enter house/road info"
            />
            <TextInput
              name="localArea"
              control={form.control}
              label="Local Area"
              required
              width="100%"
              placeholder="Enter local area"
            />
            <TextInput
              name="city"
              control={form.control}
              label="City"
              width="100%"
              placeholder="Enter city"
            />
            <TextInput
              name="postalCode"
              control={form.control}
              label="Postal Code"
              required
              width="100%"
              placeholder="Enter postal code"
            />
            <TextInput
              name="country"
              control={form.control}
              label="Country"
              required
              width="100%"
              placeholder="Enter country"
            />
          </div>
          <TextInput
            name="mobile"
            control={form.control}
            required
            label="Phone Number"
            placeholderIcon={Phone}
            width="100%"
            placeholder="Enter mobile number"
          />
          <TextInput
            name="website"
            control={form.control}
            placeholderIcon={Globe}
            label="Website URL (Optional)"
            width="100%"
            placeholder="Enter website URL"
          />
          <TextInput
            name="facebook"
            control={form.control}
            label="Facebook Page (Optional)"
            placeholderIcon={Facebook}
            width="100%"
            placeholder="Enter Facebook page URL"
          />
        </div>

        {/* Right Section: Location Preview */}
        <div className="col-span-1">
          <div className="">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-[#6F00FF] rounded-full"></div>
              <h3 className="font-semibold">Location Preview</h3>
            </div>

            <Card className="border border-gray-200 rounded-2xl">
              <CardContent className="p-4">
                {/* Business Card */}
                <div className="flex items-center space-x-3 mb-4 bg-gradient-to-r border border-[#CCFBF1] rounded-[12px] px-4 py-[20px] from-[#F0FDFA] to-[#FAF5FF]">
                  <div className="size-16 basis-16 shrink-0 bg-[#6F00FF] rounded-lg flex items-center justify-center">
                    <Building2 className="size-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">
                      {businessData.name}
                    </h3>
                    <p className="text-xs text-gray-600 break-words">
                      {businessData.tagline}
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4 text-xs">
                  {/* Address */}
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-3 h-3 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-gray-600">
                        {businessData.streetAddress}, {businessData.houseInfo},{" "}
                        {businessData.localArea}, {businessData.city},{" "}
                        {businessData.postalCode}, {businessData.country}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600">{businessData.mobile}</p>
                    </div>
                  </div>

                  {/* Website */}
                  <div className="flex items-center space-x-2">
                    <Globe className="w-3 h-3 text-gray-400" />
                    <div>
                      <p className="font-medium">Website</p>
                      <p className="text-blue-600">{businessData.website}</p>
                    </div>
                  </div>

                  {/* Facebook */}
                  <div className="flex items-center space-x-2">
                    <Facebook className="w-3 h-3 text-gray-400" />
                    <div>
                      <p className="font-medium">Facebook</p>
                      <p className="text-blue-600">{businessData.facebook}</p>
                    </div>
                  </div>
                </div>

                {/* Preview Description */}
                <div className="mt-4 py-3 px-5 rounded-[8px] bg-[#F9FAFB] border-l-[4px] border-[#6F00FF] text-xs text-[#717684]">
                  This preview shows how your location and contact information
                  will appear to customers. Make sure all details are accurate.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
      </Form>
      <div className="flex gap-4 my-8 w-1/2">
        <button
          onClick={onPrev}
          className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg !px-10 y-2"
        >
          <span>Previous</span>
        </button>
        <button
          onClick={form.handleSubmit(onSubmit)}
          disabled={!!isNextDisabled}
          aria-disabled={!!isNextDisabled}
          className={`flex items-center justify-center w-full rounded-[8px] px-6 py-[10px] transition-colors ${
            isNextDisabled
              ? "bg-[#CDD1D8] text-white cursor-not-allowed"
              : "bg-[#6F00FF] text-white hover:bg-[#6F00FF]"
          }`}
        >
          <span>Next</span>
        </button>
      </div>
    </div>
  );
}
