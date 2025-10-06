
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Image from 'next/image';
import Link from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';
import { TextInput } from '@/components/shared/text-input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import GoogleContinueButton from '@/components/shared/google-continue';

const SignupForm = () => {
  const router = useRouter();
  const { signUp } = useAuth();
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const methods = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: any) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      };
      
      await signUp(payload);
      
    } catch (error: any) {
      console.error('Signup error:', error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form className="space-y-5 w-full font-inter" onSubmit={methods.handleSubmit(onSubmit)}>
        {/* Name */}
        <TextInput
          name="name"
          type="text"
          label="Full Name"
          placeholder="Enter your full name"
          required
          control={methods.control}
        />
        {/* Email */}
        <TextInput
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          required
          control={methods.control}
        />

        {/* Phone */}
        <TextInput
          name="phone"
          type="tel"
          label="Phone Number"
          placeholder="Enter your phone number"
          required
          control={methods.control}
        />

        {/* Password */}
        <TextInput
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          required
          control={methods.control}
        />

        {/* Confirm Password */}
        <TextInput
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Re-enter your password"
          required
          control={methods.control}
        />

        {/* Checkbox */}
        <div className="flex items-center  space-x-2">
          <Checkbox 
            variant='remember' 
            id="terms" 
            checked={isTermsAccepted}
            onCheckedChange={(checked) => setIsTermsAccepted(checked === true)}
          />
          <label
            htmlFor="terms"
            className="text-[14px] !text-[#353535] leading-5 font-normal "
          >
            I agree to the Terms of Service and Privacy Policy
          </label>
        </div>

        {/* Sign up button */}
        <Button 
          variant="submit" 
          className="w-full cursor-pointer" 
          type="submit"
          disabled={!isTermsAccepted}
        >
          Sign Up
        </Button>
        <div className="flex items-center">
          <div className="h-px bg-[#E4E4E4] w-full"></div>
          <p className="text-center text-gray-500 whitespace-pre mx-1.5">Or sign up with</p>
          <div className="h-px bg-[#E4E4E4] w-full"></div>
        </div>
        <GoogleContinueButton />

        <p className="text-center common-text text-[#2D3643] ">
          Already have an account?{" "}
          <Link href="/signin" className="text-[#6F00FF] font-semibold">
            Sign in
          </Link>
        </p>
      </form>
    </FormProvider>
  );
};

export default SignupForm;