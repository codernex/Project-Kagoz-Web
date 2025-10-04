"use client"

import React from 'react'
import { X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoUrl: string
  title?: string
}

export default function VideoModal({ isOpen, onClose, videoUrl, title = "Tutorial Video" }: VideoModalProps) {
  // Use the video URL directly from API without forcing embed format
  const finalVideoUrl = videoUrl

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 bg-white">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-gray-900 text-lg font-semibold">
              {title}
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-700 hover:text-gray-500 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </DialogHeader>
        
        <div className="p-4 pt-0">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={finalVideoUrl}
              title={title}
              className="absolute top-0 left-0 w-full h-full rounded-lg border border-gray-200"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onError={() => console.error("❌ Iframe failed to load")}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
