"use client"

import { Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface SuccessDialogProps {
  onContinue?: () => void
}

export function SuccessDialog({ onContinue }: SuccessDialogProps) {
  return (
    <div className="min-h-[60vh] bg-white">
      {/* Header with Progress Bar */}
     

      {/* Success Content */}
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <div className=" w-full border-0 shadow-none">
          <div className="p-8 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-[#6F00FF] rounded-full flex items-center justify-center">
                <Check className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Success Message */}
            <div className="mb-6">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <h1 className="text-[24px] font-medium text-[#111827]">Business Published!</h1>
              </div>
              
              <div className="space-y-2 text-[#2D3643]">
                <p>Your business listing has been submitted for review.</p>
                <p>We&apos;ll notify you once it goes live on our platform.</p>
              </div>
            </div>

            {/* Action Button */}
          
          </div>
        </div>
      </div>
    </div>
  )
}
