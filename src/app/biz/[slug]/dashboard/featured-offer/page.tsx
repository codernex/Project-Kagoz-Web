"use client"

import { CustomButton } from "@/components/shared/custom-button";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function FeaturedOffer() {
  const [file, setFile] = useState<File | null | undefined>(undefined)
  const [open, setOpen] = useState(false)

  const onSubmit = () => {
    console.log(file);
    setFile(undefined)
    setOpen(false)
  }
  return (
    <div>
      <div className="flex items-center justify-between py-6">
        <div>
          <h1 className="font-bold text-black text-mdx">Featured Offer</h1>
        </div>
        <Button className="h-16 bg-black rounded-sm" onClick={() => setOpen(true)}>
          Add Offer
        </Button>
      </div>
      <hr className="border-[#ededed]"/>

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
