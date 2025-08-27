'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { Mail, Send } from 'lucide-react'
import Link from 'next/link'
import { useReset } from './methodContext'
import { axiosInstance } from '@/redux/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { TextInput } from '@/components/shared/text-input'
import { useForm, FormProvider } from 'react-hook-form'

const ResetTypeForm = () => {
  const { method } = useReset();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const methods = useForm({
    defaultValues: {
      email: '',
      phone: ''
    }
  });

  const onSubmit = async (data: any) => {
    if (method === "phone") {
      toast.error("This module is under development");
      return;
    }

    if (!data.email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.post('/auth/forget-password', { email: data.email });
      toast.success("OTP sent to your email");
      router.push(`/forgot-method/forgot-password/${data.email}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form className="space-y-5 w-full" onSubmit={methods.handleSubmit(onSubmit)}>
            {/* Email */}
             {method === "email" && (
              <TextInput
                name="email"
                placeholderIcon={Mail}
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                required
                control={methods.control}
              />
             )}
              {method === "phone" && (
              <TextInput
                name="phone"
                placeholderIcon={Mail}
                type="tel"
                label="Phone Number"
                placeholder="Enter your phone number"
                disabled
                control={methods.control}
              />
             )}

            {/* Instructions */}
            {/* Sign up button */}
            <Button 
              variant="submit" 
              className="w-full cursor-pointer"
              type="submit"
              disabled={isLoading}
            >
              <Send className=" text-white siz-4" strokeWidth={2} />
             {isLoading ? "Sending..." : "Send OTP"}
            </Button>
           

            <p className="text-center common-text text-[#2D3643] inter-font">
              Already have an account?{" "}
              <Link href="/signup" className="text-[#6F00FF] font-semibold">
                Sign up
              </Link>
            </p>
          </form>
    </FormProvider>
  )
}

export default ResetTypeForm
