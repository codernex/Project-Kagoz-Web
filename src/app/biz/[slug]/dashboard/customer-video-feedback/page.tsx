"use client"

import { PremiumWarning } from "@/app/biz/_components/premium-warning";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

export default function CustomerVideoFeedback() {
  const [file, setFile] = useState<File | null | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const [hasPremium, setHasPremium] = useState(false)

  useEffect(()=>{
    setHasPremium(true)
  },[])

  const onSubmit = () => {
    console.log(file);
    setFile(undefined)
    setOpen(false)
  }
  return (
    <div>
      <PremiumWarning hasPremium={hasPremium} />
      <div className="flex items-center justify-between py-6">
        <div>
          <h1 className="font-bold text-black text-mdx">Customer Video Feedback</h1>
        </div>
        <Button className="h-16 bg-black rounded-sm" onClick={() => setOpen(true)}>
          Add Feedback
        </Button>
      </div>
      <hr className="border-[#ededed]" />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl !rounded-xs">
          <DialogHeader>
            <DialogTitle className="!text-black text-mdx">Add new client</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label className="!text-black text-xsm">
              Client Logo
            </Label>
            <Input className="!placeholder:text-muted text-muted cursor-pointer" onChange={e => {
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
