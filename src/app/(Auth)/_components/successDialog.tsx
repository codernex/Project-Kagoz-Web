"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Check, CheckCircle2 } from "lucide-react"
import Link from "next/link"

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
      showCloseButton={false}
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
          <Link
            href={actionHref}
            className="text-[#6F00FF] hover:text-purple-700 font-medium inline-flex items-center gap-1"
          >
            {actionLabel} →
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SuccessModal
