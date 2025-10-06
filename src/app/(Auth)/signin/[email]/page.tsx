"use client";
import React from 'react'
import OtpPage from '../../_components/otp'
import { useParams } from 'next/navigation'

const Page = () => {
  const params = useParams();
  console.log("🚀 ~ Page ~ params:", params)
  const raw = typeof params?.email === 'string' ? params.email : '';
  const email = raw ? decodeURIComponent(raw) : '';
  return <OtpPage handle={email} />
}

export default Page
