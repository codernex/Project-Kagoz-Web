"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { UserProfile } from "../user-profile"
import { useAuth } from "@/context/AuthContext"
import {  useRouter } from "next/navigation"

export default function BusinessDashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { isAuth } = useAuth()
  const router = useRouter()
  const isMountedRef = useRef(true)

  useEffect(() => {
      if (isAuth === false && !loading && isMountedRef.current) {
          // Use requestAnimationFrame to ensure DOM is stable before navigation
          requestAnimationFrame(() => {
              if (isMountedRef.current) {
                  try {
                      router.push("/"); // Redirect to home or login page
                  } catch (error) {
                      console.warn('Navigation error handled:', error)
                      window.location.href = '/'
                  }
              }
          });
      } else if (isAuth === true) {
          setLoading(false); // Once auth status is verified, stop loading
      }
  }, [isAuth, router, loading]);

  // Cleanup function to prevent state updates after unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCFCFD] font-inter flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6F00FF] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFCFD] font-inter">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:ml-[260px]">
        <Header
          setSidebarOpen={setSidebarOpen}
          className="fixed top-0 left-0 right-0 z-30 lg:ml-64"
        />
        <main className="pt-[72px]">{children}</main>
      </div>
      <UserProfile />
    </div>
  )
}
