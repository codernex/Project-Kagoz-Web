"use client";
import { useAuth } from "@/context/AuthContext";
import MobileBusinessSidebar from "./_components/mobile-sidebar";
import { Sidebar } from "./_components/sidebar";
import { useEffect, useState } from "react";
import { useAuthModal } from "@/hooks/loginModal";
import { useRouter } from 'next/navigation'
export default function BusinessDashboardLayout({
  children,
}: React.PropsWithChildren) {
  const { isAuth } = useAuth()
  const { setOpen } = useAuthModal()
  const router = useRouter()

  // State to track loading status
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuth === false && !loading) {
      setOpen();
      router.push("/"); // Redirect to home or login page
    } else {
      setLoading(false); // Once auth status is verified, stop loading
    }
  }, [isAuth, setOpen, router, loading]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>; // Show a loading indicator or placeholder while checking auth
  }
  return (
    <div>
      <MobileBusinessSidebar />
      <div className="container py-10 lg:flex lg:gap-md">
        <Sidebar />
        <main className="w-full px-">{children}</main>
      </div>
    </div>
  );
}
