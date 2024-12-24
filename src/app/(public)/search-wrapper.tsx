"use client"
import MobileSearch from "@/components/shared/mobile-search"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useMobileSearch } from "@/hooks/mobileSearch"
import { XIcon } from "lucide-react"

export const SearchWrapper = () => {
    const { open, setOpen } = useMobileSearch()
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent hideCloseIcon className="bg-[rgba(255,255,255,0)] max-w-5xl" >
                <XIcon onClick={()=>setOpen(false)} className="text-white absolute right-6 -top-8"/>
                <MobileSearch />
            </DialogContent>
        </Dialog>
    )
}