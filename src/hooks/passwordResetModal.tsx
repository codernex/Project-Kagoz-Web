import { create } from "zustand";

interface IState {
    passwordReset: boolean;
    setPasswordReset: (open: boolean) => void
}

export const usePasswordReset = create<IState>(set => ({
    passwordReset: false,
    setPasswordReset(open) {
        set({ passwordReset: open })
    },
}))