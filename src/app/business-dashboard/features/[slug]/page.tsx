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
import VideoFeedbackDisplay from './_components/VideoFeedbackDisplay'
import { useBusinessStore } from '@/hooks/selectedBusiness'
import { toast } from 'sonner'
import { appendApi } from '@/lib/utils'
import Image from 'next/image'


interface UploadedFile {
  id: string
  file: File | null
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

  // Show loading state while fetching data
  const isLoading = videoLoading || offersLoading || clientsLoading || businessLoading


  // Auto-populate form fields based on API data
  useEffect(() => {
    if (isLoading) return;

    const populateForm = () => {
      // Set promo video URL
      if (businessData?.youtubeVideo) {
        console.log('Loading promo video from API:', businessData.youtubeVideo);
        setValue('promoVideoUrl', businessData.youtubeVideo);
      }

      // Set customer logos
      if (featuredClients && featuredClients.length > 0) {
        const convertedLogos = convertToUploadedFiles(featuredClients, 'image');
        setValue('customerLogos', convertedLogos);
      }

      // Set featured offers
      if (featuredOffers && featuredOffers.length > 0) {
        const convertedOffers = convertToUploadedFiles(featuredOffers, 'image');
        setValue('featuredOffers', convertedOffers);
        
        // Set CTA URL from first offer
        const firstOffer = featuredOffers[0];
        if (firstOffer?.ctaUrl) {
          setValue('featuredOfferCtaUrl', firstOffer.ctaUrl);
        }
      }

      // Set customer feedback
      if (videoFeedbacks && videoFeedbacks.length > 0) {
        const feedback = videoFeedbacks[0];
        setValue('customerFeedback.name', (feedback as any).name || '');
        setValue('customerFeedback.company', (feedback as any).company || '');
        setValue('customerFeedback.youtubeUrl', (feedback as any).url || (feedback as any).videoUrl || '');
        setValue('customerFeedback.rating', (feedback as any).rating || 1);
        
        if ((feedback as any).logo || (feedback as any).image) {
          const customerImage = convertToUploadedFiles([feedback], 'image');
          setValue('customerFeedback.customerImage', customerImage);
        }
      }
    };

    populateForm();
  }, [featuredClients, featuredOffers, videoFeedbacks, businessData, isLoading, setValue])


  // Convert API data to FileUploader format
  const convertToUploadedFiles = (items: any[], type: 'image' | 'video' = 'image') => {
    if (!items?.length) return [];

    return items
      .filter(item => {
        if (!item || typeof item !== 'object') return false;
        const imageUrl = item?.url || item?.imageUrl;
        return imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '';
      })
      .map((item, index) => {
        const imageUrl = item?.url || item?.imageUrl;
        const fullImageUrl = imageUrl.startsWith('http') 
          ? imageUrl 
          : `http://localhost:9000/uploads/${imageUrl}`;
        
        return {
          id: `existing-${type}-${index}-${Date.now()}`,
          file: null as any,
          preview: fullImageUrl,
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
    toast.error(error)
  }

  const handleCustomerLogosChange = (files: UploadedFile[]) => {
    setValue('customerLogos', files)
  }

  const handleCustomerImageChange = (files: UploadedFile[]) => {
    console.log('Customer image changed:', files)
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
    
    // Check if customer feedback fields are filled (all or none)
    const hasCustomerName = formData.customerFeedback.name.trim() !== ''
    const hasCompanyName = formData.customerFeedback.company.trim() !== ''
    const hasYoutubeUrl = formData.customerFeedback.youtubeUrl.trim() !== ''
    const hasCustomerImage = formData.customerFeedback.customerImage.length > 0 || (videoFeedbacks && videoFeedbacks.length > 0)
    
    // Customer feedback is optional - either all fields are filled or none
    const customerFeedbackComplete = (hasCustomerName && hasCompanyName && hasYoutubeUrl && hasCustomerImage) || 
                                   (!hasCustomerName && !hasCompanyName && !hasYoutubeUrl && !hasCustomerImage)
    
    // Check if at least one featured offer is uploaded (new or existing) and CTA URL is provided
    const hasFeaturedOffers = formData.featuredOffers.length > 0 || (featuredOffers && featuredOffers.length > 0)
    const hasCtaUrl = formData.featuredOfferCtaUrl.trim() !== ''
    
    // Debug logging
    console.log('Form validation debug:', {
      hasCustomerLogos,
      hasCustomerName,
      hasCompanyName,
      hasYoutubeUrl,
      hasCustomerImage,
      customerFeedbackComplete,
      hasFeaturedOffers,
      hasCtaUrl,
      formData: {
        customerLogos: formData.customerLogos.length,
        featuredOffers: formData.featuredOffers.length,
        featuredOfferCtaUrl: formData.featuredOfferCtaUrl,
        customerFeedback: formData.customerFeedback
      }
    })
    
    // Make customer feedback completely optional - only require customer logos and featured offers with CTA URL
    // But if customer feedback is provided, it should be complete
    const customerFeedbackValid = !hasCustomerName || (hasCustomerName && hasCompanyName && hasYoutubeUrl)
    
    return hasCustomerLogos && hasFeaturedOffers && hasCtaUrl && customerFeedbackValid
  }

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
        console.log('Submitting promo video:', {
          slug: targetSlug,
          youtubeVideo: data.promoVideoUrl
        })
        
        await updateBusinessYouTubeVideo({ 
          slug: targetSlug, 
          youtubeVideo: data.promoVideoUrl 
        }).unwrap()
        
        toast.success('Promo video updated successfully')
      }

      // 1) Upload customer logos (featured clients)
      if (data.customerLogos?.length) {
        for (const logo of data.customerLogos) {
          if (logo.file) {
            const fd = new FormData()
            fd.append('image', logo.file)
            await addFeaturedClient({ slug: targetSlug, data: fd }).unwrap()
            toast.success(`Brand logo "${logo.name}" uploaded successfully`)
          }
        }
      }

      // 2) Upload customer video feedback (multipart fields: logo, url, rating, name, companyName)
      if (data.customerFeedback?.youtubeUrl && data.customerFeedback?.name && data.customerFeedback?.company) {
        const fd = new FormData()
        
        // Add logo file if provided
        if (data.customerFeedback?.customerImage?.[0] && data.customerFeedback.customerImage[0].file) {
          const logoFile = data.customerFeedback.customerImage[0].file
          fd.append('logo', logoFile)
          console.log('Adding logo file to FormData:', logoFile.name, logoFile.size)
        } else {
          console.log('No logo file provided for video feedback')
        }
        
        // Add other fields (always required)
        fd.append('url', data.customerFeedback.youtubeUrl)
        fd.append('rating', String(Number(data.customerFeedback.rating)))
        fd.append('name', data.customerFeedback.name)
        fd.append('companyName', data.customerFeedback.company)
        
        // Debug: Log all FormData entries
        console.log('FormData contents:')
        for (let [key, value] of fd.entries()) {
          console.log(`${key}:`, value)
        }
        
        console.log('Submitting video feedback:', {
          url: data.customerFeedback.youtubeUrl,
          rating: data.customerFeedback.rating,
          name: data.customerFeedback.name,
          company: data.customerFeedback.company,
          hasLogo: !!(data.customerFeedback?.customerImage?.[0] && data.customerFeedback.customerImage[0].file)
        })
        
        await addVideoFeedback({ slug: targetSlug, data: fd }).unwrap()
        toast.success('Customer video feedback uploaded successfully')
      }

      // 3) Upload featured offers
      if (data.featuredOffers?.length) {
        for (const offer of data.featuredOffers) {
          if (offer.file) {
            const fd = new FormData()
            fd.append('image', offer.file)
            fd.append('ctaUrl', data.featuredOfferCtaUrl)
            
            console.log('Submitting featured offer:', {
              image: offer.file.name,
              ctaUrl: data.featuredOfferCtaUrl
            })
            
            await addFeaturedOffer({ slug: targetSlug, data: fd }).unwrap()
            toast.success(`Featured offer "${offer.name}" uploaded successfully`)
          }
        }
      }
      
      console.log('All special features submitted successfully!')
      toast.success('All special features saved successfully!')
      
    } catch (error) {
      console.error('Error saving special features:', error)
      toast.error('Error saving special features. Please try again.')
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
          <p className="text-sm text-gray-500 mt-2">Fetching data for: {targetSlug}</p>
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
            value={formData.customerLogos}
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

            {/* Customer Image Upload */}
            <div>
              <Label className="text-[14px] font-medium text-gray-700 mb-2 block">
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
          </div>
        </div>

        {/* Existing Video Feedbacks Display */}
        <VideoFeedbackDisplay 
          feedbacks={(videoFeedbacks || []).map((video: any) => ({
            id: video.id,
            videoUrl: video.videoUrl,
            logoUrl: video.logoUrl || '',
            rating: video.rating || 1,
            name: video.name || '',
            companyName: video.companyName || '',
            createdAt: video.createdAt || new Date().toISOString()
          }))} 
          businessSlug={targetSlug} 
        />

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
                CTA URL
              </Label>
              <TextInput
                name="featuredOfferCtaUrl"
                control={methods.control}
                placeholder="https://example.com/offer-details"
                width='100%'
              />
            </div>
            
            {/* File Upload */}
            <div>
              <Label className="text-[14px] font-medium text-gray-700 mb-2 block">
                Upload Files
              </Label>
              <FileUploader
                max={2}
                maxSizeMB={10}
                recommendedSize="500x500 px"
                value={formData.featuredOffers}
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
