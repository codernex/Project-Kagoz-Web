import { create } from "zustand";

interface IState {
    user?: IUser | null;
    open: boolean;
    setOpen: (open: boolean, user?: IUser | null) => void
}

export const userUserProfile = create<IState>(set => ({
    open: false,
    user: undefined,
    setOpen: (open: boolean, user) => set({ open, user }),
}))