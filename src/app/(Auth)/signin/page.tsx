"use client";
import React from "react";
import {  ArrowLeft, CheckCircle } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import LoginForm from "../_components/loginform";

const Signin: React.FC = () => {
  return (
    <div className=" flex items-center justify-center  py-[54px]">
      <div className="max-w-[942px] place-items-center grid md:grid-cols-2 gap-[56px] bg-white rounded-2xl ">
        {/* Left side */}
        <div className="relative hidden md:flex items-center justify-center  pl-7 mx-1.5">
          {/* Background gradient image */}
          <div className="absolute bottom-5 inset-0 flex items-center justify-center ">
            <Image
              src="/images/authbg.png"
              alt="Background"
              width={600}
              height={600}
              className="w-[430px]  object-cover rounded-2xl rotate-2"
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
              <h2 className="auth-heading inter-font my-2 text-[#111827]">Welcome Back!</h2>
              <p className="bottom-text inter-font font-normal !text-[#2D3643] mb-4">
                Sign in to claim your business listing and take 
control of your online presence.
              </p>
              <ul className="text-left space-y-2 text-gray-700">
                <li className="flex items-center text-[14px] inter-font">
                  <CheckCircle className="size-4 text-[#6F00FF] mr-2" />
                  Manage your business information
                </li>
                <li className="flex items-center text-[14px] inter-font">
                  <CheckCircle className="size-4 text-[#6F00FF] mr-2" />
                  Respond to customer reviews
                </li>
                <li className="flex items-center text-[14px] inter-font">
                  <CheckCircle className="size-4 text-[#6F00FF] mr-2" />
                Update business hours & contact info
                </li>
              </ul>
            </div>
          </div>
        </div>


        {/* Right side */}
        <div className="p-8 rounded-[16px] bg-white authform-shadow w-full">
          <Link href="/" className="common-text inter-font !font-normal text-[#111827] flex items-center mb-[23px]">
            <ArrowLeft className="size-4 mr-1" /> Back to Search
          </Link>

          <h2 className="auth-heading !font-semibold text-[#111827] inter-font mb-2">Sign In</h2>
          <p className="common-text inter-font text-[#2D3643] mb-8">
            Access your business dashboard
          </p>

          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Signin;
