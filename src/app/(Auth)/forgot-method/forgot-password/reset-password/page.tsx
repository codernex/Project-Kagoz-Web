'use client'
import React, { useState } from 'react'
import { Lock, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SuccessModal from '@/app/(Auth)/_components/successDialog';

const ResetPassword = () => {
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuccess(true);
    };

    return (
        <div className="max-w-[452px] my-[103px] inter-font mx-auto bg-white reset-method-selector-shadow rounded-3xl py-4 sm:py-8 px-5 sm:px-[42px] text-center ">
            {/* Success Modal */}
            {showSuccess && (
                <SuccessModal
                    open={showSuccess}
                    onOpenChange={setShowSuccess}
                    title="Success"
                    description="Your password has been reset successfully"
                    actionLabel="Back to Sign in"
                    actionHref="/signin"
                />
            )}

            {/* Icon */}
            <div className="mx-auto size-16 sm:size-32 rounded-full bg-gradient-to-r from-[#9D6BFF] to-[#431799] flex items-center justify-center">
                <Lock strokeWidth={1} className="text-white size-8 sm:size-16" />
            </div>

            {/* Title */}
            <div>
                <h2 className="auth-heading text-[#111827] mt-2 ">Reset Your Password</h2>
                <p className="common-text text-[#2D3643] !font-normal  mt-3 mb-4 sm:mb-8">
                    Add least 8 characters with uppercase,
                    lowercase
                    and special character.
                </p>
            </div>

            {/* Options */}
            <form className="space-y-4 flex flex-col items-start !w-full justify-start" onSubmit={handleSubmit}>
                <div className="flex flex-col items-start justify-start !w-full">
                    <p className="common-text !text-start text-[#111827]">New Password</p>
                    <Input
                        type="password"
                        className='w-full sm:w-[368px] '
                        placeholder="Enter your password"
                        icon={Lock}
                    />
                </div>

                {/* Confirm Password */}
                <div className="">
                    <p className="common-text !text-start text-[#111827]">Confirm Password</p>
                    <Input
                        width="100%"
                        className='w-full sm:w-[368px] '
                        type="password"
                        placeholder="Re-enter your password"
                        icon={Lock}
                    />
                </div>
                <Button type="submit" 
                    variant="submit" 
                    className="w-full cursor-pointer">
                    Reset Password
                </Button>
            </form>

            {/* Back Link */}
            <Link href="/signin" className="flex items-center justify-center gap-2 mt-8 common-text text-[#111827]">
                <ArrowLeft className="size-4" />
                Back to Sign in
            </Link>
        </div>
    )
}
export default ResetPassword;