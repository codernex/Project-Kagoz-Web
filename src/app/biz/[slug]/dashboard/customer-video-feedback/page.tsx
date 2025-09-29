"use client"

import { PremiumWarning } from "@/app/biz/_components/premium-warning";
import { CustomButton } from "@/components/shared/custom-button";
import { Loader } from "@/components/shared/loader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn, extractYouTubeVideoId } from "@/lib/utils";
import { useActivatePremiumFeatureMutation, useAddVideoFeedbackMutation, useGetVideoFeedbacksQuery, useIsFeatureActiveQuery } from "@/redux/api";
import { CreateVideoFeedback, CreateVideoFeedbackSchema } from "@/schema/video-feedback";
import { FeatureType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon, Star, Upload, Building2, User, Play } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Player from "react-player/youtube";

export default function CustomerVideoFeedback() {
  const [open, setOpen] = useState(false)
  const { slug } = useParams() as { slug: string }
  const [videoUrl, setVideoUrl] = useState("");
  const [openPlayer, setOpenPlayer] = useState(false);
  const [showRemoveBtn, setShowRemoveBtn] = useState(false)
  const [editingVideo, setEditingVideo] = useState<any>(null)

  const form = useForm<CreateVideoFeedback>({
    defaultValues: {
      name: '',
      companyName: '',
      url: '',
      rating: 1,
      logo: null
    },
    resolver: zodResolver(CreateVideoFeedbackSchema)
  })

  /**
   * Activate Premium Feature Mutation
   */
  const [activateFeature, { isLoading: activateFeatureLoading }] = useActivatePremiumFeatureMutation()
  /**
   * Get Videos Query
   */
  const { data: videos } = useGetVideoFeedbacksQuery(slug)

  /**
   * Add Video Mutation
   */
  const [addVideo, { isLoading: videoAddLoading }] = useAddVideoFeedbackMutation()

  // Populate form when editing a video
  useEffect(() => {
    if (editingVideo) {
      form.reset({
        name: editingVideo.customerName || '',
        companyName: editingVideo.companyName || '',
        url: editingVideo.videoUrl || '',
        rating: editingVideo.rating || 1,
        logo: null // We don't pre-populate file uploads
      });
    } else {
      form.reset({
        name: '',
        companyName: '',
        url: '',
        rating: 1,
        logo: null
      });
    }
  }, [editingVideo, form]);

  const onSubmit: SubmitHandler<CreateVideoFeedback> = async (data) => {
    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      
      // Add text fields
      formData.append('name', data.name);
      formData.append('url', data.url);
      formData.append('rating', data.rating.toString());
      
      if (data.companyName) {
        formData.append('companyName', data.companyName);
      }
      
      // Add logo file if provided
      if (data.logo && data.logo instanceof File) {
        formData.append('logo', data.logo);
      }
      
      await addVideo({ slug, data: formData }).unwrap();
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error submitting video feedback:', error);
    }
  }

  /**
   * Has feature active
   */

  const { data, isLoading } = useIsFeatureActiveQuery({ slug, type: FeatureType.CUSTOMER_VIDEO_FEEDBACK })

  if (isLoading) {
    return (
      <Loader />
    )
  }
  return (
    <div>
      <PremiumWarning btnAction={() => {
        activateFeature({ slug, type: FeatureType.CUSTOMER_VIDEO_FEEDBACK }).then(res => {
          console.log(res);

          if (res.data?.url) {
            window.open(res.data.url)
          }

        })
      }} isLoading={activateFeatureLoading} feature={data} />
      <div className="flex items-center justify-between py-6">
        <div>
          <h1 className="font-bold text-black text-mdx">Customer Video Feedback</h1>
        </div>
        <Button
          disabled={!data?.hasFeatureActive}
          className="h-16 bg-black rounded-sm" 
          onClick={() => {
            setEditingVideo(null);
            setOpen(true);
          }}
        >
          Add Feedback
        </Button>
      </div>
      <hr className="border-[#ededed]" />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl !rounded-xs">
          <DialogHeader>
            <DialogTitle className="!text-black text-mdx">
              {editingVideo ? 'Edit video feedback' : 'Add new video feedback'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Customer Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Customer Name *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Customer Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company Name */}
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Company Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Company Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Customer Image/Logo Upload */}
              <FormField
                control={form.control}
                name="logo"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Customer Image/Logo
                    </FormLabel>
                    <FormDescription className="text-sm text-gray-500">
                      PNG up to 10MB • Recommended size: 500x500 px
                    </FormDescription>
                    <FormControl>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => onChange(e.target.files?.[0] || null)}
                          className="hidden"
                          id="logo-upload"
                          {...field}
                        />
                        <label htmlFor="logo-upload" className="cursor-pointer">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            Drop your image here or click to browse
                          </p>
                        </label>
                        {value && (
                          <div className="mt-2">
                            <p className="text-sm text-green-600">File selected: {value.name}</p>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* YouTube Link */}
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      YouTube Link *
                    </FormLabel>
                    <FormDescription className="text-sm text-gray-500">
                      You can copy the url from youtube search bar, or you can click share button below the video
                    </FormDescription>
                    <FormControl>
                      <Input placeholder="Paste Youtube link" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Rating */}
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Rating *
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => field.onChange(star)}
                            className={`p-1 ${
                              star <= field.value
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            } hover:text-yellow-400 transition-colors`}
                          >
                            <Star className="w-6 h-6 fill-current" />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {field.value} star{field.value !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CustomButton 
                type="submit" 
                isLoading={videoAddLoading} 
                className="w-full h-12 bg-black rounded-sm"
              >
                {editingVideo ? 'Update Feedback' : 'Submit Feedback'}
              </CustomButton>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-6">
        {
          videos?.map(video => {
            return (
              <div onMouseEnter={() => setShowRemoveBtn(true)} onMouseLeave={() => setShowRemoveBtn(false)} key={video.id} className="w-full  h-[20rem] relative rounded-[.8rem]  bg-white overflow-hidden flex items-center justify-center">
                <Image
                  src={`https://img.youtube.com/vi/${extractYouTubeVideoId(video.videoUrl)}/hqdefault.jpg`}
                  alt="Business Image"
                  className="w-[10rem] h-[8rem] z-0 object-cover"
                  fill
                />
                <div className="bg-[#00000080] z-20 relative w-full h-full" />
                <div
                  onClick={() => {
                    setOpenPlayer(true);
                    setVideoUrl(video.videoUrl);
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer"
                >
                  <svg
                    width="45"
                    height="44"
                    viewBox="0 0 45 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="0.833496"
                      y="0.5"
                      width="43"
                      height="43"
                      rx="21.5"
                      fill="white"
                      fillOpacity="0.3"
                    />
                    <rect
                      x="0.833496"
                      y="0.5"
                      width="43"
                      height="43"
                      rx="21.5"
                      stroke="white"
                    />
                    <path
                      d="M33.8335 19.4019C35.8335 20.5566 35.8335 23.4434 33.8335 24.5981L18.8335 33.2583C16.8335 34.413 14.3335 32.9697 14.3335 30.6603L14.3335 13.3397C14.3335 11.0303 16.8335 9.58697 18.8335 10.7417L33.8335 19.4019Z"
                      fill="#D9D9D9"
                    />
                  </svg>
                </div>
                <div className="absolute z-30 top-2 right-2 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingVideo(video);
                      setOpen(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full transition-colors"
                    title="Edit video feedback"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <XIcon onClick={() => {
                    console.log("Delete video:", video.id);
                  }} className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full cursor-pointer transition-colors" />
                </div>
              </div>
            )
          })
        }
      </div>

      <Dialog open={openPlayer} onOpenChange={setOpenPlayer}>
        <DialogContent className="max-w-7xl p-0 rounded-md overflow-hidden border-none h-1/2 bg-[#00000080]">
          <DialogTitle className="hidden">Title</DialogTitle>
          <Player
            width={"100%"}
            height={"100%"}
            controls
            playing={openPlayer}
            url={videoUrl}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
