'use client'

import LeftSideOtp from '@/app/(Auth)/_components/leftsideOtp'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPSlot } from '@/components/shared/otpInput'
import { ArrowLeft, CheckCircle, Lock, Mail, Phone, Send, Shield } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { axiosInstance } from '@/redux/api'
import { toast } from 'sonner'

const Page = () => {
    const params = useParams();
    const router = useRouter();
    const email = decodeURIComponent(params.slug as string);
    const [otp, setOtp] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [countdown, setCountdown] = useState(60)
    const [canResend, setCanResend] = useState(false)
    const isComplete = otp.length === 6

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else {
            setCanResend(true);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isComplete) return;

        setIsLoading(true);
        try {
            await axiosInstance.post('/auth/forget-password/verify', { 
                email, 
                otp 
            });
            toast.success("OTP verified successfully");
            router.push(`/forgot-method/forgot-password/reset-password?email=${encodeURIComponent(email)}`);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Invalid OTP");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!canResend) return;

        setIsLoading(true);
        try {
            await axiosInstance.post('/auth/forget-password', { email });
            toast.success("OTP resent successfully");
            setCountdown(60);
            setCanResend(false);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to resend OTP");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className=" flex items-center justify-center inter-font my-[54px] ">
            <div className="max-w-[942px] place-items-center grid md:grid-cols-2 gap-[56px] bg-white rounded-2xl ">
                {/* Left side */}
                
                <LeftSideOtp />


                {/* Right side */}
                <div className="p-8 rounded-[16px] bg-white authform-shadow w-full">

                    <h2 className="auth-heading !font-semibold text-[#111827]  mb-2">Verify OTP</h2>
                    <p className="common-text !font-normal  text-[#2D3643] mb-8">
                      Enter the 6-digit code sent to your email
                    </p>
<form className="space-y-5 w-full" onSubmit={handleVerifyOTP}>
            <div className="flex flex-col  gap-4">
              

                 <InputOTP
                value={otp}
                onChange={setOtp}
                maxLength={6}
                label='Verification Code'
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTP>

              <p className="text-sm text-gray-500">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            <Button
              type="submit"
              variant="submit"
              className="w-full"
              disabled={!isComplete || isLoading}
            >
              <CheckCircle className="text-white siz-4" strokeWidth={2} />
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>

            <p className="text-center !font-normal common-text text-[#2D3643] inter-font">
              {!canResend ? (
                <>Resend code in <span className="text-[#6F00FF] ml-0.5 font-semibold">{countdown}s</span></>
              ) : (
                <span 
                  className="text-[#6F00FF] font-semibold cursor-pointer"
                  onClick={handleResendOTP}
                >
                  Resend code
                </span>
              )}
            </p>

            <p className="text-center !font-normal common-text text-[#2D3643] inter-font">
              Didn't receive any code? <span className="text-[#6F00FF] font-semibold cursor-pointer" onClick={handleResendOTP}>Resend code</span>
            </p>
          </form>
                </div>
            </div>
        </div>
    )
}

export default Page