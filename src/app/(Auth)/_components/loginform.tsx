import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import React from 'react';
import { Mail, LockKeyhole } from 'lucide-react';
import Link from 'next/link';
import { TextInput } from '@/components/shared/text-input';
import { useForm, FormProvider } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const { login } = useAuth();
  const router = useRouter();
  const methods = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: any) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.log('Login error handled by context');
    }
  };

  return (
    <FormProvider {...methods}>
      <form className="space-y-5 w-full font-inter" onSubmit={methods.handleSubmit(onSubmit)}>
        {/* Email */}
        <TextInput
          name="email"
          placeholderIcon={Mail}
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          required
          control={methods.control}
        />

        {/* Password */}
        <TextInput
        placeholderIcon={LockKeyhole}
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          required
          control={methods.control}
        />

        {/* Checkbox */}
        <div className="flex justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox variant="remember" />
            <label
              htmlFor="terms"
              className="text-sm text-[#353535] leading-5 font-normal inter-font"
            >
              Remember me
            </label>
          </div>
          <Link href={'/forgot-method'} className="text-sm text-[#DC3545] leading-5 font-normal inter-font">Forgot password?</Link>
        </div>

        {/* Sign in button */}
        <Button variant="submit" className="!w-full cursor-pointer" type="submit">
          Sign In
        </Button>
        <div className="flex items-center">
          <div className="h-[1px] bg-[#E4E4E4] w-full"></div>
          <p className="text-center text-gray-500 whitespace-pre mx-1.5">Or sign in with</p>
          <div className="h-[1px] bg-[#E4E4E4] w-full"></div>
        </div>
        <Button
          variant="outline"
          className="w-full flex cursor-pointer text-[#111827] items-center justify-center gap-2"
        >
          <Image
            width={20}
            height={20}
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-[16px] h-[16px]"
          />
          Continue with Google
        </Button>

        <p className="text-center common-text text-[#2D3643] inter-font">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#6F00FF] font-semibold">
            Sign up
          </Link>
        </p>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
