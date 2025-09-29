'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Star, Play, Youtube, User, Building, CirclePlay } from 'lucide-react'
import FileUploader from '@/components/bizness/file-upload'
import { TextInput } from '@/components/shared/text-input'
import { useForm, FormProvider } from 'react-hook-form'
import { useParams, useRouter } from 'next/navigation'
import { useAddFeaturedClientMutation, useAddFeaturedOfferMutation, useAddVideoFeedbackMutation, useGetVideoFeedbacksQuery, useGetFeaturedOfferQuery, useGetFeauturedClientsQuery, useUpdateBusinessYouTubeVideoMutation, useGetBusinessBySlugQuery } from '@/redux/api'
import { useBusinessStore } from '@/hooks/selectedBusiness'
import { toast } from 'sonner'
import { appendApi } from '@/lib/utils'
import Image from 'next/image'


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
  featuredOfferCtaUrl: string
}

export default function SpecialFeaturesPage() {
  const { slug } = useParams() as { slug?: string }
  const { selectedSlug, loadSelectedSlug } = useBusinessStore()
  const router = useRouter()
  
  useEffect(() => { loadSelectedSlug() }, [loadSelectedSlug])

  // Route protection - redirect if no business is selected
  useEffect(() => {
    if (!selectedSlug && !slug) {
      router.push('/business-dashboard')
    }
  }, [selectedSlug, slug, router])

  // Get target slug for API calls
  const targetSlug = (slug as string) || (selectedSlug as string)

  // Fetch existing data
  const { data: videoFeedbacks, isLoading: videoLoading } = useGetVideoFeedbacksQuery(targetSlug, { skip: !targetSlug })
  const { data: featuredOffers, isLoading: offersLoading } = useGetFeaturedOfferQuery(targetSlug, { skip: !targetSlug })
  const { data: featuredClients, isLoading: clientsLoading } = useGetFeauturedClientsQuery(targetSlug, { skip: !targetSlug })
  const { data: businessData, isLoading: businessLoading } = useGetBusinessBySlugQuery(targetSlug, { skip: !targetSlug })
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
      featuredOffers: [],
      featuredOfferCtaUrl: ''
    }
  });

  const { watch, setValue, handleSubmit: formHandleSubmit, reset } = methods;
  const formData = watch();
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Populate form with existing data when it loads
  useEffect(() => {
    if (videoFeedbacks && videoFeedbacks.length > 0) {
      const latestFeedback = videoFeedbacks[0] // Get the most recent feedback
      // Note: The actual API response structure may vary, adjust property names as needed
      setValue('customerFeedback.name', (latestFeedback as any).name || '')
      setValue('customerFeedback.company', (latestFeedback as any).company || '')
      setValue('customerFeedback.youtubeUrl', (latestFeedback as any).url || (latestFeedback as any).videoUrl || '')
      setValue('customerFeedback.rating', (latestFeedback as any).rating || 1)
    }
  }, [videoFeedbacks, setValue])

  // Populate promo video URL from business data
  useEffect(() => {
    if (businessData?.youtubeVideo) {
      setValue('promoVideoUrl', businessData.youtubeVideo)
    }
  }, [businessData, setValue])

  // Agent-mode: Comprehensive image URL handling for FileUploader
  const convertToUploadedFiles = (items: any[], type: 'image' | 'video' = 'image') => {
    if (!items || !Array.isArray(items)) return [];

    return items
      .filter(item => {
        if (!item || typeof item !== 'object') return false;
        const imageUrl = item?.image || item?.logo || item?.url || item?.imageUrl;
        return imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '';
      })
      .map((item, index) => {
        const imageUrl = item?.image || item?.logo || item?.url || item?.imageUrl;
        
        return {
          id: `existing-${type}-${index}-${Date.now()}`,
          file: null as any,
          preview: imageUrl,
          name: item.name || `Existing ${type} ${index + 1}`,
          size: '0 KB'
        };
      });
  }

  const [addFeaturedClient] = useAddFeaturedClientMutation()
  const [addFeaturedOffer] = useAddFeaturedOfferMutation()
  const [addVideoFeedback] = useAddVideoFeedbackMutation()
  const [updateBusinessYouTubeVideo] = useUpdateBusinessYouTubeVideoMutation()

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

  // Check if all required fields are filled (including existing data)
  const isFormValid = () => {
    // Check if at least one customer logo is uploaded (new or existing)
    const hasCustomerLogos = formData.customerLogos.length > 0 || (featuredClients && featuredClients.length > 0)
    
    // Check if customer feedback fields are filled
    const hasCustomerName = formData.customerFeedback.name.trim() !== ''
    const hasCompanyName = formData.customerFeedback.company.trim() !== ''
    const hasYoutubeUrl = formData.customerFeedback.youtubeUrl.trim() !== ''
    const hasCustomerImage = formData.customerFeedback.customerImage.length > 0 || (videoFeedbacks && videoFeedbacks.length > 0)
    
    // Check if at least one featured offer is uploaded (new or existing) and CTA URL is provided
    const hasFeaturedOffers = formData.featuredOffers.length > 0 || (featuredOffers && featuredOffers.length > 0)
    const hasCtaUrl = formData.featuredOfferCtaUrl.trim() !== ''
    
    // Promo video is optional, so we don't include it in validation
    return hasCustomerLogos && hasCustomerName && hasCompanyName && hasYoutubeUrl && hasCustomerImage && hasFeaturedOffers && hasCtaUrl
  }

  // Show loading state while fetching data
  const isLoading = videoLoading || offersLoading || clientsLoading || businessLoading

  const onSubmit = async (data: SpecialFeaturesData) => {
    setIsSubmitting(true)
    
    try {
      const targetSlug = (slug as string) || (selectedSlug as string)
      if (!targetSlug || targetSlug === 'null') {
        toast.error('No business selected. Please select a business first.')
        return
      }

      // 0) Update promo video if provided
      if (data.promoVideoUrl?.trim()) {
        await updateBusinessYouTubeVideo({ 
          slug: targetSlug, 
          youtubeVideo: data.promoVideoUrl 
        }).unwrap()
      }

      // 1) Upload customer logos (featured clients)
      if (data.customerLogos?.length) {
        for (const logo of data.customerLogos) {
          const fd = new FormData()
          fd.append('image', logo.file as any)
          await addFeaturedClient({ slug: targetSlug, data: fd }).unwrap()
        }
      }

      // 2) Upload customer video feedback (multipart fields: logo, url, rating, name, companyName)
      if (data.customerFeedback?.customerImage?.[0] && data.customerFeedback.customerImage[0].file) {
        const fd = new FormData()
        const logoFile = data.customerFeedback.customerImage[0].file
        
        // Debug: Check if file exists
        console.log('Logo file:', logoFile)
        console.log('File type:', logoFile?.type)
        console.log('File size:', logoFile?.size)
        
        // Add logo file
        fd.append('logo', logoFile)
        
        // Add other fields
        fd.append('url', data.customerFeedback.youtubeUrl)
        fd.append('rating', String(Number(data.customerFeedback.rating)))
        fd.append('name', data.customerFeedback.name)
        fd.append('companyName', data.customerFeedback.company)
        
        console.log('FormData contents:', Array.from(fd.entries()))
        await addVideoFeedback({ slug: targetSlug, data: fd }).unwrap()
      } else if (data.customerFeedback?.youtubeUrl && data.customerFeedback?.name) {
        // Send feedback without logo if no image is provided
        const fd = new FormData()
        fd.append('url', data.customerFeedback.youtubeUrl)
        fd.append('rating', String(Number(data.customerFeedback.rating)))
        fd.append('name', data.customerFeedback.name)
        fd.append('companyName', data.customerFeedback.company)
        
        console.log('FormData contents (no logo):', Array.from(fd.entries()))
        await addVideoFeedback({ slug: targetSlug, data: fd }).unwrap()
      }

      // 3) Upload featured offers
      if (data.featuredOffers?.length) {
        for (const offer of data.featuredOffers) {
          const fd = new FormData()
          fd.append('image', offer.file as any)
          fd.append('ctaUrl', data.featuredOfferCtaUrl)
          await addFeaturedOffer({ slug: targetSlug, data: fd }).unwrap()
        }
      }
      alert('Special features saved successfully!')
      
    } catch (error) {
      console.error('Error saving special features:', error)
      alert('Error saving special features. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 sm:p-8 p-0 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6F00FF] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading existing features...</p>
        </div>
      </div>
    )
  }

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gray-50 sm:p-8 p-0">
        <div className=" space-y-6">
        {/* Special Features Header */}
        <div className="pl-2">
          <h1 className="sm:text-[32px] text-[26px] font-semibold text-[#111827] mb-2">Special Features</h1>
          <p className="text-[#6F6D71]">Enjoy the extra features that bring better experience</p>
        </div>

        {/* Add Promo Video Section */}
        <div className="bg-white rounded-[8px] shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-[1.5rem] font-semibold text-[#111827] mb-1">Add Promo Video</h3>
              <p className="text-[14px] text-[#6F6D71]">Embed a YouTube video to promote your business</p>
            </div>
            <button className="bg-[#6F00FF] rounded-[8px] p-[8px] w-fit hover:bg-purple-700 text-white flex items-center gap-2">
              <CirclePlay className="h-[16px] w-[16px]" />
              See Tutorial
            </button>
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
        <div className="bg-white rounded-[8px] shadow-sm p-6">
          <div className="flex items-start justify-between gap-2 mb-4">
            <div className="flex-1">
              <h3 className="text-[1.5rem] font-semibold text-[#111827] mb-1">Add Customer Brand Logo</h3>
              <p className="text-[14px] text-[#6F6D71]">Upload and showcase customer brand logos to highlight trusted collaborations</p>
            </div>
           <button className="bg-[#6F00FF] rounded-[8px] p-[8px] w-fit hover:bg-purple-700 text-white flex items-center gap-2">
              <CirclePlay className="h-[16px] w-[16px]" />
              See Tutorial
            </button>
          </div>
          
          <FileUploader
            max={10}
            maxSizeMB={10}
            recommendedSize="500x500 px"
            value={[...formData.customerLogos, ...(featuredClients ? convertToUploadedFiles(featuredClients, 'image') : [])]}
            onChange={handleCustomerLogosChange}
            onError={handleError}
          />
        </div>

        {/* Customer Video Feedback Section */}
        <div className="bg-white rounded-[8px] shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-[1.5rem] font-semibold text-[#111827] mb-1">Customer Video Feedback</h3>
              <p className="text-[14px] text-[#6F6D71]">Upload video testimonials from satisfied customers to build trust and engagement</p>
            </div>
           <button className="bg-[#6F00FF] rounded-[8px] p-[8px] w-fit hover:bg-purple-700 text-white flex items-center gap-2">
              <CirclePlay className="h-[16px] w-[16px]" />
              See Tutorial
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Customer Name */}
            <div>
              <Label className="text-[14px] font-medium text-gray-700 mb-2 block">
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
              <Label className="text-[14px] font-medium text-gray-700 mb-2 block">
                Customer Image/Logo
              </Label>
              <FileUploader
                max={1}
                maxSizeMB={10}
                recommendedSize="500x500 px"
                value={[...formData.customerFeedback.customerImage, ...(videoFeedbacks && videoFeedbacks.length > 0 ? convertToUploadedFiles([videoFeedbacks[0]], 'image') : [])]}
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
              <Label className="text-[14px] font-medium text-gray-700 mb-2 block">
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
        <div className="bg-white rounded-[8px] shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-[1.5rem] font-semibold text-[#111827] mb-1">Featured Offers</h3>
              <p className="text-[14px] text-[#6F6D71]">Display special offers that add value for your customers</p>
            </div>
            <button className="bg-[#6F00FF] rounded-[8px] p-[8px] w-fit hover:bg-purple-700 text-white flex items-center gap-2">
              <CirclePlay className="h-[16px] w-[16px]" />
              See Tutorial
            </button>
          </div>
          
          <div className="space-y-4">
            {/* CTA URL Field */}
            <div>
              <Label className="text-[14px] font-medium text-gray-700 mb-2 block">
                Call to Action URL
              </Label>
              <TextInput
                name="featuredOfferCtaUrl"
                control={methods.control}
                placeholder="https://example.com/offer"
                width='100%'
              />
            </div>
            
            {/* File Upload */}
            <div>
              <Label className="text-[14px] font-medium text-gray-700 mb-2 block">
                Upload Files
              </Label>
              <FileUploader
                max={5}
                maxSizeMB={10}
                recommendedSize="500x500 px"
                value={[...formData.featuredOffers, ...(featuredOffers ? convertToUploadedFiles(featuredOffers, 'image') : [])]}
                onChange={handleFeaturedOffersChange}
                onError={handleError}
              />
            </div>
          </div>
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
