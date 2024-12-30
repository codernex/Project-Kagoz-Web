"use client"

import { PremiumWarning } from "@/app/biz/_components/premium-warning";
import { Loader } from "@/components/shared/loader";
import { TextInput } from "@/components/shared/text-input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { appendApi } from "@/lib/utils";
import { useActivatePremiumFeatureMutation, useAddFeaturedOfferMutation, useGetFeaturedOfferQuery, useIsFeatureActiveQuery } from "@/redux/api";
import { FeatureType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createFeatureSchema = z.object({
  ctaUrl: z.string().min(2, "Call to action, URL is required to create an offer").url('Please enter a valid url')
})

export default function FeaturedOffer() {
  const [file, setFile] = useState<File | null | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const { slug } = useParams() as { slug: string }
  /**
   * Form
   */
  const form = useForm({
    defaultValues: {
      ctaUrl: ''
    },
    resolver: zodResolver(createFeatureSchema)
  })

  /**
   * Check is feature active query
   */

  const { data, isLoading } = useIsFeatureActiveQuery({ slug, type: FeatureType.FEATURED_OFFER })

  /**
   * Featured Offer Data
   */
  const { data: featuredOffers } = useGetFeaturedOfferQuery(slug)

  /**
   * Activate Premium Feature Mutation
   */
  const [activeFeature] = useActivatePremiumFeatureMutation()

  /**
   * Creat new offer mutation
   */
  const [addFeaturedOffer] = useAddFeaturedOfferMutation()

  const onSubmit: SubmitHandler<z.infer<typeof createFeatureSchema>> = (d) => {

    const formData = new FormData()

    Object.entries(d).forEach(([key, value]) => {
      formData.append(key, value)
    })

    if (file) {
      formData.append('image', file)
    } else {
      toast.error("Please select a file")
    }
    addFeaturedOffer({ slug, data: formData })
    setFile(undefined)
    setOpen(false)
  }

  if (isLoading) {
    return <Loader />
  }
  return (
    <div>
      <PremiumWarning btnAction={() => {
        activeFeature({ slug, type: FeatureType.FEATURED_OFFER })
          .then(res => {
            if (res.data?.url) {
              window.open(res.data.url,'_blank','width=600,height=400')
            }
          })
      }} feature={data} />
      <div className="flex items-center justify-between py-6">
        <div>
          <h1 className="font-bold text-black text-mdx">Featured Offer</h1>
        </div>
        <Button disabled={!data?.hasFeatureActive} className="h-16 bg-black rounded-sm" onClick={() => setOpen(true)}>
          Add Offer
        </Button>
      </div>
      <hr className="border-[#ededed] mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {
          featuredOffers?.map((offer) => {
            return (
              <div key={offer.id} className="w-full relative h-[30rem] rounded-xs overflow-hidden">
                <Image src={appendApi(offer.imageUrl)} fill alt="Test" />
              </div>
            )
          })
        }
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl !rounded-xs">
          <DialogHeader>
            <DialogTitle className="!text-black text-mdx">Add new client</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label className="!text-black text-xsm font-normal">
                  Featured Offer Image ()
                </Label>
                <Input required accept="image/jpeg,image/jpg,image/webp,image/png" className="!placeholder:text-muted text-muted cursor-pointer" onChange={e => {
                  setFile(e.target.files?.[0])
                }} type="file" />
              </div>
              <TextInput control={form.control} name="ctaUrl" label="CTA URL" placeholder="https://facebook.com" />
              <Button className="h-16 bg-black rounded-sm">
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
