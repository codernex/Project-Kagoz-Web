"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { UserProfile } from "../user-profile"
import { useAuth } from "@/context/AuthContext"
import { usePathname, useRouter } from "next/navigation"
import { axiosInstance } from "@/redux/api"

export default function BusinessDashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const { user,isAuth } = useAuth()
  const router = useRouter()


  useEffect(() => {
      if (isAuth === false && !loading) {
          router.push("/"); // Redirect to home or login page
      } else {
          setLoading(false); // Once auth status is verified, stop loading
      }
  }, [isAuth, router, loading]);
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
