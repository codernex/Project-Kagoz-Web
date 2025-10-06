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
import VideoModal from '@/components/shared/video-modal'
import { ImageUpload } from '@/components/bizness/image-uploader'


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
  const [changedModules, setChangedModules] = useState<Set<string>>(new Set())
  const [youtubeUrlError, setYoutubeUrlError] = useState<string>('')

  // Video modal state
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const tutorialVideoUrl = "https://youtu.be/2cxz4HicFvs?si=ZwBorNGgIDG9WdED" // Your actual tutorial video

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

      // Set featured offers with images
      if (featuredOffers && featuredOffers.length > 0) {
        // Convert featured offer images to ImageUpload format
        const offerImages = featuredOffers.map((offer: any, index: number) => ({
          id: `existing-offer-${offer.id || index}`,
          file: null,
          preview: offer.imageUrl?.startsWith('http') 
            ? offer.imageUrl 
            : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api/v1"}/uploads/${offer.imageUrl}`,
          name: `Featured Offer ${index + 1}`,
          size: '0 KB',
          uploaded: true
        }));
        setValue('featuredOffers', offerImages);
        
        // Set CTA URL from first offer
        const firstOffer = featuredOffers[0];
        if (firstOffer?.ctaUrl) {
          setValue('featuredOfferCtaUrl', firstOffer.ctaUrl);
        }
      }

      if (videoFeedbacks && videoFeedbacks.length > 0) {
        // Don't auto-populate customer feedback fields - let user enter fresh data
        // const firstFeedback = videoFeedbacks[0] as any;
        // if (firstFeedback) {
        //   setValue('customerFeedback.name', firstFeedback?.name || '');
        //   setValue('customerFeedback.company', firstFeedback?.companyName || '');
        //   setValue('customerFeedback.youtubeUrl', firstFeedback?.videoUrl || '');
        //   setValue('customerFeedback.rating', firstFeedback?.rating || 1);
        // }
        
        // Convert logo URLs to ImageUpload format
        const logoImages = videoFeedbacks.map((feedback: any, index: number) => ({
          id: `existing-logo-${feedback.id || index}`,
          file: null,
          preview: feedback.logoUrl?.startsWith('http') 
            ? feedback.logoUrl 
            : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api/v1"}/uploads/${feedback.logoUrl}`,
          name: `${feedback.name || 'Customer'} Logo`,
          size: '0 KB',
          uploaded: true
        }));
        setValue('customerFeedback.customerImage', logoImages);
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
          : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api/v1"}/uploads/${imageUrl}`;
        
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
    setChangedModules(prev => new Set([...prev, 'customerLogos']))
  }

  const handleCustomerImageChange = (files: UploadedFile[]) => {
    console.log('Customer image changed:', files)
    setValue('customerFeedback.customerImage', files)
    setChangedModules(prev => new Set([...prev, 'customerFeedback']))
  }

  const handleFeaturedOffersChange = (files: UploadedFile[]) => {
    setValue('featuredOffers', files)
    setChangedModules(prev => new Set([...prev, 'featuredOffers']))
  }

  const handleRatingChange = (rating: number) => {
    setValue('customerFeedback.rating', rating)
    setChangedModules(prev => new Set([...prev, 'customerFeedback']))
  }

  const handlePromoVideoChange = (url: string) => {
    setValue('promoVideoUrl', url)
    setChangedModules(prev => new Set([...prev, 'promoVideo']))
  }

  const handleCustomerFeedbackFieldChange = (field: string, value: any) => {
    if (field === 'name') {
      setValue('customerFeedback.name', value)
    } else if (field === 'company') {
      setValue('customerFeedback.company', value)
    } else if (field === 'youtubeUrl') {
      setValue('customerFeedback.youtubeUrl', value)
      // Real-time validation for YouTube URL
      const validation = validateYouTubeUrl(value)
      setYoutubeUrlError(validation.isValid ? '' : validation.message)
    } else if (field === 'rating') {
      setValue('customerFeedback.rating', value)
    }
    setChangedModules(prev => new Set([...prev, 'customerFeedback']))
  }

  // YouTube URL validation
  const validateYouTubeUrl = (url: string): { isValid: boolean; message: string } => {
    if (!url.trim()) {
      return { isValid: true, message: '' } // Empty is valid (optional field)
    }
    
    // Check if URL contains 'watch' (required for YouTube video URLs)
    if (!url.includes('watch')) {
      return { 
        isValid: false, 
        message: 'Please enter a valid YouTube video URL (must contain "watch")' 
      }
    }
    
    // Check if it's a YouTube URL
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      return { 
        isValid: false, 
        message: 'Please enter a valid YouTube URL' 
      }
    }
    
    // Check for video ID pattern
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    if (!videoIdMatch) {
      return { 
        isValid: false, 
        message: 'Please enter a valid YouTube video URL format' 
      }
    }
    
    return { isValid: true, message: 'Valid YouTube URL' }
  }


  // Check if all required fields are filled (including existing data)
  const isFormValid = () => {
    // Check if customer feedback fields are filled (all or none)
    const hasCustomerName = formData.customerFeedback.name.trim() !== ''
    const hasCompanyName = formData.customerFeedback.company.trim() !== ''
    const hasYoutubeUrl = formData.customerFeedback.youtubeUrl.trim() !== ''
    const hasCustomerImage = formData.customerFeedback.customerImage.length > 0 || (videoFeedbacks && videoFeedbacks.length > 0)
    
    // Validate YouTube URL if provided
    const youtubeUrlValid = !hasYoutubeUrl || validateYouTubeUrl(formData.customerFeedback.youtubeUrl).isValid
    
    // Customer feedback is optional - either all fields are filled or none
    const customerFeedbackComplete = (hasCustomerName && hasCompanyName && hasYoutubeUrl && hasCustomerImage && youtubeUrlValid) || 
                                   (!hasCustomerName && !hasCompanyName && !hasYoutubeUrl && !hasCustomerImage)
    
    // Debug logging
    console.log('Form validation debug:', {
      hasCustomerName,
      hasCompanyName,
      hasYoutubeUrl,
      hasCustomerImage,
      customerFeedbackComplete,
      formData: {
        customerLogos: formData.customerLogos.length,
        featuredOffers: formData.featuredOffers.length,
        featuredOfferCtaUrl: formData.featuredOfferCtaUrl,
        customerFeedback: formData.customerFeedback
      }
    })
    
    // Make customer feedback completely optional - only require that if customer feedback is provided, it should be complete
    const customerFeedbackValid = !hasCustomerName || (hasCustomerName && hasCompanyName && hasYoutubeUrl)
    
    // Form is valid if customer feedback is valid (all other fields are optional)
    return customerFeedbackValid
  }

  const onSubmit = async (data: SpecialFeaturesData) => {
    setIsSubmitting(true)
    
    try {
      const targetSlug = (slug as string) || (selectedSlug as string)
      if (!targetSlug || targetSlug === 'null') {
        toast.error('No business selected. Please select a business first.')
        return
      }

      console.log('Changed modules:', Array.from(changedModules))

      // 0) Update promo video if provided AND changed
      if (changedModules.has('promoVideo') && data.promoVideoUrl?.trim()) {
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

      // 1) Upload customer logos (featured clients) - optional AND changed
      if (changedModules.has('customerLogos') && data.customerLogos?.length) {
        for (const logo of data.customerLogos) {
          if (logo.file) {
            const fd = new FormData()
            fd.append('image', logo.file)
            await addFeaturedClient({ slug: targetSlug, data: fd }).unwrap()
            toast.success(`Brand logo "${logo.name}" uploaded successfully`)
          }
        }
      }

      // 2) Upload customer video feedback (multipart fields: logo, url, rating, name, companyName) - only if changed
      if (changedModules.has('customerFeedback') && data.customerFeedback?.youtubeUrl && data.customerFeedback?.name && data.customerFeedback?.company) {
        const fd = new FormData()
        
        // Add logo file if provided - check for new files (with file property)
        const customerImages = data.customerFeedback?.customerImage || []
        const newLogoFile = customerImages.find(img => img.file) // Find image with file property
        
        if (newLogoFile && newLogoFile.file) {
          fd.append('logo', newLogoFile.file)
          console.log('Adding logo file to FormData:', newLogoFile.file.name, newLogoFile.file.size)
        } else {
          console.log('No new logo file provided for video feedback')
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
          hasLogo: !!(newLogoFile && newLogoFile.file)
        })
        
        await addVideoFeedback({ slug: targetSlug, data: fd }).unwrap()
        toast.success('Customer video feedback uploaded successfully')
      }

      // 3) Upload featured offers - optional AND changed
      if (changedModules.has('featuredOffers') && data.featuredOffers?.length) {
        for (const offer of data.featuredOffers) {
          if (offer.file) {
            const fd = new FormData()
            fd.append('image', offer.file)
            // Only add CTA URL if provided
            if (data.featuredOfferCtaUrl?.trim()) {
              fd.append('ctaUrl', data.featuredOfferCtaUrl)
            }
            
            console.log('Submitting featured offer:', {
              image: offer.file.name,
              ctaUrl: data.featuredOfferCtaUrl || 'No CTA URL provided'
            })
            
            await addFeaturedOffer({ slug: targetSlug, data: fd }).unwrap()
            toast.success(`Featured offer "${offer.name}" uploaded successfully`)
          }
        }
      }
      
      console.log('All special features submitted successfully!')
      toast.success('All special features saved successfully!')
      
      // Clear changed modules after successful submission
      setChangedModules(new Set())
      
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
            <button 
              onClick={() => setIsVideoModalOpen(true)}
              className="bg-[#6F00FF] rounded-[8px] p-[8px] w-fit hover:bg-purple-700 text-white flex items-center gap-2"
            >
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
              onChange={(e) => handlePromoVideoChange(e.target.value)}
            />
          </div>
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
                  onChange={(e) => handleCustomerFeedbackFieldChange('name', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label className="text-[14px] font-medium text-gray-700 mb-2 block">
                Customer Logos
              </Label>
              <ImageUpload
                acceptedTypes={["image/png"]}
                max={5}
                maxSizeMB={1}
                recommendedSize="500x500 px"
                disableRemove={true}
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
                  onChange={(e) => handleCustomerFeedbackFieldChange('company', e.target.value)}
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
                  onChange={(e) => handleCustomerFeedbackFieldChange('youtubeUrl', e.target.value)}
                  width='100%'
                />
                {youtubeUrlError && (
                  <p className="text-red-500 text-sm mt-1">{youtubeUrlError}</p>
                )}
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
                      className={`h-[16px] w-[16px] ${
                        star <= formData.customerFeedback.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex">
            {videoFeedbacks && videoFeedbacks.length > 0 && (
           <div className="bg-white rounded-[8px] w-full p-6">
            <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {videoFeedbacks.map((feedback: any, index: number) => {
                const getVideoId = (url: string) => {
                  if (!url) return null;
                  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
                  return match ? match[1] : null;
                };
                
                const videoId = getVideoId(feedback.videoUrl || feedback.url);
                
                return (
                <div key={feedback.id || index} className="flex-shrink-0">
                   
                  {/* Video Thumbnails */}
                  {videoId && (
                    <div 
                      className="relative w-[190px] h-[120px] bg-gray-200 rounded-[8px] overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
                      onClick={() => window.open(feedback.videoUrl || feedback.url, '_blank')}
                    >
                      <img 
                        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                        alt={`${feedback.name || 'Customer'} video thumbnail`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <div className="w-0 h-0 border-l-[6px] border-l-gray-600 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1"></div>
                        </div>
                      </div>
                      
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          </div>
        )}
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
          
          
      
            <div>
              
              <ImageUpload
                acceptedTypes={["image/png"]}
                max={2}
                maxSizeMB={1}
                recommendedSize="500x500 px"
                disableRemove={true}
                value={formData.featuredOffers}
                onChange={handleFeaturedOffersChange}
                onError={handleError}
              />
            </div>
        </div>

      

        {/* Save Button */}
        <div className="flex justify-center p-6">
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
    
    {/* Video Modal */}
    <VideoModal
      isOpen={isVideoModalOpen}
      onClose={() => setIsVideoModalOpen(false)}
      videoUrl={tutorialVideoUrl}
      // title="Tutorial: How to Add Promo Video"
    />
    </FormProvider>
  )
}
