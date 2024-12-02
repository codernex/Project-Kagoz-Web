"use client";
import { PremiumWarning } from "@/app/biz/_components/premium-warning";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function BusinessFeaturedClients() {
  const [file, setFile] = useState<File | null | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [hasPremium, setHasPremium] = useState(false)

  const [files, setFiles] = useState<File[]>([]);

  const onSubmit = () => {
    console.log(file);
    if (file) setFiles((prev) => [...prev, file]);
    setFile(undefined);
    setOpen(false);
  };
  return (
    <div className="relative">
      <PremiumWarning hasPremium={hasPremium} />
      <div className="flex items-center justify-between py-6">
        <div>
          <h1 className="font-bold text-black text-mdx">Featured Clients</h1>
        </div>
        <Button
          className="h-16 bg-black rounded-xs"
          onClick={() => setOpen(true)}
          disabled={!hasPremium}
        >
          Add Client
        </Button>
      </div>
      <hr className="border-[#ededed] mb-6" />

      {files.length ? (
        <div className="grid grid-cols-6 mt-6">
          {files.map((file, index) => {
            return (
              <div
                key={index}
                className="max-w-[20rem] rounded-xs overflow-hidden"
              >
                <img src={URL.createObjectURL(file)} alt="h" />
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
