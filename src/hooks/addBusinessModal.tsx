import { create } from "zustand";

interface AddBusinessState {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export const useAddBusinessModal = create<AddBusinessState>((set) => ({
    open: false,
    setOpen: (open) => set({ open }),
}));