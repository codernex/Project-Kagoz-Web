"use client";
import { CustomButton } from "@/components/shared/custom-button";
import { useAuth } from "@/context/AuthContext";
import { useAddBusinessModal } from "@/hooks/addBusinessModal";
import { useAuthModal } from "@/hooks/loginModal";
import { useGetBusinessByCurrentUserQuery } from "@/redux/api/business";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import AddBusiness from "./_components/add-business";
import MobileBusinessSidebar from "./_components/mobile-sidebar";
import { Sidebar } from "./_components/sidebar";
import { UserProfile } from "./_components/user-profile";
export default function BusinessDashboardLayout({
    children,
}: React.PropsWithChildren) {
    const { isAuth } = useAuth()
    const { setOpen } = useAuthModal()

    const { setOpen: setBusinessOpen } = useAddBusinessModal()
    const router = useRouter()
    const searchParams = useSearchParams()

    const param = useMemo(() => {
        return searchParams.get('q')
    }, [searchParams])

    // State to track loading status
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuth === false && !loading) {
            router.push("/"); // Redirect to home or login page
        } else {
            setLoading(false); // Once auth status is verified, stop loading
        }
    }, [isAuth, setOpen, router, loading]);

    const { data, isLoading, isSuccess } = useGetBusinessByCurrentUserQuery({ all: false, limit: 10, page: 1 }, {
        skip: !isAuth
    })

    const showToastByParam = (param: string) => {
        switch (param) {
            case 'needs_attention':
                toast.error("Payments are in pending state, We will verify and give your requested access")
                break;
            case 'success':
                toast.success("Congratulations you have access to this features")
                break;
            case 'user_cancelled':
                toast.success("Attention: You have cancelled the payment")
                break;
            case 'error':
                toast.success("Something went wrong")
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        if (param) {
            showToastByParam(param)
        }
    }, [param])


    if (loading) {
        return <div className="flex items-center justify-center h-screen">
            <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>; // Show a loading indicator or placeholder while checking auth
    }


    if (!data?.business?.length) {
        return (
            <>
                <MobileBusinessSidebar />
                <div className="flex items-center justify-center text-black font-semibold flex-col gap-8 h-screen">
                    <p className="text-md">Look like you {"don't have a business"}, Try to create one</p>
                    <CustomButton onClick={() => setBusinessOpen(true)} className="rounded-xs bg-black w-full">
                        Add new business
                    </CustomButton>
                </div>
                <AddBusiness onOpenChange={
                    true
                } />
                <UserProfile />
            </>

        )
    }
    return (
        <div>
            <MobileBusinessSidebar />
            <div className="container py-10 lg:flex lg:gap-md">
                <Sidebar />
                <main className="w-full px-">{children}</main>
            </div>
            <AddBusiness onOpenChange={
                true
            } />
            <UserProfile />
        </div>
    );
}
