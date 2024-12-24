import { create } from "zustand";

type IState = {
    open: boolean;
    setOpen: (open: boolean) => void
}
export const useMobileSearch = create<IState>(set => ({
    open: false,
    setOpen: (open) => set({
        open
    })
}))