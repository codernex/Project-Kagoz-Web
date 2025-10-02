'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Star, Play, Edit, Trash2, User, Building, Youtube, X } from 'lucide-react'
import Image from 'next/image'
import { useDeleteVideoFeedbackMutation } from '@/redux/api'
import { toast } from 'sonner'
import VideoFeedbackEditModal from './VideoFeedbackEditModal'
// import VideoFeedbackEditModal from './VideoFeedbackEditModal'

interface VideoFeedback {
  id: number
  videoUrl: string
  logoUrl: string
  rating: number
  name: string
  companyName: string
  createdAt: string
}

interface VideoFeedbackDisplayProps {
  feedbacks: VideoFeedback[]
  businessSlug: string
}

export default function VideoFeedbackDisplay({ feedbacks, businessSlug }: VideoFeedbackDisplayProps) {
  const [deleteVideoFeedback] = useDeleteVideoFeedbackMutation()
  const [editingFeedback, setEditingFeedback] = useState<VideoFeedback | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleDelete = async (feedbackId: number) => {
    if (window.confirm('Are you sure you want to delete this video feedback?')) {
      try {
        await deleteVideoFeedback({ slug: businessSlug, feedbackId: String(feedbackId) }).unwrap()
        toast.success('Video feedback deleted successfully')
      } catch (error) {
        toast.error('Failed to delete video feedback')
      }
    }
  }

  const handleEdit = (feedback: VideoFeedback) => {
    setEditingFeedback(feedback)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingFeedback(null)
  }

  const resolveImageSrc = (src: string): string => {
    if (!src) return ""
    if (src.startsWith("data:") || src.startsWith("blob:")) return src
    if (src.startsWith("http")) return src
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"
    return `${backendUrl}/uploads/${src}`
  }

  const getYouTubeThumbnail = (url: string): string => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    }
    return ''
  }

  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div className="bg-white rounded-[8px] shadow-sm p-6">
        <h3 className="text-[1.5rem] font-semibold text-[#111827] mb-4">Video Feedbacks</h3>
        <p className="text-gray-500 text-center py-8">No video feedbacks found</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-[8px] shadow-sm p-6">
        <h3 className="text-[1.5rem] font-semibold text-[#111827] mb-4">Video Feedbacks</h3>
        
        <div className="flex gap-4 overflow-x-auto py-4">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="flex-shrink-0  bg-white border border-gray-200 rounded-[8px] w-[150px] p-3 hover:shadow-md transition-shadow">
              <div className="space-y-2">
                {/* Video Thumbnail */}
                <div 
                  className="relative w-full h-32 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-[8px] overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border-2 border-black"
                  onClick={() => window.open(feedback.videoUrl, '_blank')}
                >
                  {/* Yellow Background with Text */}
               
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 text-gray-700 ml-0.5" />
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(feedback)
                      }}
                      className="w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(feedback.id)
                      }}
                      className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>

            
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingFeedback && (
        <VideoFeedbackEditModal
          feedback={editingFeedback}
          businessSlug={businessSlug}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
        />
      )}
    </>
  )
}
