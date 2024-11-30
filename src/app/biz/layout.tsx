"use client";
import { useAuth } from "@/context/AuthContext";
import { useAddBusinessModal } from "@/hooks/addBusinessModal";
import { useAuthModal } from "@/hooks/loginModal";
import { useGetBusinessByCurrentUserQuery } from "@/redux/api/business";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import AddBusiness from "./_components/add-business";
import MobileBusinessSidebar from "./_components/mobile-sidebar";
import { Sidebar } from "./_components/sidebar";
import SwitchBusiness from "./_components/switch-business";
export default function BusinessDashboardLayout({
  children,
}: React.PropsWithChildren) {
  const { isAuth } = useAuth()
  const { setOpen } = useAuthModal()
  const { setOpen: setAddBusinessModal } = useAddBusinessModal()
  const router = useRouter()

  // State to track loading status
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    if (isAuth === false && !loading) {
      router.push("/"); // Redirect to home or login page
    } else {
      setLoading(false); // Once auth status is verified, stop loading
    }
  }, [isAuth, setOpen, router, loading]);

  const { data, isLoading, isSuccess } = useGetBusinessByCurrentUserQuery(undefined, {
    skip: !isAuth
  })

  useEffect(() => {
    if (!isLoading && isSuccess && !data) {
      setAddBusinessModal(true)
    }
  }, [data, isLoading, setAddBusinessModal, isSuccess])

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
      <AddBusiness onOpenChange={
        !!data?.length
      } />
      <SwitchBusiness />
    </div>
  );
}
