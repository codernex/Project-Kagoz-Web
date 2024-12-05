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
import { XIcon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Player from "react-player/youtube";

export default function CustomerVideoFeedback() {
  const [open, setOpen] = useState(false)
  const { slug } = useParams() as { slug: string }
  const [videoUrl, setVideoUrl] = useState("");
  const [openPlayer, setOpenPlayer] = useState(false);
  const [showRemoveBtn, setShowRemoveBtn] = useState(false)

  const form = useForm<CreateVideoFeedback>({
    defaultValues: {
      url: ''
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

  const onSubmit: SubmitHandler<CreateVideoFeedback> = (d) => {
    addVideo({ ...d, slug })
    form.reset()
    setOpen(false)
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
      }} isLoading={activateFeatureLoading} hasPremium={data?.hasFeatureActive} />
      <div className="flex items-center justify-between py-6">
        <div>
          <h1 className="font-bold text-black text-mdx">Customer Video Feedback</h1>
        </div>
        <Button
          disabled={!data?.hasFeatureActive}
          className="h-16 bg-black rounded-sm" onClick={() => setOpen(true)}>
          Add Feedback
        </Button>
      </div>
      <hr className="border-[#ededed]" />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl !rounded-xs">
          <DialogHeader>
            <DialogTitle className="!text-black text-mdx">Add new video feedback</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>
                        Video Url (youtube) *
                      </FormLabel>
                      <FormDescription className="!text-muted text-xsm">
                        You can copy the url from youtube search bar, or you can click share button below the video
                      </FormDescription>
                      <FormControl>
                        <Input placeholder="eg: https://www.youtube.com/watch?v=yk52rBqJ4nQ " {...field} />
                      </FormControl>
                      <FormMessage className="!text-red-500 text-xsm" />
                    </FormItem>
                  )
                }}
                control={form.control} name="url" />
              <CustomButton isLoading={videoAddLoading} className="h-16 bg-black rounded-sm">
                Submit
              </CustomButton>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-4 gap-10 mt-6">
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
                <XIcon onClick={() => {
                  console.log("Hello");

                }} className={cn('absolute z-30 top-0 right-0 text-white cursor-pointer', showRemoveBtn ? 'visible' : 'hidden')} />
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
