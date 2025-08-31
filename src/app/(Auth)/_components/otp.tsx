'use client'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPSlot } from '@/components/shared/otpInput'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import SuccessModal from './successDialog';
import LeftSideOtp from './leftsideOtp'
import { axiosInstance } from '@/redux/api'
import { toast } from 'sonner'
import { useOtpVerificationModal } from '@/hooks/enableOtpVerifiactionModal'
import { useRouter } from 'next/navigation'
import { useCookies } from 'next-client-cookies'
import { jwtDecode } from 'jwt-decode'

const OtpPage = ({ email }: { email: string }) => {
    const { endpoint = '/auth/verify', resendEndpoint = '/auth/resend-otp', type = 'login' } = useOtpVerificationModal()
    const router = useRouter()
    const cookies = useCookies()
    const [otp, setOtp] = useState("")
    const [isVerified, setIsVerified] = useState(false);
    const [submitting, setSubmitting] = useState(false)
    const [timer, setTimer] = useState(120)
    const [canResend, setCanResend] = useState(false)
    const [resending, setResending] = useState(false)

    // Check if this is a login flow by checking the current URL
    const isLoginFlow = typeof window !== 'undefined' && window.location.pathname.includes('/signin/')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Missing email in URL');
      return;
    }
    try {
      setSubmitting(true)
      const response = await axiosInstance.post(endpoint, { otp, email });
      
      if (isLoginFlow) {
        // For login flow, set the token and redirect to dashboard
        const { accessToken } = response.data.data;
        const decodedUser = jwtDecode(accessToken);
        cookies.set('auth_token', accessToken, {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        });
        router.push(`/biz/null/dashboard`);
      } else {
        // For signup flow, show success modal
        setIsVerified(true);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message;
      if (Array.isArray(message)) {
        toast.error(message.join(', '));
      } else if (typeof message === 'string') {
        toast.error(message);
      } else {
        toast.error('Verification failed');
      }
    } finally {
      setSubmitting(false)
    }
  };

  // countdown timer
  React.useEffect(() => {
    let intervalId: NodeJS.Timeout
    if (timer > 0) {
      intervalId = setInterval(() => setTimer(prev => prev - 1), 1000)
    } else {
      setCanResend(true)
    }
    return () => clearInterval(intervalId)
  }, [timer])

  const handleResend = async () => {
    if (!canResend || !email || resending) return
    
    try {
      setResending(true)
      await axiosInstance.post(resendEndpoint, { email, type })
      toast.success('OTP resent successfully!')
      setTimer(120)
      setCanResend(false)
    } catch (error: any) {
      const message = error?.response?.data?.message;
      if (Array.isArray(message)) {
        toast.error(message.join(', '));
      } else if (typeof message === 'string') {
        toast.error(message);
      } else {
        toast.error('Failed to resend OTP. Please try again later.');
      }
    } finally {
      setResending(false)
    }
  }

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

    return (
        <div className=" flex items-center justify-center inter-font my-[139px] ">
            <div className="max-w-[942px] place-items-center grid md:grid-cols-2 gap-[56px] bg-white rounded-2xl ">
                {/* Left side */}
              <LeftSideOtp />
                {/* Right side */}
                <div className="p-8 rounded-[16px] bg-white authform-shadow w-full">
   {isVerified && !isLoginFlow && (
     <SuccessModal
       open={isVerified}
       onOpenChange={setIsVerified}
       title="Success"
       description="Your account has been successfully verified and created."
       actionLabel="Continue to business setup"
       actionHref="/signin"
     />
   )}

                    <h2 className="auth-heading !font-semibold text-[#111827]  mb-2">Verify OTP</h2>
                    <p className="common-text !font-normal  text-[#2D3643] mb-8">
                      Enter the 6-digit code sent to your phone
                    </p>

                   <form className="space-y-5 w-full" onSubmit={handleSubmit}>
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
              className="w-full cursor-pointer"
              disabled={otp.length !== 6 || submitting} 
            >
              <CheckCircle className=" text-white siz-4" strokeWidth={2} />
              {submitting ? 'Verifying...' : 'Verify OTP'}
            </Button>

            <p className="text-center !font-normal common-text text-[#2D3643] inter-font">
              Resend code in 
              <span className="text-[#6F00FF] ml-0.5 font-semibold">
                {canResend ? '0s' : formatTime(timer)}
              </span>
            </p>

            <button 
              type="button" 
              onClick={handleResend} 
              disabled={!canResend || resending} 
              className={`block mx-auto text-center !font-normal common-text text-[#2D3643] inter-font ${
                !canResend || resending ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
              }`}
            >
              <span>
                Didn&apos;t receive any code? 
                <span className={`text-[#6F00FF] font-semibold ml-1 ${
                  canResend && !resending ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}>
                  {resending ? 'Resending...' : 'Resend code'}
                </span>
              </span>
            </button>
          </form>
                </div>
            </div>
        </div>
    )
}

export default OtpPage