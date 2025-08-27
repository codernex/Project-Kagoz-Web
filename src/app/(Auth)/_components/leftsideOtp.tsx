import { CheckCircle, Mail, Phone, Shield } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const LeftSideOtp = () => {
  return (
        <div className="relative hidden md:flex items-center font-inter justify-center  pl-7 mx-1.5">
                    {/* Background gradient image */}
                    <div className="absolute -left-20 bottom-5  inset-0 flex items-center justify-center ">
                                         <Image
                                           src="/images/authbg.png"
                                           alt="Background"
                                           width={600}
                                           height={600}
                                           className="w-[430px] h-[400px] object-contain rounded-2xl rotate-1  "
                                         />
                                       </div>
                    <div className="bg-white px-[23.5px] authform2-shadow relative z-10 pt-[31px] pb-[62px] rounded-[16px] ">
                        <div className="text-center">
                            <div className="mx-auto size-16 sm:size-32 rounded-full bg-gradient-to-r from-[#9D6BFF] to-[#431799] flex items-center justify-center">
                            
                                  <Mail strokeWidth={1} className="text-white size-8 sm:size-16" />
                              
                            </div>
                            <h2 className="auth-heading  mt-2 mb-3 text-[#111827]">Verify OTP</h2>
                            <p className="common-text !text-[14px] !font-normal !text-[#2D3643] mb-8">
                                We've sent a 6-digit verification code to your email address. Please enter it to continue.
                            </p>
                            <ul className="text-left space-y-4 text-gray-700">
                                <li className="flex items-center text-[14px] ">
                                    <Shield className="w-[14px] h-[14px] text-[#6F00FF] mr-2" />
                                    Secure password reset process
                                </li>
                                <li className="flex items-center text-[14px] ">
                                    <Mail className="w-[14px] h-[14px] text-[#6F00FF] mr-2" />
                                    Link expires in 5 minutes
                                </li>
                                <li className="flex items-center text-[14px] ">
                                    <CheckCircle className="w-[14px] h-[14px] text-[#6F00FF] mr-2" />
                                    Quick and easy process
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
  )
}

export default LeftSideOtp