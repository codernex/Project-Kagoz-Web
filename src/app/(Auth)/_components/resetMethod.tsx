'use client'
import React, { useState } from 'react'
import { Lock, Mail, Phone, Check, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { useReset } from './methodContext';
const ResetMethodSelector = () => {
    // const [method, setMethod] = useState<"email" | "phone">("email");
    const { method, setMethod } = useReset();
  return (
     <div className="max-w-[452px] inter-font mx-auto bg-white reset-method-selector-shadow rounded-3xl py-4 sm:py-8 px-5 sm:px-[42px] text-center ">
      {/* Icon */}
      <div className="mx-auto size-16 sm:size-32 rounded-full bg-gradient-to-r from-[#9D6BFF] to-[#431799] flex items-center justify-center">
        <Lock strokeWidth={1} className="text-white size-8 sm:size-16" />
      </div>

      {/* Title */}
      <div>
        <h2 className="auth-heading text-[#111827] mt-2 ">Reset Your Password</h2>
        <p className="common-text text-[#2D3643] !font-normal  mt-3 mb-4 sm:mb-8">
          Choose how you'd like to reset your password
        </p>
      </div>

      {/* Options */}
      <div className="space-y-4">
        {/* Email Option */}
        <Link
        href={'/forgot-method/forgot-password'}
          onClick={() => setMethod("email")}
          className={`w-full flex items-center justify-between sm:px-5 px-3 sm:py-[18px] py-2.5 rounded-xl border transition ${
            method === "email"
              ? "bg-purple-50 border-[#6F00FF]"
              : "bg-white border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`size-12 flex items-center justify-center rounded-lg ${
                method === "email" ? "bg-[#6F00FF] text-white" : "bg-gray-100 text-[#6f6d71]"
              }`}
            >
              <Mail strokeWidth={1} className="size-8" />
            </div>
            <div className="text-left space-y-0.5">
              <p className="common-text  text-[#111827]">Email Address</p>
              <p className="text-[11.56px] font-normal leading-5 text-[#6f6d71]">Send reset code to your email</p>
            </div>
          </div>
          {method === "email" && (
             <div className=" bg-[#6F00FF] rounded-full sm:size-6 size-4 flex items-center justify-center">
                <Check className="text-white sm:size-4 size-2" />
            </div>
          )}
        </Link>

        {/* Phone Option */}
        <Link
        href={'/forgot-method/forgot-password'}
          onClick={() => setMethod("phone")}
          className={`w-full flex items-center justify-between sm:px-5 px-3 sm:py-[18px] py-2.5 rounded-xl border transition ${
            method === "phone"
              ? "bg-purple-50 border-[#6F00FF]"
              : "bg-white border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`size-12 flex items-center justify-center rounded-lg ${
                method === "phone" ? "bg-[#6F00FF] text-white" : "bg-gray-100 text-[#6f6d71]"
              }`}
            >
              <Phone strokeWidth={1} className="size-8" />
            </div>
            <div className="text-left space-y-0.5">
              <p className="common-text  text-[#111827]">Phone Number</p>
              <p className="text-[11.56px] font-normal leading-5 text-[#6f6d71]">Send reset code via SMS</p>
            </div>
          </div>
          {method === "phone" && (
            <div className=" bg-[#6F00FF] rounded-full sm:size-6 size-4 flex items-center justify-center">
                <Check className="text-white sm:size-4 size-2" />
            </div>
          )}
        </Link>
      </div>

      {/* Back Link */}
      <Link href="/signin" className="flex items-center justify-center gap-2 mt-8 common-text text-[#111827]">
        <ArrowLeft className="size-4" />
        Back to Selection Method
      </Link>
    </div>
  )
}

export default ResetMethodSelector