"use client"

import React from 'react'
import { AlertCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadErrorHandlerProps {
  error: string | null
  onDismiss: () => void
  className?: string
}

export default function UploadErrorHandler({ 
  error, 
  onDismiss, 
  className 
}: UploadErrorHandlerProps) {
  if (!error) return null

  return (
    <div className={cn(
      "flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md",
      className
    )}>
      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm text-red-700 font-medium">Upload Error</p>
        <p className="text-xs text-red-600 mt-1 whitespace-pre-line">{error}</p>
      </div>
      <button
        onClick={onDismiss}
        className="text-red-400 hover:text-red-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
