
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
    },
    mode: 'onChange'
  });

  const onSubmit = async (data: any) => {
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
      
      // Show specific error messages based on the error response
      if (error?.response?.data?.message) {
        const errorMessage = error.response.data.message;
        
        // Handle specific validation errors
        if (errorMessage.includes('Phone must be exactly 11 characters long')) {
          methods.setError('phone', {
            type: 'manual',
            message: 'Phone number must be exactly 11 characters long'
          });
        } else if (errorMessage.includes('email')) {
          methods.setError('email', {
            type: 'manual',
            message: errorMessage
          });
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error('An error occurred during signup. Please try again.');
      }
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
          rules={{
            required: 'Full name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters long'
            },
            maxLength: {
              value: 50,
              message: 'Name must be less than 50 characters'
            },
            validate: (value: string) => {
              if (!value.trim()) {
                return 'Full name is required';
              }
              if (value.trim().length < 2) {
                return 'Name must be at least 2 characters long';
              }
              if (value.trim().length > 50) {
                return 'Name must be less than 50 characters';
              }
              // Check if name contains only letters and spaces
              const nameRegex = /^[a-zA-Z\s]+$/;
              if (!nameRegex.test(value.trim())) {
                return 'Name can only contain letters and spaces';
              }
              return true;
            }
          }}
        />
        {/* Email */}
        <TextInput
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          required
          control={methods.control}
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Please enter a valid email address'
            },
            validate: (value: string) => {
              if (!value.trim()) {
                return 'Email is required';
              }
              const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
              if (!emailRegex.test(value)) {
                return 'Please enter a valid email address';
              }
              return true;
            }
          }}
        />

        {/* Phone */}
        <TextInput
          name="phone"
          type="tel"
          label="Phone Number"
          placeholder="Enter your phone number (11 digits)"
          required
          control={methods.control}
          rules={{
            required: 'Phone number is required',
            pattern: {
              value: /^[0-9]{11}$/,
              message: 'Phone number must be exactly 11 digits'
            },
            validate: (value: string) => {
              if (!value.trim()) {
                return 'Phone number is required';
              }
              // Remove any spaces or special characters
              const cleanValue = value.replace(/\D/g, '');
              if (cleanValue.length !== 11) {
                return 'Phone number must be exactly 11 digits';
              }
              // Check if it starts with 0 (common for mobile numbers)
              if (!cleanValue.startsWith('0')) {
                return 'Phone number should start with 0';
              }
              return true;
            }
          }}
        />

        {/* Password */}
        <TextInput
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password (min 6 characters)"
          required
          control={methods.control}
          rules={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters long'
            },
            validate: (value: string) => {
              if (!value.trim()) {
                return 'Password is required';
              }
              if (value.length < 6) {
                return 'Password must be at least 6 characters long';
              }
              if (value.length > 50) {
                return 'Password must be less than 50 characters';
              }
              return true;
            }
          }}
        />

        {/* Confirm Password */}
        <TextInput
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Re-enter your password"
          required
          control={methods.control}
          rules={{
            required: 'Please confirm your password',
            validate: (value: string) => {
              if (!value.trim()) {
                return 'Please confirm your password';
              }
              const password = methods.getValues('password');
              if (value !== password) {
                return 'Passwords do not match';
              }
              return true;
            }
          }}
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