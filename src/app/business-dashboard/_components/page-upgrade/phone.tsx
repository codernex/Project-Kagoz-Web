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
    <div className="mx-auto w-[25.75rem] h-[min(772px,calc(100vh-64px))] bg-white border-[5px] border-purple-200 rounded-[40px] shadow-xl relative overflow-hidden">

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
        <div className="flex gap-1.5 w-full mx-auto justify-center -mt-5">
          <div className="p-2 bg-white w-1/2 rounded-[6px]">
            {/* Title + Verified */}
            <div className="flex items-center">
              <div className="p-0.5 size-5 border rounded">
                <Image src="/images/logo.png" alt="Business Logo" width={1000} height={1000} className="size-full" />
              </div>
              <div className="ml-2 flex items-center gap-1">
                <span className="text-[9px] font-semibold leading-none">Louis Vuitton</span>
                <span className="inline-flex items-center justify-center gap-0.5 rounded-full bg-[#6F00FF]/10 text-[#6F00FF] px-1.5 py-0.5 text-[7px]"><Check className="size-2" /> Verified</span>
              </div>
            </div>

            {/* Status + Meta */}
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[7px] text-[#4B4B4C]">
              <span className="inline-flex items-center gap-1 text-[#16A34A]">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                Open Now
              </span>
              <span className="w-px h-2 bg-[#D9D9D9]"></span>
              <span>12 years in business</span>
              <span className="w-px h-2 bg-[#D9D9D9]"></span>
              <span>6 months with KAGOZ</span>
              <span className="w-px h-2 bg-[#D9D9D9]"></span>
              <span className="inline-flex items-center gap-1 text-[#16A34A]"><Check className="size-2" /> Verified License</span>
            </div>

            {/* Rating */}
            <div className="mt-1 flex items-center gap-1 text-[8px]">
              <div className="flex items-center text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`size-2 ${i < 5 ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                ))}
              </div>
              <span className="font-semibold text-[8px] text-[#323031]">4.8</span>
              <span className="text-[#6E6777]">(415 reviews)</span>
            </div>

            {/* Actions */}
            <div className="mt-2 flex items-start flex-wrap">
          
              <div className="flex items-center flex-wrap gap-1 text-[6px] text-[#4B4B4C]">
                    <button className="flex items-center gap-1 bg-[#6F00FF] text-white whitespace-pre px-2 py-1 rounded-full text-[6px]">
                Write a Review
              </button>
                <button type="button" className="inline-flex border items-center gap-0.5 px-1 py-0.5 rounded-full hover:bg-gray-100 focus:outline-none">
                  <Share2 className="size-2" /> Share
                </button>
                <button type="button" className="inline-flex border items-center gap-0.5 px-1 py-0.5 rounded-full hover:bg-gray-100 focus:outline-none">
                  <Bookmark className="size-2" /> Save
                </button>
                <button type="button" className="inline-flex border items-center gap-0.5 px-1 py-0.5 rounded-full hover:bg-gray-100 focus:outline-none">
                  <Heart className="size-2" /> 1.2k
                </button>
                <button type="button" className="inline-flex border items-center gap-0.5 px-1 py-0.5 rounded-full hover:bg-gray-100 focus:outline-none">
                  Views 986
                </button>
              </div>
            </div>
            <div className="p-2 border-b border-gray-200 bg-[#F9F9FB] mt-2 border rounded">
                <h4 className="font-semibold text-[10px] text-gray-900 mb-2">Our Top Customers</h4>
                <div className="relative rounded-lg">
                  <div className="flex items-center justify-between">
                    <button className="p-1 rounded-full bg-white shadow">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex-1 flex overflow-x-auto gap-6 px-4 scrollbar-hide">
                      {customerLogos.map((logo, i) => (
                        <div key={i} className="flex-shrink-0 w-5 h-5 relative">
                          <Image src={logo} alt="Customer Logo" fill className="object-contain" />
                        </div>
                      ))}
                    </div>
                    <button className="p-1 rounded-full bg-white shadow">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

 {/* About & Services */}
        <div className="mt-3 border-b border-gray-200">
          {/* <div className="grid grid-cols-2 gap-4"> */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">About Our Business</h4>
              <p className="text-sm text-gray-600">
                Louis Vuitton is a global luxury fashion brand offering premium leather goods, clothing and accessories.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Tagline</h4>
              <p className="text-sm text-gray-600">Luxury fashion & accessories crafted with timeless elegance.</p>
            </div>
          {/* </div> */}
        </div>
        {/* Business Owner */}
        
     
          </div>
          <div className="p-2 w-[40%] bg-white rounded-[6px] ">
            <div className="flex items-center justify-end mb-2">
              <button className="flex items-center gap-1 rounded-full bg-black text-white px-2 py-1 !text-[8px]">
                <Play className="size-2" />
                Play Video
              </button>
            </div>
            <Button variant="submit" size="sm" className="w-full !text-[8px] rounded-full text-white">
              <Pen className="size-2" />
              Suggest an edit
            </Button>
            <div className="bg-[#6E677708] mt-4 p-1.5 rounded border py-2">
              <h1 className="text-[#323031] text-[8px] text-center font-medium">Call Now For Booking</h1>
              <button className=" text-[#6F00FF] border border-[#6F00FF] w-full mt-1.5 text-xs py-1 px-2 rounded-full">Call Now</button>
            </div>
            <div className="bg-[#6E677708] mt-4 p-1 rounded border py-2">

              <div className=" text-[#323031] bg-[#6E67770D] flex justify-between  w-full mt-1.5 text-[8px] py-1 px-2 rounded-full">
                <div className="flex items-center gap-1">
                  <Globe className="size-2" /> dalycitymovingservices.com
                </div>
                <ArrowRightIcon className="size-1 text-[#6F00FF]" />
              </div>
              <div className=" text-[#323031] bg-[#6E67770D] flex justify-between  w-full mt-1.5 text-[8px] py-1 px-2 rounded-full">
                <div className="flex items-center gap-1">
                  <Globe className="size-2" /> +88 019**** ****
                </div>
                <ArrowRightIcon className="size-1 text-[#6F00FF]" />
              </div>
              <div className=" text-[#323031] bg-[#6E67770D] flex justify-between  w-full mt-1.5  text-[8px] py-1 px-2 rounded-full">
                <div className="flex items-center gap-1 ">
                  <Globe className="size-2" /> <span className="line-clamp-2">Shop No-8, Kalwalapara Masjid Market, Mirpur-1, Dhaka 1216</span>
                </div>
                <ArrowRightIcon className="size-1 text-[#6F00FF]" />
              </div>

              <div className="flex gap-1.5 justify-center">
                {/* Social Media Icons */}
                <Link href="#" aria-label="Facebook" className="text-[#1877F3] hover:text-[#1456a0] p-px">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="inline-block"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.405 24 24 23.408 24 22.674V1.326C24 .592 23.405 0 22.675 0" /></svg>
                </Link>
                <Link href="#" aria-label="LinkedIn" className="text-[#0A66C2] hover:text-[#004182] p-px">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="inline-block"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.867-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.838-1.563 3.036 0 3.6 2.001 3.6 4.601v5.595z" /></svg>
                </Link>
                <Link href="#" aria-label="Instagram" className="text-[#E4405F] hover:text-[#b92d4b] p-px">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="inline-block"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.012-4.947.072-1.276.06-2.687.334-3.678 1.325-.991.991-1.265 2.402-1.325 3.678-.06 1.28-.072 1.688-.072 4.947s.012 3.667.072 4.947c.06 1.276.334 2.687 1.325 3.678.991.991 2.402 1.265 3.678 1.325 1.28.06 1.688.072 4.947.072s3.667-.012 4.947-.072c1.276-.06 2.687-.334 3.678-1.325.991-.991 1.265-2.402 1.325-3.678.06-1.28.072-1.688.072-4.947s-.012-3.667-.072-4.947c-.06-1.276-.334-2.687-1.325-3.678-.991-.991-2.402-1.265-3.678-1.325-1.28-.06-1.688-.072-4.947-.072zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg>
                </Link>
                <Link href="#" aria-label="YouTube" className="text-[#FF0000] hover:text-[#b80000] p-px">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="inline-block"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.112C19.633 3.5 12 3.5 12 3.5s-7.633 0-9.386.574a2.994 2.994 0 0 0-2.112 2.112C0 7.939 0 12 0 12s0 4.061.502 5.814a2.994 2.994 0 0 0 2.112 2.112C4.367 20.5 12 20.5 12 20.5s7.633 0 9.386-.574a2.994 2.994 0 0 0 2.112-2.112C24 16.061 24 12 24 12s0-4.061-.502-5.814zM9.545 15.568V8.432l6.545 3.568-6.545 3.568z" /></svg>
                </Link>
              </div>
            </div>
            <div className="bg-[#F0F0F0] py-3 px-1 text-xs text-center font-semibold rounded mt-2.5">
              Ads Space Here
            </div>
            <div className="bg-[#F0F0F0] py-3 px-1 text-xs text-center font-semibold rounded mt-2.5">
              Ads Space Here
            </div>
          </div>
        </div>

        

       

        {/* Verified License */}
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Verified License</h4>
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="relative w-full h-24 rounded-lg overflow-hidden bg-gray-100">
                <Image src="/images/signup1.png" alt="Business License photo 1" fill className="object-cover" />
              </div>
              <p className="text-xs text-gray-600 mt-1 text-center">Frontside</p>
            </div>
            <div className="flex-1">
              <div className="relative w-full h-24 rounded-lg overflow-hidden bg-gray-100">
                <Image src="/images/signin.png" alt="Business License photo 2" fill className="object-cover" />
              </div>
              <p className="text-xs text-gray-600 mt-1 text-center">Backside</p>
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
       
      </div>
    </div>

  </div>
  )
}

export default Phone
