import { create } from 'zustand'

interface IAuthModal {
    open: boolean;
    setOpen: () => void
}

export const useAuthModal = create<IAuthModal>((set) => ({
    open: false,
    setOpen: () => set((state) => ({ open: !state.open }))
}))