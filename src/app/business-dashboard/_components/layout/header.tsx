"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/AuthContext"
import {  LogOutIcon, Menu, Settings2, User2Icon } from "lucide-react"
import Image from "next/image"
import { appendApi, cn, trimToWordCount } from "@/lib/utils";
import { userUserProfile } from "@/hooks/userProfileModal"
interface HeaderProps {
  setSidebarOpen: (open: boolean) => void
  className?: string
}

export function Header({ setSidebarOpen,className }: HeaderProps) {
  const { user,logout } = useAuth()
   const { setOpen: setOpenUserProfile } = userUserProfile()
  return (
    <header className="bg-white border-b border-[#E4E4E4] fixed top-0 left-0 right-0 z-30 lg:ml-64">
      <div className="flex items-center justify-between px-4 sm:py-[26px] p-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-[20px] w-[20px]" />
          </Button>
        
        </div>
        
         <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center bg-[#6F00FF] cursor-pointer">
                      {
                        user?.imageUrl ? (
                          <div className="rounded-full overflow-hidden">
                            <Image src={appendApi(user.imageUrl)} height={60} width={60} alt='' />
                          </div>
                        ) : <User2Icon size={20} className="text-muted text-white" />
                      }
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className=" rounded-[.6rem] border-none px-sm py-xs text-black space-y-2">
                    <DropdownMenuItem onClick={() => setOpenUserProfile(true, user)} className="hover:bg-[#F0F0F0] rounded-[.6rem] cursor-pointer pl-4 py-3 space-x-3 font-semibold items-center flex">
                      <Settings2 />
                      <span>Account Settings</span>
                    </DropdownMenuItem>
                    <hr className="border-[#ededed]" />
        
                    <DropdownMenuItem
                      onClick={() => {
                        logout()
                        // setSelectedSlug('')
                      }}
                      className="hover:bg-[#F0F0F0] rounded-[.6rem] cursor-pointer pl-4 py-3 space-x-3 font-semibold items-center flex"
                    >
                      <LogOutIcon />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
      </div>
    </header>
  )
}
