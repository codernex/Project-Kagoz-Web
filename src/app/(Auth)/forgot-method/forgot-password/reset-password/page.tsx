'use client'
import React, { useState } from 'react'
import { Lock, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SuccessModal from '@/app/(Auth)/_components/successDialog';
import { axiosInstance } from '@/redux/api'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import { TextInput } from '@/components/shared/text-input'
import { useForm, FormProvider } from 'react-hook-form'

const ResetPassword = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    const methods = useForm({
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });

    const onSubmit = async (data: any) => {
        if (data.password !== data.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (data.password.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return;
        }

        if (!email) {
            toast.error("Email is required");
            return;
        }

        setIsLoading(true);
        try {
            await axiosInstance.post('/auth/reset-password', { 
                password: data.password,
                confirmPassword: data.confirmPassword,
                email: email
            });
            setShowSuccess(true);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to reset password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-[452px] my-[103px]  inter-font mx-auto bg-white reset-method-selector-shadow rounded-3xl py-4 sm:py-8 px-5 sm:px-[42px]  ">
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
                <h2 className="auth-heading text-[#111827] text-center mt-2 ">Reset Your Password</h2>
                <p className="common-text text-[#2D3643] text-center !font-normal  mt-3 mb-4 sm:mb-8">
                    Add least 8 characters with uppercase,
                    lowercase
                    and special character.
                </p>
            </div>

            {/* Options */}
            <FormProvider {...methods}>
                <form className="space-y-4 flex flex-col items-start !w-full justify-start" onSubmit={methods.handleSubmit(onSubmit)}>
                    <div className="flex flex-col items-start justify-start !w-full">
                        <TextInput
                            name="password"
                            placeholderIcon={Lock}
                            type="password"
                            label="New Password"
                            placeholder="Enter your password"
                            required
                            control={methods.control}
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="w-full">
                        <TextInput
                            name="confirmPassword"
                            placeholderIcon={Lock}
                            type="password"
                            label="Confirm Password"
                            placeholder="Re-enter your password"
                            required
                            control={methods.control}
                        />
                    </div>
                    <Button 
                        type="submit" 
                        variant="submit" 
                        className="w-full cursor-pointer"
                        disabled={isLoading}
                    >
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </Button>
                </form>
            </FormProvider>

            {/* Back Link */}
            <Link href="/signin" className="flex items-center justify-center gap-2 mt-8 common-text text-[#111827]">
                <ArrowLeft className="w-[16px] h-[16px]" />
                Back to Sign in
            </Link>
        </div>
    )
}
export default ResetPassword;