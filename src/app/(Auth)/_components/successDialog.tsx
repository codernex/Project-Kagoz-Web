"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"


interface SuccessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
}

const SuccessModal = ({
  open,
  onOpenChange,
  title = "",
  description = "",
  actionLabel = "",
  actionHref = "",
}: SuccessModalProps) => {
  const router = useRouter();
  const isNavigating = React.useRef(false);

  // Cleanup effect when component unmounts
  React.useEffect(() => {
    return () => {
      // Cleanup function for component unmount
    };
  }, []);

  const handleActionClick = () => {
    if (isNavigating.current) return; // Prevent multiple clicks
    
    isNavigating.current = true;
    
    // Close the modal first
    onOpenChange(false);
    
    // Use a longer timeout to ensure all DOM cleanup is complete
    setTimeout(() => {
      // Force a small delay to ensure React has finished cleanup
      requestAnimationFrame(() => {
        router.push(actionHref);
      });
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-2xl text-center px-8 py-[75px] inter-font"
        style={{ width: "406px", height: "340px" }} // fixed width & height
      >
        <DialogHeader className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center size-16 rounded-full bg-gradient-to-r from-[#22C55E] to-[#059669]">
            <Check className="size-8 text-white" />
          </div>
          <DialogTitle className="auth-heading text-[#111827]">
            {title}
          </DialogTitle>
          <DialogDescription className="text-[#2D3643] text-center !bottom-text ">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <button
            onClick={handleActionClick}
            className="text-[#6F00FF] hover:text-purple-700 font-medium inline-flex items-center gap-1 cursor-pointer"
          >
            {actionLabel} →
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SuccessModal
