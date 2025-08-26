"use client";
import React from "react";
import {  ArrowLeft, CheckCircle } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import SignupForm from "../_components/signupForm";

const Signup: React.FC = () => {
  return (
    <div className=" flex items-center justify-center  py-[54px]">
      <div className="max-w-[942px] place-items-center grid grid-cols-1 md:grid-cols-2 gap-[56px] bg-white rounded-2xl ">
        {/* Left side */}
        <div className="relative hidden md:flex items-center justify-center w-full pl-7 mx-1.5">
          {/* Background gradient image */}
          <div className="absolute bottom-5 -left-2 inset-0 flex items-center justify-center ">
            <Image
              src="/images/authbg.png"
              alt="Background"
              width={600}
              height={600}
              className="w-[430px]  object-cover rounded-2xl rotate-1"
            />
          </div>
          <div className="bg-white px-[42px] authform2-shadow relative z-10 py-8 rounded-[16px] ">
            <div className="text-center">
              <Image
                src="/images/signup1.png"
                alt="Business"
                width={4000}
                height={4000}
                className="w-[272px] h-[170px] mx-auto "
              />
              <h2 className="auth-heading inter-font my-2 text-[#111827]">Join Our Community!</h2>
              <p className="bottom-text inter-font font-normal !text-[#2D3643] mb-4">
                Create your business profile and connect with
                thousands Of potential customers.
              </p>
              <ul className="text-left space-y-2 text-gray-700">
                <li className="flex items-center text-[14px] inter-font">
                  <CheckCircle className="size-4 text-[#6F00FF] mr-2" />
                  Free business listing
                </li>
                <li className="flex items-center text-[14px] inter-font">
                  <CheckCircle className="size-4 text-[#6F00FF] mr-2" />
                  Customer review management
                </li>
                <li className="flex items-center text-[14px] inter-font">
                  <CheckCircle className="size-4 text-[#6F00FF] mr-2" />
                  Mobile-friendly profile
                </li>
              </ul>
            </div>
          </div>
        </div>


        {/* Right side */}
        <div className="p-8 rounded-[16px] w-full bg-white authform-shadow">
          <Link href="/" className="common-text inter-font !font-normal text-[#111827] flex items-center mb-[23px]">
            <ArrowLeft className="size-4 mr-1" /> Back to Search
          </Link>

          <h2 className="auth-heading !font-semibold text-[#111827] inter-font mb-2">Create Account</h2>
          <p className="common-text inter-font text-[#2D3643] mb-8">
            Add your business to our directory
          </p>

          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default Signup;
