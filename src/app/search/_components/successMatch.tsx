'use client'
import React from "react";
import { CheckCircle, Phone, Globe } from "lucide-react";
import Image from "next/image";

const MatchFoundCard: React.FC = () => {
  return (
    <div className=" inter-font mt-8 px-[10.5px]">
      {/* Header */}
     
      <div className="text-[#15803D] font-medium flex items-center mb-5 gap-2">
        <div className="p-2 bg-[#DCFCE7] rounded-full">
            <CheckCircle className="text-[#15803D]  size-4" />
            </div> Match Found:
      </div>

      {/* Success Info */}
      <div className="bg-[#F0FDF4] text-[#15803D] py-5 text-start mb-6 px-6 rounded-[8px] text-base leading-[22px] font-medium flex items-center gap-2">
        <Image src="/icons/checkmark.png" alt="Success Icon" width={20} height={20} className="size-4" />  We found 1 business that may match yours
      </div>

      {/* Business Info Card */}
      <div className="border border-[#E4E4E4] rounded-[12px] p-6 ">
        <div className="text-start space-y-3 mb-6">
          <p className="font-normal text-[18px] leading-[22px] text-[#B45309]">
            Business Name: Rahman Electronics
          </p>
          <p className="flex items-center font-normal text-[18px] leading-[22px] gap-2 text-[#1D4ED8] mt-1">
            <Phone className="size-5" /> +8801712345678
          </p>
          <p className="flex items-center font-normal text-[18px] leading-[22px] gap-2 text-[#0D9488] mt-1">
            <Globe className="size-5" /> www.rahmanelectronics.com
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button className="w-full px-6 py-2 bg-[#F1EBFF]  text-[#6F00FF] rounded-[8px] text-base leading-[22px] font-medium">
            <CheckCircle className="inline-block mr-2 size-4" /> Claim This Business
          </button>
          <button className="w-full px-6 py-2 bg-[#F9FAFB] text-[#2D3643] rounded-[8px] text-base leading-[22px] font-medium">
            ✕ Not Mine – Continue to Add My Business
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchFoundCard;
