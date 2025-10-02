'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Star, X, User, Building, Youtube } from 'lucide-react'
import { TextInput } from '@/components/shared/text-input'
import FileUploader from '@/components/bizness/file-upload'
import { useForm } from 'react-hook-form'
import { useUpdateVideoFeedbackMutation } from '@/redux/api'
import { toast } from 'sonner'

interface VideoFeedback {
  id: number
  videoUrl: string
  logoUrl: string
  rating: number
  name: string
  companyName: string
  createdAt: string
}

interface VideoFeedbackEditModalProps {
  feedback: VideoFeedback
  businessSlug: string
  isOpen: boolean
  onClose: () => void
}

interface EditFormData {
  name: string
  companyName: string
  youtubeUrl: string
  rating: number
  customerImage: any[]
}

export default function VideoFeedbackEditModal({ 
  feedback, 
  businessSlug, 
  isOpen, 
  onClose 
}: VideoFeedbackEditModalProps) {
  const [updateVideoFeedback] = useUpdateVideoFeedbackMutation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { control, handleSubmit, setValue, watch, reset } = useForm<EditFormData>({
    defaultValues: {
      name: feedback.name,
      companyName: feedback.companyName,
      youtubeUrl: feedback.videoUrl,
      rating: feedback.rating,
      customerImage: []
    }
  })

  const formData = watch()

  // Reset form when feedback changes
  useEffect(() => {
    if (feedback) {
      reset({
        name: feedback.name,
        companyName: feedback.companyName,
        youtubeUrl: feedback.videoUrl,
        rating: feedback.rating,
        customerImage: []
      })
    }
  }, [feedback, reset])

  const handleRatingChange = (rating: number) => {
    setValue('rating', rating)
  }

  const handleCustomerImageChange = (files: any[]) => {
    setValue('customerImage', files)
  }

  const onSubmit = async (data: EditFormData) => {
    setIsSubmitting(true)
    
    try {
      const formDataToSend = new FormData()
      
      // Add text fields
      formDataToSend.append('name', data.name)
      formDataToSend.append('companyName', data.companyName)
      formDataToSend.append('url', data.youtubeUrl)
      formDataToSend.append('rating', String(data.rating))
      
      // Add logo file if provided
      if (data.customerImage && data.customerImage.length > 0 && data.customerImage[0].file) {
        formDataToSend.append('logo', data.customerImage[0].file)
      }
      
      await updateVideoFeedback({ 
        slug: businessSlug, 
        feedbackId: String(feedback.id), 
        data: formDataToSend 
      }).unwrap()
      
      toast.success('Video feedback updated successfully')
      onClose()
    } catch (error) {
      console.error('Error updating video feedback:', error)
      toast.error('Failed to update video feedback')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[8px] w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Edit video feedback</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Customer Name */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Customer Name *
            </Label>
            <TextInput
              name="name"
              control={control}
              placeholder="Customer Name"
              placeholderIcon={User}
              width="100%"
            />
          </div>

          {/* Company Name */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Company Name
            </Label>
            <TextInput
              name="companyName"
              control={control}
              placeholder="Company Name"
              placeholderIcon={Building}
              width="100%"
            />
          </div>

          {/* Customer Image/Logo */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Customer Image/Logo
            </Label>
            <p className="text-xs text-gray-500 mb-2">PNG up to 10MB • Recommended size: 500×500 px</p>
            <FileUploader
              max={1}
              maxSizeMB={10}
              recommendedSize="500x500 px"
              value={formData.customerImage}
              onChange={handleCustomerImageChange}
              onError={(error) => toast.error(error)}
            />
          </div>

          {/* YouTube Link */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              ► YouTube Link *
            </Label>
            <p className="text-xs text-gray-500 mb-2">
              You can copy the url from youtube search bar, or you can click share button below the video.
            </p>
            <TextInput
              name="youtubeUrl"
              control={control}
              placeholder="https://www.youtube.com/watch?v=..."
              placeholderIcon={Youtube}
              width="100%"
            />
          </div>

          {/* Rating */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              ☆ Rating *
            </Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="p-1"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= formData.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#6F00FF] hover:bg-purple-700 text-white"
            >
              {isSubmitting ? 'Updating...' : 'Update Feedback'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
