'use client'
import { ArrowLeft, CheckCircle, Lock, Mail, Phone, Shield } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import ResetTypeForm from '../../_components/resetType'
import { useReset } from '../../_components/methodContext'


const Page = () => {
      const { method } = useReset();
    return (
        <div className=" flex items-center justify-center inter-font my-[54px] ">
            <div className="max-w-[942px] place-items-center grid md:grid-cols-2 gap-[56px] bg-white rounded-2xl ">
                {/* Left side */}
                <div className="relative hidden md:flex items-center justify-center  pl-7 mx-1.5">
                    {/* Background gradient image */}
                    <div className="absolute bottom-12 left-1 inset-0 flex items-center justify-center ">
                        <Image
                            src="/images/authbg.png"
                            alt="Background"
                            width={600}
                            height={600}
                            className="w-[430px]  object-cover rounded-2xl rotate-1"
                        />
                    </div>
                    <div className="bg-white px-[23.5px] authform2-shadow relative z-10 pt-[31px] pb-[62px] rounded-[16px] ">
                        <div className="text-center">
                            <div className="mx-auto size-16 sm:size-32 rounded-full bg-gradient-to-r from-[#9D6BFF] to-[#431799] flex items-center justify-center">
                              {method === 'email' ? (
                                  <Lock strokeWidth={1} className="text-white size-8 sm:size-16" />
                              ) : (
                                  <Phone strokeWidth={1} className="text-white size-8 sm:size-16" />
                              )}
                            </div>
                            <h2 className="auth-heading  mt-2 mb-3 text-[#111827]">Reset Your Password</h2>
                            <p className="common-text !text-[14px] !font-normal !text-[#2D3643] mb-8">
                                Just one more step! We've sent a verification code
                                to your phone number to complete the setup.
                            </p>
                            <ul className="text-left space-y-4 text-gray-700">
                                <li className="flex items-center text-[14px] ">
                                    <Shield className="size-4 text-[#6F00FF] mr-2" />
                                    Secure password reset process
                                </li>
                                <li className="flex items-center text-[14px] ">
                                    <Mail className="size-4 text-[#6F00FF] mr-2" />
                                    Link expires in 5 minutes
                                </li>
                                <li className="flex items-center text-[14px] ">
                                    <CheckCircle className="size-4 text-[#6F00FF] mr-2" />
                                    Quick and easy process
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>


                {/* Right side */}
                <div className="p-8 rounded-[16px] bg-white authform-shadow w-full">
                    <Link href="/signin" className="common-text  !font-normal text-[#111827] flex items-center mb-[23px]">
                        <ArrowLeft className="size-4 mr-1" /> Back to Sign In
                    </Link>

                    <h2 className="auth-heading !font-semibold text-[#111827]  mb-2">Forgot Password?</h2>
                    <p className="common-text !font-normal  text-[#2D3643] mb-8">
                       Enter your email to receive a reset code
                    </p>

                    <ResetTypeForm />
                </div>
            </div>
        </div>
    )
}

export default Page