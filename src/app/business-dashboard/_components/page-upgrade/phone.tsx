'use client'
import React from 'react'
import Image from 'next/image'

const Phone = () => {


  return (
    <div className="relative  bg-[#F2F2F2] p-11 rounded-[24px]">
    {/* Phone Frame */}
    <div className="mx-auto w-[312px]  h-[min(772px,calc(100vh-64px))] bg-white border-[5px] border-purple-200 rounded-[40px] shadow-xl relative overflow-hidden">

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
