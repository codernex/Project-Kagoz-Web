"use client"

import React, { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoUrl: string
  title?: string
}

export default function VideoModal({ isOpen, onClose, videoUrl, title = "Tutorial Video" }: VideoModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Convert YouTube URL to embed format
  const convertToEmbedUrl = (url: string) => {
    if (!url) return ''
    
    // Handle youtu.be format
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    
    // Handle youtube.com/watch format
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    
    // If already embed format, return as is
    if (url.includes('youtube.com/embed')) {
      return url
    }
    
    // Fallback to original URL
    return url
  }

  const finalVideoUrl = convertToEmbedUrl(videoUrl)

  // Reset loading state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      setHasError(false)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 bg-white">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className=" sm:text-[20px] text-[16px] font-semibold">
              {title}
            </DialogTitle>
          
          </div>
        </DialogHeader>
        
        <div className="p-4 pt-0">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-[#6F00FF]" />
                  <p className="text-sm text-gray-600">Loading video...</p>
                </div>
              </div>
            )}
            
            {hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                  <p className="text-red-600 mb-2">Failed to load video</p>
                  <p className="text-sm text-gray-600">Please check the video URL</p>
                </div>
              </div>
            )}
            
            {!hasError && (
              <iframe
                src={finalVideoUrl}
                title={title}
                className="absolute top-0 left-0 w-full h-full rounded-lg border border-gray-200"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => {
                  setIsLoading(false)
                  setHasError(false)
                }}
                onError={() => {
                  console.error("❌ Iframe failed to load")
                  setIsLoading(false)
                  setHasError(true)
                }}
                style={{ display: isLoading ? 'none' : 'block' }}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
