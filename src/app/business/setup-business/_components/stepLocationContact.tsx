"use client";

import type { BusinessData } from "./businessSetup";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Home, Phone, Globe, Facebook, Building2 } from "lucide-react";
import { TextInput } from "@/components/shared/text-input";
import { useFormContext, Controller } from "react-hook-form";

interface StepProps {
  businessData: BusinessData;
  updateBusinessData: (field: string, value: any) => void;
  renderBusinessPreview: () => React.ReactNode;
}

export function StepLocationContact({
  businessData,
  updateBusinessData,
}: StepProps) {

  const { control } = useFormContext();
  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <MapPin className="w-5 h-5 text-[#6F00FF]" />
        <h2 className="text-lg font-semibold">Location & Contact</h2>
      </div>
      <p className="text-gray-600 mb-6">Where is your business located?</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section: Location & Contact Form */}
        <div className="col-span-2 w-full space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <TextInput
              name="streetAddress"
              placeholderIcon={Home}
              label="Street Address"
              control={control}
              value={businessData.streetAddress}
              onChange={(e) =>
                updateBusinessData("streetAddress", e.target.value)
              }
              width="100%"
              required
              placeholder="Enter street address"
            />
            <TextInput
              name="houseInfo"
              label="House / Road Info"
              required
              control={control}
              value={businessData.houseInfo}
              onChange={(e) => updateBusinessData("houseInfo", e.target.value)}
              width="100%"
              placeholder="Enter house/road info"
            />
            <TextInput
              name="localArea"
              label="Local Area"
              required
              control={control}
              value={businessData.localArea}
              onChange={(e) => updateBusinessData("localArea", e.target.value)}
              width="100%"
              placeholder="Enter local area"
            />
            <TextInput
              name="city"
              label="City"
              control={control}
              value={businessData.city}
              onChange={(e) => updateBusinessData("city", e.target.value)}
              width="100%"
              placeholder="Enter city"
            />
            <TextInput
              name="postalCode"
              label="Postal Code"
              control={control}
              required
              value={businessData.postalCode}
              onChange={(e) => updateBusinessData("postalCode", e.target.value)}
              width="100%"
              placeholder="Enter postal code"
            />
            <TextInput
              name="country"
              label="Country"
              required
              control={control}
              value={businessData.country}
              onChange={(e) => updateBusinessData("country", e.target.value)}
              width="100%"
              placeholder="Enter country"
            />
          </div>
          <TextInput
            name="mobile"
            required
            label="Phone Number"
            placeholderIcon={Phone}
            control={control}
            value={businessData.mobile}
            onChange={(e) => updateBusinessData("mobile", e.target.value)}
            width="100%"
            placeholder="Enter mobile number"
          />
          <TextInput
            name="website"
            placeholderIcon={Globe}
            label="Website URL (Optional)"
            control={control}
            value={businessData.website}
            onChange={(e) => updateBusinessData("website", e.target.value)}
            width="100%"
            placeholder="Enter website URL"
          />
          <TextInput
            name="facebook"
            label="Facebook Page (Optional)"
            placeholderIcon={Facebook}
            control={control}
            value={businessData.facebook}
            onChange={(e) => updateBusinessData("facebook", e.target.value)}
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
      </div>
    </div>
  );
}
