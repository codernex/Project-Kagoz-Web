'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Star, Play, Youtube, User, Building } from 'lucide-react'
import FileUploader from '@/components/bizness/file-upload'
import { TextInput } from '@/components/shared/text-input'
import { useForm, FormProvider } from 'react-hook-form'


interface UploadedFile {
  id: string
  file: File
  preview: string
  name: string
  size: string
}

interface SpecialFeaturesData {
  promoVideoUrl: string
  customerLogos: UploadedFile[]
  customerFeedback: {
    name: string
    company: string
    youtubeUrl: string
    rating: number
    customerImage: UploadedFile[]
  }
  featuredOffers: UploadedFile[]
}

export default function SpecialFeaturesPage() {
  const methods = useForm<SpecialFeaturesData>({
    defaultValues: {
      promoVideoUrl: '',
      customerLogos: [],
      customerFeedback: {
        name: '',
        company: '',
        youtubeUrl: '',
        rating: 1,
        customerImage: []
      },
      featuredOffers: []
    }
  });

  const { watch, setValue, handleSubmit: formHandleSubmit } = methods;
  const formData = watch();
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleError = (error: string) => {
    alert(error)
  }

  const handleCustomerLogosChange = (files: UploadedFile[]) => {
    setValue('customerLogos', files)
  }

  const handleCustomerImageChange = (files: UploadedFile[]) => {
    setValue('customerFeedback.customerImage', files)
  }

  const handleFeaturedOffersChange = (files: UploadedFile[]) => {
    setValue('featuredOffers', files)
  }

  const handleRatingChange = (rating: number) => {
    setValue('customerFeedback.rating', rating)
  }

  // Check if all required fields are filled
  const isFormValid = () => {
    // Check if at least one customer logo is uploaded
    const hasCustomerLogos = formData.customerLogos.length > 0
    
    // Check if customer feedback fields are filled
    const hasCustomerName = formData.customerFeedback.name.trim() !== ''
    const hasCompanyName = formData.customerFeedback.company.trim() !== ''
    const hasYoutubeUrl = formData.customerFeedback.youtubeUrl.trim() !== ''
    const hasCustomerImage = formData.customerFeedback.customerImage.length > 0
    
    // Check if at least one featured offer is uploaded
    const hasFeaturedOffers = formData.featuredOffers.length > 0
    
    return hasCustomerLogos && hasCustomerName && hasCompanyName && hasYoutubeUrl && hasCustomerImage && hasFeaturedOffers
  }

  const onSubmit = async (data: SpecialFeaturesData) => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Submitting Special Features Data:', data)
      
      // Simulate success
      alert('Special features saved successfully!')
      
    } catch (error) {
      console.error('Error saving special features:', error)
      alert('Error saving special features. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className=" space-y-6">
        {/* Special Features Header */}
        <div className="  p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Special Features</h1>
          <p className="text-gray-600">Enjoy the extra features that bring better experience</p>
        </div>

        {/* Add Promo Video Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Add Promo Video</h3>
              <p className="text-sm text-gray-600">Embed a YouTube video to promote your business</p>
            </div>
            <Button className="bg-[#6F00FF] hover:bg-purple-700 text-white flex items-center gap-2">
              <Play className="h-4 w-4" />
              See Tutorial
            </Button>
          </div>
          
          <div className="relative">
            {/* <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" /> */}
            <TextInput
              name="promoVideoUrl"
              control={methods.control}
              placeholder="Paste Youtube link"
              placeholderIcon={Youtube}
              width='100%'
            />
          </div>
        </div>

        {/* Add Customer Brand Logo Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Add Customer Brand Logo</h3>
              <p className="text-sm text-gray-600">Upload and showcase customer brand logos to highlight trusted collaborations</p>
            </div>
            <Button className="bg-[#6F00FF] hover:bg-purple-700 text-white flex items-center gap-2">
              <Play className="h-4 w-4" />
              See Tutorial
            </Button>
          </div>
          
          <FileUploader
            max={10}
            maxSizeMB={10}
            recommendedSize="500x500 px"
            value={formData.customerLogos}
            onChange={handleCustomerLogosChange}
            onError={handleError}
          />
        </div>

        {/* Customer Video Feedback Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Customer Video Feedback</h3>
              <p className="text-sm text-gray-600">Upload video testimonials from satisfied customers to build trust and engagement</p>
            </div>
            <Button className="bg-[#6F00FF] hover:bg-purple-700 text-white flex items-center gap-2">
              <Play className="h-4 w-4" />
              See Tutorial
            </Button>
          </div>
          
          <div className="space-y-4">
            {/* Customer Name */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Customer Name
              </Label>
              <div className="">
                
                <TextInput
                  name="customerFeedback.name"
                  control={methods.control}
                  placeholderIcon={User}
                  placeholder="Customer Name"
                  width='100%'
                />
              </div>
            </div>

            {/* Customer Image/Logo */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Customer Image/Logo
              </Label>
              <FileUploader
                max={1}
                maxSizeMB={10}
                recommendedSize="500x500 px"
                value={formData.customerFeedback.customerImage}
                onChange={handleCustomerImageChange}
                onError={handleError}
              />
            </div>

            {/* Company Name */}
            <div>
          
              <div className="">
                
                <TextInput
                  name="customerFeedback.company"
                  control={methods.control}
                  placeholderIcon={Building}
                  placeholder="Company Name"
                  width='100%'
                />
              </div>
            </div>

            {/* YouTube Link */}
            <div>
              
              <div className="">
                
                <TextInput
                  name="customerFeedback.youtubeUrl"
                  control={methods.control}
                  placeholderIcon={Youtube}
                  placeholder="Paste Youtube link"
                  width='100%'
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Rating
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
                      className={`h-5 w-5 ${
                        star <= formData.customerFeedback.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Offers Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Featured Offers</h3>
              <p className="text-sm text-gray-600">Display special offers that add value for your customers</p>
            </div>
            <Button className="bg-[#6F00FF] hover:bg-purple-700 text-white flex items-center gap-2">
              <Play className="h-4 w-4" />
              See Tutorial
            </Button>
          </div>
          
          <FileUploader
            max={5}
            maxSizeMB={10}
            recommendedSize="500x500 px"
            value={formData.featuredOffers}
            onChange={handleFeaturedOffersChange}
            onError={handleError}
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-center pt-6">
          <Button
            variant={'submit'}
            onClick={formHandleSubmit(onSubmit)}
            disabled={isSubmitting || !isFormValid()}
            className='w-full'
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
    </FormProvider>
  )
}
