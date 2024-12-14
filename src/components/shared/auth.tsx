"use client"
import { useAuthModal } from "@/hooks/loginModal"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Form } from "../ui/form"
import { useForm } from "react-hook-form"
import { TextInput } from "./text-input"
import { useAuth } from "@/context/AuthContext"

export const AuthModal = () => {
    const { open, setOpen } = useAuthModal()
    const { login, signUp, isAuth } = useAuth()
    const loginForm = useForm({
        defaultValues: {
            email: '',
            password: ''
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-3xl rounded-xs">
                <DialogHeader>
                    <DialogTitle>
                    </DialogTitle>
                </DialogHeader>

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
            </DialogContent>
        </Dialog>
    )
}