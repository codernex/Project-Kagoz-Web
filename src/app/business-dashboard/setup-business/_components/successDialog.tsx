"use client"

import { Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface SuccessDialogProps {
  onContinue?: () => void
}

export function SuccessDialog({ onContinue }: SuccessDialogProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header with Progress Bar */}
      <div className="w-full bg-white border-b border-gray-200 py-[25px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Business Setup</h1>
            <div className="text-sm text-gray-500">
              Step 4 of 4 - 100% Complete
            </div>
          </div>
          
          {/* Progress container */}
          <div className="relative mt-10">
            {/* Purple background line - fully completed */}
            <div className="absolute top-5 left-0 w-full h-2 bg-[#6F00FF] rounded-full">
            </div>
            {/* Step circles - all completed with checkmarks */}
            <div className="relative flex justify-between">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className="sm:size-8 size-6 rounded-full mb-8 flex items-center justify-center text-sm font-medium z-10 bg-[#6F00FF] text-white"
                    style={{ marginTop: "-18px" }}
                  >
                    <Check className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Success Content */}
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <Card className="max-w-md w-full border-0 shadow-none">
          <CardContent className="p-8 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-[#6F00FF] rounded-full flex items-center justify-center">
                <Check className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Success Message */}
            <div className="mb-6">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <h1 className="text-2xl font-bold text-gray-900">Business Published!</h1>
              </div>
              
              <div className="space-y-2 text-gray-600">
                <p>Your business listing has been submitted for review.</p>
                <p>We&apos;ll notify you once it goes live on our platform.</p>
              </div>
            </div>

            {/* Action Button */}
            {onContinue && (
              <Button 
                onClick={onContinue}
                className="bg-[#6F00FF] hover:bg-purple-700 text-white px-8 py-3 rounded-lg"
              >
                Continue
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
