import { create } from "zustand";

interface IOptions {
    email: string;
    endpoint?: string
    resendEndpoint?: string
    response?: any,
    title?: string
    open: boolean,
    type?: 'forget' | 'login',
    message?: string,
    passwordReset?: boolean
}
interface IState extends IOptions {
    setOpen: (options: IOptions) => void,
}

export const useOtpVerificationModal = create<IState>(set => ({
    endpoint: '/auth/verify',
    open: false,
    setOpen: (option) => {
        set({
            ...option
        })
    },
    email: '',
    resendEndpoint: '/auth/resend-otp',
    title: 'Verify your email address',
    response: undefined,
    type: 'login',
    message: 'Please check your inbox',
    passwordReset: false
}))