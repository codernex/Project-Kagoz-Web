"use client";
import { PremiumWarning } from "@/app/biz/_components/premium-warning";
import { Loader } from "@/components/shared/loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { appendApi } from "@/lib/utils";
import { useActivatePremiumFeatureMutation, useAddFeaturedClientMutation, useGetFeauturedClientsQuery, useIsFeatureActiveQuery } from "@/redux/api";
import { FeatureType } from "@/types";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function BusinessFeaturedClients() {
  const [file, setFile] = useState<File | null | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const { slug } = useParams() as { slug: string }

  /**
   * Get Featured Client
   */
  const { data: featuredClients } = useGetFeauturedClientsQuery(slug)

  /**
   * Add Featured Client Mutation Hook
   */
  const [addClient] = useAddFeaturedClientMutation()

  const onSubmit = () => {
    if (!file) {
      toast.error("Please choose a file")
      return
    }
    const formData = new FormData()
    formData.append('image', file as any)
    addClient({ slug, data: formData })
    setFile(undefined);
    setOpen(false);
  };

  /**
   * Is Feature Active Query
   */
  const { data, isLoading } = useIsFeatureActiveQuery({ slug, type: 'FEATURED_CLIENT' })

  /**
  * Activate Premium Feature Mutation
  */
  const [activateFeature, { isLoading: activateFeatureLoading }] = useActivatePremiumFeatureMutation()

  if (isLoading) {
    return <Loader />
  }
  return (
    <div className="relative">
      <PremiumWarning feature={data} btnAction={() => {
        activateFeature({ slug, type: FeatureType.FEATURED_CLIENT }).then(res => {
          console.log(res);

          if (res.data?.url) {
            window.open(res.data.url,'_blank','width=600,height=400')
          }

        })
      }} isLoading={activateFeatureLoading} />
      <div className="flex items-center justify-between py-6">
        <div>
          <h1 className="font-bold text-black text-mdx">Featured Clients</h1>
        </div>
        <Button
          className="h-16 bg-black rounded-xs"
          onClick={() => setOpen(true)}
          disabled={!data?.hasFeatureActive}
        >
          Add Client
        </Button>
      </div>
      <hr className="border-[#ededed] mb-6" />

      {featuredClients?.length ? (
        <div className="grid grid-cols-6 mt-6">
          {featuredClients.map((file, index) => {
            return (
              <div
                key={index}
                className="max-w-[20rem] rounded-xs overflow-hidden bg-[#ededed]"
              >
                <Image width={200} height={200} src={appendApi(file.url)} alt="h" />
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-muted">
          No featured clients yet, Maybe try to add some!
        </p>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl !rounded-xs">
          <DialogHeader>
            <DialogTitle className="!text-black text-mdx">
              Add new client
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label className="!text-black text-xsm">Client Logo</Label>
            <Input
              className="!placeholder:text-muted text-muted cursor-pointer"
              onChange={(e) => {
                setFile(e.target.files?.[0]);
              }}
              type="file"
            />
          </div>
          <Button onClick={onSubmit} className="h-16 bg-black rounded-sm">
            Submit
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
