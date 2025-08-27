"use client";
import React from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import LoginForm from "../_components/loginform";

const Signin: React.FC = () => {
  return (
    <div className=" flex items-center justify-center font-inter py-[54px]">
      <div className="lg:max-w-[942px] w-[90%] place-items-center grid lg:grid-cols-2 grid-cols-1 gap-[56px] bg-white rounded-2xl ">
        {/* Left side */}
        <div className="relative hidden lg:flex items-center justify-center  pl-7 mx-1.5">
          {/* Background gradient image */}
          <div className="absolute -left-20 bottom-9  inset-0 flex items-center justify-center ">
            <Image
              src="/images/authbg.png"
              alt="Background"
              width={600}
              height={600}
              className="w-[430px] h-[400px] object-contain rounded-2xl rotate-1  "
            />
          </div>
          <div className="bg-white px-[42px] authform2-shadow relative z-10 py-8 rounded-[16px] ">
            <div className="text-center">
              <Image
                src="/images/signin.png"
                alt="Business"
                width={4000}
                height={4000}
                className="size-[170px] mx-auto "
              />
              <h2 className="auth-heading my-2 text-[#111827]">Welcome Back!</h2>
              <p className="bottom-text font-normal !text-[#2D3643] mb-4">
                Sign in to claim your business listing and take
                control of your online presence.
              </p>
              <ul className="text-left space-y-2 text-gray-700">
                <li className="flex items-center text-[14px]">
                  <CheckCircle className="w-[14px] h-[14px] text-[#6F00FF] mr-2" />
                  Manage your business information
                </li>
                <li className="flex items-center text-[14px]">
                  <CheckCircle className="w-[14px] h-[14px] text-[#6F00FF] mr-2" />
                  Respond to customer reviews
                </li>
                <li className="flex items-center text-[14px]">
                  <CheckCircle className="w-[14px] h-[14px] text-[#6F00FF] mr-2" />
                  Update business hours & contact info
                </li>
              </ul>
            </div>
          </div>
        </div>


        {/* Right side */}
        <div className="p-8 rounded-[16px] bg-white authform-shadow w-full">
          <Link href="/" className="common-text !text-[16px] !font-normal text-[#111827] flex items-center mb-[23px]">
            <ArrowLeft className="w-[16px] h-[16px] mr-1" /> Back to Search
          </Link>

          <h2 className="auth-heading !font-semibold text-[#111827] mb-2">Sign In</h2>
          <p className="common-text !font-normal text-[#2D3643] mb-8">
            Access your business dashboard
          </p>

          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Signin;
