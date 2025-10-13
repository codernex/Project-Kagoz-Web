"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  businessName: string
  isLoading?: boolean
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  businessName,
  isLoading = false
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 sm:p-6 max-w-[444px] w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-[20px] h-[20px]" />
        </button>

        {/* SVG Illustration */}
        <div className="flex justify-center mb-6">
          <svg
            width="300"
            height="300"
            viewBox="0 0 300 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[160px] h-[160px] sm:w-[200px] sm:h-[200px]"
          >
            {/* Background circle */}
            <circle
              cx="150"
              cy="150"
              r="140"
              fill="#FEF2F2"
              stroke="#FECACA"
              strokeWidth="2"
            />
            
            {/* Trash can body */}
            <rect
              x="110"
              y="80"
              width="80"
              height="100"
              rx="8"
              fill="#EF4444"
              stroke="#DC2626"
              strokeWidth="2"
            />
            
            {/* Trash can lid */}
            <rect
              x="100"
              y="70"
              width="100"
              height="20"
              rx="10"
              fill="#EF4444"
              stroke="#DC2626"
              strokeWidth="2"
            />
            
            {/* Lid handle */}
            <rect
              x="130"
              y="60"
              width="40"
              height="10"
              rx="5"
              fill="#EF4444"
              stroke="#DC2626"
              strokeWidth="2"
            />
            
            {/* Trash lines */}
            <line
              x1="120"
              y1="100"
              x2="180"
              y2="100"
              stroke="#FEF2F2"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="120"
              y1="120"
              x2="180"
              y2="120"
              stroke="#FEF2F2"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="120"
              y1="140"
              x2="180"
              y2="140"
              stroke="#FEF2F2"
              strokeWidth="3"
              strokeLinecap="round"
            />
            
            {/* Warning triangle */}
            <path
              d="M150 200 L130 240 L170 240 Z"
              fill="#F59E0B"
              stroke="#D97706"
              strokeWidth="2"
            />
            
            {/* Exclamation mark */}
            <line
              x1="150"
              y1="210"
              x2="150"
              y2="230"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle
              cx="150"
              cy="245"
              r="3"
              fill="#FFFFFF"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-[20px] sm:text-[33px] font-semibold text-gray-900 mb-2">
            Delete Business
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete <strong>&quot;{businessName}&quot;</strong>? 
            This action cannot be undone and will permanently remove all business data.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2"
            >
              Cancel
            </Button>
            <Button
              variant="submit"
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full sm:w-[100px] px-6 py-2"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
