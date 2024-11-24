import { create } from "zustand";

interface SwitchBusinessState {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export const useSwitchBusinessModal = create<SwitchBusinessState>((set) => ({
    open: false,
    setOpen: (open) => set({ open }),
}));