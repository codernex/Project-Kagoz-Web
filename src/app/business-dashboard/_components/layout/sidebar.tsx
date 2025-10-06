"use client"
import { Button } from "@/components/ui/button"
import { Home, LogOut, X, Award, Crown } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/context/AuthContext"

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user,logout } = useAuth()

  // Extract slug from pathname if on edit-business page
  const isEditBusinessPage = pathname.includes('/business-dashboard/edit-business/')
  const businessSlug = isEditBusinessPage ? pathname.split('/business-dashboard/edit-business/')[1] : null

  const handleSpecialFeaturesClick = (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (businessSlug) {
      try {
        router.push(`/business-dashboard/features/${businessSlug}`)
      } catch (error) {
        console.warn('Navigation error handled:', error)
        window.location.href = `/business-dashboard/features/${businessSlug}`
      }
    }
  }

  // Base navigation items
  const baseNavItems: Array<{ label: string; href: string; icon: any; onClick?: (e: React.MouseEvent) => void }> = [
    { label: "Home", href: "/business-dashboard", icon: Home },
    { label: "Page Upgrades", href: "/business-dashboard/page-upgrade", icon: Crown },
  ]

  // Add Special Features only if on edit-business page
  const navItems = isEditBusinessPage 
    ? [
        ...baseNavItems.slice(0, 1), // Home
        { label: "Special Features", href: "#", icon: Award, onClick: handleSpecialFeaturesClick },
        ...baseNavItems.slice(1) // Page Upgrades
      ]
    : baseNavItems
  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/10  z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-[260px] bg-white border border-[#E4E4E4] transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between sm:p-[26.5px] p-4 border-b border-[#E4E4E4]">
          <div className="flex items-center space-x-2 w-fit h-fit cursor-pointer" onClick={() => router.push('/')}>
            
            <Image src="/images/logo.png" alt="KAGOZ" width={1000} height={500} className="w-[179px] object-fill h-[30px]" />
           
          </div>
          <Button variant="ghost" size="sm" className="lg:hidden w-fit h-fit" onClick={() => setSidebarOpen(false)}>
            <X className="h-[20px] w-[20px]" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-4">
            {navItems.map(({ label, href, icon: Icon, onClick }) => {
              if (onClick) {
                return (
                  <button
                    key={label}
                    onClick={onClick}
                    className={`flex items-center w-full px-[17px] py-[12px] rounded transition justify-start text-[18px] leading-6 ${
                      pathname.includes('/business-dashboard/features') && pathname.includes(businessSlug || '')
                        ? "bg-[#F1EBFF] border border-[#6F00FF] text-[#6F00FF] rounded-[8px] font-medium"
                        : "text-[#353535] hover:text-gray-900 hover:bg-gray-100 font-normal"
                    }`}
                  >
                    <Icon className="mr-3 size-6" />
                    {label}
                  </button>
                )
              }
              
              return (
                <Link
                  key={label}
                  href={href}
                  className={`flex items-center w-full px-[17px] py-[12px] rounded transition justify-start text-[18px]  leading-6 ${
                    pathname === href
                      ? "bg-[#F1EBFF] border border-[#6F00FF] text-[#6F00FF] rounded-[8px] font-medium"
                      : "text-[#353535] hover:text-gray-900 hover:bg-gray-100 font-normal"
                  }`}
                >
                  <Icon className="mr-3 size-6" />
                  {label}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Logout button */}
        <div className="p-4  mt-auto">
          <button
            onClick={() => logout()}
            className="w-full px-[17px] py-[12px] !rounded-[8px] text-white flex justify-start items-center bg-red-500 hover:bg-red-600"
          >
            <LogOut className="mr-3 h-[20px] w-[20px]" />
            Logout
          </button>
        </div>
      </div>
    </>
  )
}
