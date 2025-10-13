'use client'
import React from "react";
import { ThumbsUp, SquareArrowOutUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

const NoMatchCard: React.FC = () => {
  const router = useRouter();

  const handleContinueToAdd = () => {
    router.push('/signin');
  };

  return (
    <div className=" inter-font px-[10.5px] mt-8">
      {/* Header */}
      <div className="text-[#DC3545] font-medium flex items-center mb-5 gap-2">
        <div className="p-2 bg-[#FDE3E3] rounded-full">
            <ThumbsUp className="text-[#DC3545]  h-[16px] w-[16px]" />
            </div> No Match:
      </div>

      {/* Card */}
      <div className="border border-[#E4E4E4] rounded-[12px] p-8 flex flex-col items-center text-center">
        <div className="bg-[#FDE3E3] p-4 rounded-full">
          <ThumbsUp className="text-[#DC3545] w-[32px] h-[32px]" />
        </div>
        <p className="font-medium text-[20px] text-[#111827] leading-[26px] mb-6 mt-4">Great! No listing found</p>
        <button 
          onClick={handleContinueToAdd}
          className="px-6 py-2 bg-[#6F00FF]  text-white rounded-[8px] text-[16px] font-medium flex items-center gap-2"
        >
          <SquareArrowOutUpRight className="w-[16px] h-[16px]" />
          Continue to Add Your Business
        </button>
      </div>
    </div>
  );
};

export default NoMatchCard;
