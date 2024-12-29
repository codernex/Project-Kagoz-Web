"use client"

import Player from "react-player/youtube";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useVideoPalyerModal } from "@/hooks/videoPlayerModal"

export const YtPlayerModal = () => {
    const { setOpen, open, url } = useVideoPalyerModal()
    return (
        <Dialog open={open} onOpenChange={open => setOpen(open, '')}>
            <DialogContent className="max-w-7xl p-0 rounded-md overflow-hidden border-none h-1/2 bg-[#00000080]">
                <DialogTitle className="hidden">Title</DialogTitle>
                <Player
                    width={"100%"}
                    height={"100%"}
                    controls
                    playing={open}
                    url={url}
                />
            </DialogContent>
        </Dialog>
    )
}