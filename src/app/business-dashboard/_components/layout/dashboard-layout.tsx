"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"




export default function BusinessDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
 const { isAuth } = useAuth()
 const [loading, setLoading] = useState(true);
 const router = useRouter()
 
     useEffect(() => {
         if (isAuth === false && !loading) {
             router.push("/"); // Redirect to home or login page
         } else {
             setLoading(false); // Once auth status is verified, stop loading
         }
     }, [isAuth, router, loading]);
        if (loading) {
        return <div className="flex items-center justify-center h-screen">
            <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>; // Show a loading indicator or placeholder while checking auth
    }

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="min-h-screen bg-[#FCFCFD] font-inter">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* Main content */}
          <div className="lg:ml-[260px]">
            <Header setSidebarOpen={setSidebarOpen} className="fixed top-0 left-0 right-0 z-30 lg:ml-64" />
            <main className="pt-[72px]">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
