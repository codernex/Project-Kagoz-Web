'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { Check, ArrowRight, Diamond, Pen, Globe, ArrowRightIcon, Video, Play, Timer, Star, Share2, Bookmark, Heart } from "lucide-react"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const Phone = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null)
    const [galleryIndex, setGalleryIndex] = useState(0)

    const faqs = [
      { q: "What is your return policy?", a: "We accept returns within 30 days of purchase with a receipt." },
      { q: "Do you offer international shipping?", a: "Yes, we ship worldwide with additional shipping costs." },
      { q: "Are your products authentic?", a: "All our items are 100% authentic and come with certificates." },
    ];



    const customerLogos = [
      "/icons/walton.png",
      "/icons/city.png",
      "/icons/akij.png",
      "/icons/agi.png",
    ];
  return (
    <div className="relative">
    {/* Phone Frame */}
    <div className="mx-auto w-[312px] h-[min(772px,calc(100vh-64px))] bg-white border-[5px] border-purple-200 rounded-[40px] shadow-xl relative overflow-hidden">

      {/* Notch */}
      <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-32 h-[27px] bg-black rounded-2xl z-10"></div>

      {/* Screen Content */}
      <div className="h-full overflow-y-auto bg-white scrollbar-hide pb-20">
        <div className="">
          <Image src="/images/navber.png" alt="Phone Frame" width={1000} height={1000} className="size-full" />
        </div>
        <div className="">
          <Image src="/images/herobg.png" alt="Phone Frame" width={1000} height={1000} className="size-full" />
        </div>
        {/* Header */}
        <Image
        src="/phone.png"
        alt="Phone Preview"
        width={1000}
        height={1000}
        className="object-fill max-h-full max-w-full"
        priority
      />
       
      </div>
    </div>

  </div>
  )
}

export default Phone
