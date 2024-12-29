import { create } from "zustand"

type IState = {
    url: string
    open: boolean
    setOpen: (open: boolean, url: string) => void
}

export const useVideoPalyerModal = create<IState>(set => ({
    open: false,
    url: "",
    setOpen: (open, url) => {
        set({ open, url })
    }
}))