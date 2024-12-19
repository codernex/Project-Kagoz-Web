"use client"
import { useAuth } from "@/context/AuthContext"
import { useAuthModal } from "@/hooks/loginModal"
import { useForm } from "react-hook-form"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Form } from "../ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { TextInput } from "./text-input"
import { useState } from "react"
import { useOtpVerificationModal } from "@/hooks/enableOtpVerifiactionModal"
import { axiosInstance } from "@/redux/api"
import { toast } from "sonner"
import { usePasswordReset } from "@/hooks/passwordResetModal"
import { successMessage } from "@/lib/utils"

export const AuthModal = () => {
    const { setOpen: setOtpOpen, email } = useOtpVerificationModal()
    const { passwordReset, setPasswordReset } = usePasswordReset()
    const { open, setOpen } = useAuthModal()
    const { login, signUp } = useAuth()
    const [forgetPassword, setForgetPassword] = useState(false)
    const loginForm = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    })
    const forgetPasswordForm = useForm({
        defaultValues: {
            email: ''
        }
    })

    const signUpForm = useForm({
        defaultValues: {
            email: '',
            password: '',
            name: '',
            phone: ''
        }
    })

    const passwordResetForm = useForm({
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    })


    return (
        <Dialog open={open} onOpenChange={open => {
            setOpen()
            setOtpOpen({
                email: '',
                open: false,
                passwordReset: false
            })
        }}>
            <DialogContent className="max-w-3xl rounded-xs">
                <DialogHeader>
                    <DialogTitle>
                    </DialogTitle>
                </DialogHeader>

                {
                    forgetPassword ? (
                        <div>
                            <Form {...forgetPasswordForm}>
                                <form onSubmit={forgetPasswordForm.handleSubmit(d => {
                                    axiosInstance.post('/auth/forget-password', { email: d.email })
                                        .then(res => {
                                            setOpen()
                                            setOtpOpen({
                                                email: d.email,
                                                open: true,
                                                endpoint: '/auth/forget-password/verify',
                                                type: 'forget'
                                            })
                                            setForgetPassword(false)
                                        }).catch(err => {
                                            toast.error(err.response?.data?.message)
                                        })
                                })} className="space-y-3">
                                    <TextInput control={forgetPasswordForm.control} name="email" placeholder="yourmail@example.com" label="Email" required />
                                    <Button>
                                        Submit
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    ) : passwordReset ? (
                        <div>
                            <Form {...passwordResetForm}>
                                <form className="space-y-3" onSubmit={passwordResetForm.handleSubmit(d => {
                                    axiosInstance.post('/auth/reset-password', { ...d, email })
                                        .then(() => {
                                            setPasswordReset(false)
                                            successMessage("Password Reset Successful")
                                        }).catch(err => {
                                            toast.error(err?.response?.data?.message)
                                        })
                                })}>
                                    <TextInput type="password" control={passwordResetForm.control} name="password" label="Password" required />
                                    <TextInput type="password" control={passwordResetForm.control} name="confirmPassword" label="Confirm Password" required />
                                    <Button>
                                        Submit
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    ) : (
                        <Tabs defaultValue="existing" className="w-full">
                            <TabsList className="w-full space-x-6 bg-transparent">
                                <TabsTrigger className="data-[state=active]:bg-primary data-[state=active]:text-white bg-[#f5f5f5] min-w-[14rem] h-16" value="existing">Existing User</TabsTrigger>
                                <TabsTrigger className="data-[state=active]:bg-primary data-[state=active]:text-white bg-[#f5f5f5] min-w-[14rem] h-16" value="new">New User</TabsTrigger>
                            </TabsList>
                            <TabsContent className="" value="existing">
                                <Form {...loginForm}>
                                    <form onSubmit={loginForm.handleSubmit(d => {
                                        login(d.email, d.password)
                                    })} className="space-y-4">
                                        <TextInput className="text-black" control={loginForm.control} name={'email'} type="email" label={'Email'} placeholder="yourmail@server.com" required />
                                        <TextInput className="text-black" control={loginForm.control} name={'password'} type="password" placeholder="******" label={'Password'} required />
                                        <Button className="w-40" type="submit">Login</Button>
                                    </form>
                                    <Button className="" onClick={() => setForgetPassword(true)} variant={'ghost'}>Forget Password?</Button>
                                </Form>
                            </TabsContent>
                            <TabsContent value="new">
                                <Form {...signUpForm}>
                                    <form onSubmit={signUpForm.handleSubmit(d => {
                                        signUp(d)
                                    })} className="space-y-4">
                                        <TextInput className="text-black" control={signUpForm.control} name={'name'} type="text" label={'Name'} placeholder="John Doe" required />
                                        <TextInput className="text-black" control={signUpForm.control} name={'email'} type="email" label={'Email'} placeholder="yourmail@server.com" required />
                                        <TextInput className="text-black" control={signUpForm.control} name={'password'} type="password" placeholder="******" label={'Password'} required />
                                        <TextInput className="text-black" control={signUpForm.control} name={'phone'} type="number" placeholder="018xxxxxxxx" label={'Phone'} required />

                                        <Button className="w-40" type="submit">Sign Up</Button>
                                    </form>
                                </Form>
                            </TabsContent>
                        </Tabs>
                    )
                }
            </DialogContent>
        </Dialog>
    )
}