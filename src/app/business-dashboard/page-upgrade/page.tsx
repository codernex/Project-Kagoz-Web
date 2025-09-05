"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Check, ArrowRight, Diamond} from "lucide-react"

import Phone from "../_components/page-upgrade/phone"
export default function PageUpgrade() {
  const [isUpgraded, setIsUpgraded] = useState(false)



  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Section - Content */}
          <div className="space-y-8">
            {/* Header */}
            
             <div>
          <h2 className="text-[32px] font-semibold text-[#111827]">Page Upgrades</h2>
          <p className="text-[#6F6D71] text-sm">
            Upgrade and enhance existing pages anytime
          </p>
        </div>

            {/* Main Benefit */}
            <div className="space-y-3">
              <h2 className="text-[24px] font-semibold text-[#111827]">
                Businesses see an average of 50 more page visits 14 days after setting it up
              </h2>
              <p className="text-[#6F6D71]">
                A set of features that boosts the appeal of your page and your business.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-900">Remove competitor ads from your business page</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-900">Stand out in search results and take more control of your business page</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-900">Convert more page views into calls, messages, and visits</span>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="bg-purple-50 border border-purple-200 rounded-[8px] p-4">
              <div className="flex items-start gap-2">
                <Diamond className="w-4 h-4 text-[#6F00FF] mt-0.5 flex-shrink-0" />
                <p className="text-purple-900 text-sm">
                  Bundle all Upgrade Package features at $6/day avg (compared to $16/day avg when purchased individually)
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              variant="submit"
              size="lg"
              className="w-full sm:w-auto text-lg px-6 md:px-8 py-4"
            >
              Get started with a 14 day free trial
              <ArrowRight className="w-5 h-5" />
            </Button>

            {/* Disclaimer */}
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                Based on a sample of businesses that set up Upgrade Package between November 2021 and March 2022. Study compared page views received 14 days before setting up versus 14 days after.
              </p>
              <p>
                Cancel anytime during your free trial. Charges apply after. Additional terms apply.
              </p>
            </div>

            {/* Question Link */}
            <div>
              <a href="#" className="text-[#6F00FF] hover:text-purple-700 font-medium">
                How is this different from Yelp Ads?
              </a>
            </div>
          </div>

          {/* Right Section - Mobile Mockup */}
          <div className="flex flex-col items-center mt-6 space-y-6">
            {/* Toggle Switch */}
            <div className="flex items-center gap-3 md:gap-4">
              <span className={`text-sm font-medium ${!isUpgraded ? 'text-gray-900' : 'text-[#6F6D71]'}`}>
                Before upgrade
              </span>
           
              <Switch
                          id="holidays"
                          checked={isUpgraded}
                onCheckedChange={setIsUpgraded}
                        />
              <span className={`text-sm font-medium ${isUpgraded ? 'text-gray-900' : 'text-gray-500'}`}>
                After upgrade
              </span>
            </div>

            {/* Mobile Phone Mockup */}
           <Phone />
          </div>
        </div>
      </div>
    </div>
  )
}
