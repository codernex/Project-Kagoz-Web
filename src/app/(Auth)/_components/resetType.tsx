'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'
import { Mail, Send } from 'lucide-react'
import Link from 'next/link'
import { useReset } from './methodContext'

const ResetTypeForm = () => {
  const { method } = useReset();
  return (
    <form className="space-y-5 w-full">
            {/* Email */}
             {method === "email" && (
            <Input
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              icon={Mail}
            />
             )}
              {method === "phone" && (
            <Input
              type="tel"
              label="Phone Number"
              placeholder="Enter your phone number"
              icon={Mail}
            />
             )}

            {/* Instructions */}
            {/* Sign up button */}
            <Button variant="submit" className="w-full cursor-pointer">
              <Send className=" text-white siz-4" strokeWidth={2} />
             Send OTP
            </Button>
           

            <p className="text-center common-text text-[#2D3643] inter-font">
              Already have an account?{" "}
              <Link href="/signup" className="text-[#6F00FF] font-semibold">
                Sign up
              </Link>
            </p>
          </form>
  )
}

export default ResetTypeForm
