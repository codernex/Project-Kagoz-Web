import React from "react";
import { SquareArrowOutUpRight } from "lucide-react";

interface LivePreviewButtonProps {
  slug: string;
  status?: "Pending" | "Active";
  className?: string;
  onClick?: (slug: string) => void;
}

export default function LivePreviewButton({ 
  slug, 
  status = "Active", 
  className = "",
  onClick 
}: LivePreviewButtonProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(slug);
    } else {
      // Default behavior: navigate to business page
      window.open(`/business/${slug}`, '_blank');
    }
  };

  const buttonText = status === "Pending" ? "Preview" : "Live Preview";

  return (
    <button 
      className={`bg-[#6F00FF] text-white px-5 py-2 rounded-[8px] font-medium text-sm flex items-center gap-2 transition hover:bg-[#5A00CC] ${className}`}
      onClick={handleClick}
    >
      <SquareArrowOutUpRight className="w-[16px] h-[16px]" /> 
      {buttonText}
    </button>
  );
}
