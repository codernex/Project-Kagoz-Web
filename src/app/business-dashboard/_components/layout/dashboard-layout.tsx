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
  const { user } = useAuth()
  // const router = useRouter()

  // // Fetch user info directly on component mount with caching
  // useEffect(() => {
  //   let isMounted = true

  //   const fetchUserInfo = async () => {
  //     try {
  //       setLoading(true)
        
  //       // First check if user has auth token
  //       const authToken = document.cookie
  //         .split('; ')
  //         .find(row => row.startsWith('auth_token='))
  //         ?.split('=')[1]
        
  //       if (!authToken) {
  //         console.log('No auth token found, redirecting to signin')
  //         if (isMounted) {
  //           setShouldRedirect(true)
  //           router.push("/signin")
  //         }
  //         return
  //       }
        
  //       // Check if we have cached user info first
  //       const cachedUserInfo = sessionStorage.getItem('cached_user_info')
  //       if (cachedUserInfo) {
  //         const userData = JSON.parse(cachedUserInfo)
  //         if (isMounted) {
  //           setUserInfo(userData)
            
  //           // Check if user has correct role
  //           if (userData?.role !== 'user') {
  //             setShouldRedirect(true)
  //             router.push("/signin")
  //             return
  //           }
  //           setLoading(false)
  //         }
  //         return
  //       }
        
  //       // If no cache, fetch from API
  //       const response = await axiosInstance.get('/auth/me')
  //       const userData = response?.data?.data ?? response?.data
        
  //       if (userData && isMounted) {
  //         // Cache the user info for future use
  //         sessionStorage.setItem('cached_user_info', JSON.stringify(userData))
  //         setUserInfo(userData)
          
  //         // Check if user has correct role
  //         if (userData?.role !== 'user') {
  //           setShouldRedirect(true)
  //           router.push("/signin")
  //           return
  //         }
  //       } else if (isMounted) {
  //         setShouldRedirect(true)
  //         router.push("/signin")
  //         return
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch user info:', error)
  //       // Clear cache on error
  //       sessionStorage.removeItem('cached_user_info')
  //       if (isMounted) {
  //         setShouldRedirect(true)
  //         router.push("/signin")
  //       }
  //       return
  //     } finally {
  //       if (isMounted) {
  //         setLoading(false)
  //       }
  //     }
  //   }

  //   fetchUserInfo()

  //   return () => {
  //     isMounted = false
  //   }
  // }, [router])


  // // Don't render anything if we're redirecting
  // if (shouldRedirect) {
  //   return null
  // }

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin" />
  //     </div>
  //   )
  // }

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
