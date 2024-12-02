"use client"

import { PremiumWarning } from "@/app/biz/_components/premium-warning";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Gallery() {
  const [file, setFile] = useState<File | null | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const [hasPremium, setHasPremium] = useState(false)

  useEffect(() => {
    setHasPremium(true)
  }, [])

  const onSubmit = () => {
    console.log(file);
    setFile(undefined)
    setOpen(false)
  }
  return (
    <div>
      <PremiumWarning hasPremium={hasPremium} />
      <div className="flex items-center justify-between py-6">
        <div className="flex items-center space-x-2 ">
          <h1 className="font-bold text-black text-mdx">Photo Gallery</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="cursor-pointer text-muted"/>
              </TooltipTrigger>
              <TooltipContent>
                <p>Maximum of 5 photos</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button className="h-16 bg-black rounded-sm" onClick={() => setOpen(true)}>
          Add Photo
        </Button>
      </div>
      <hr className="border-[#ededed]" />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl !rounded-xs">
          <DialogHeader>
            <DialogTitle className="!text-black text-mdx">Add new photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label className="!text-black text-xsm">
              Photo <span className="text-muted text-xs">
                (1200 x 885 px) JPG, JPEG, PNG, WEBP
              </span>
            </Label>
            <Input accept="image/png,image/jpg,image/jpeg,image/webp" className="!placeholder:text-muted text-muted cursor-pointer" onChange={e => {
              setFile(e.target.files?.[0])
            }} type="file" />
          </div>
          <Button onClick={onSubmit} className="h-16 bg-black rounded-sm">
            Submit
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
