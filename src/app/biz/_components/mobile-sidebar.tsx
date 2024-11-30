"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useSwitchBusinessModal } from "@/hooks/switchBusinessModal";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  LogOutIcon,
  Menu,
  Settings2,
  ToggleRight,
  User2Icon
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDynamicNavLink } from "./nav";
import { useGetBusinessBySlugQuery } from "@/redux/api/business";
const MobileBusinessSidebar: React.FC = () => {
  /**
   * States
   */
  const { setOpen } = useSwitchBusinessModal()
  const params = useParams() as { slug: string }
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname();
  const { logout } = useAuth()
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { dynamicNavLinks } = useDynamicNavLink()
  console.log(params);

  const {
    data
  } = useGetBusinessBySlugQuery(params.slug)

  /**
   * Life Cycle Hook
   */
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "scroll";
    };
  }, [isOpen]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        isOpen &&
        menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav
      className={cn(
        " py-4 flex justify-between sticky top-0 w-full shadow-md h-[8rem]  bg-white lg:z-[9999]",
      )}
    >
      <div className="container relative flex items-center justify-between w-full">
        <div className="flex gap-xs">
          <Menu
            onClick={() => setIsOpen(true)}
            className="text-muted lg:hidden"
          />

          <img
            src={"/images/logo.png"}
            alt="Logo"
            width={80}
            height={80}
            className="object-contain"
          />

          <h2 className="hidden italic font-bold text-black lg:block">
            For Business
          </h2>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="w-[5rem] h-[5rem] rounded-full flex items-center justify-center bg-[#F0F0F0] cursor-pointer">
              <User2Icon size={30} className="text-muted" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[25rem] rounded-[.6rem] border-none px-sm py-xs text-black space-y-2">
            <DropdownMenuItem className="hover:bg-[#F0F0F0] rounded-[.6rem] cursor-pointer pl-4 py-3 space-x-3 font-semibold items-center flex">
              <Settings2 />
              <span>Account Settings</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="hover:bg-[#F0F0F0] rounded-[.6rem] cursor-pointer pl-4 py-3 space-x-3 font-semibold items-center flex">
              <ToggleRight />
              <span>Test</span>
            </DropdownMenuItem>
            <hr className="border-[#ededed]" />

            <DropdownMenuItem
              onClick={logout}
              className="hover:bg-[#F0F0F0] rounded-[.6rem] cursor-pointer pl-4 py-3 space-x-3 font-semibold items-center flex"
            >
              <LogOutIcon />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <motion.div
        className={cn(
          "absolute bg-white top-0 left-0 z-50 h-screen w-full max-w-[80%] flex flex-col py-6",
          !isOpen ? "hidden" : "",
        )}
      >
        {/* <div className={
                    cn('fixed top-0 right-[5%] w-[5rem] h-[5rem] shadow-md flex items-center justify-center rounded-full cursor-pointer')
                } onClick={() => setIsOpen(false)}>
                    <XIcon className='' />
                </div> */}
        <div className="h-full px-3 overflow-y-auto ">
          <div className="relative space-y-4">
            <div className="w-[90%]">
              <h2 className="font-bold text-black text-mdx">{data?.name}</h2>
              <p className="text-xsm text-muted">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
              </p>
            </div>
            <div className="absolute top-0 right-0 cursor-pointer text-secondary" onClick={() => setOpen(true)} >
              <ArrowLeftRight />
            </div>
          </div>
          <hr className="border-[#ededed] mt-6 mb-3" />
          <ul className="space-y-2 font-medium">
            {dynamicNavLinks.map(({ name, href, icon: Icon }) => {
              const isActive = path === href;
              return (
                <li key={name}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center px-2 py-3 gap-[.5rem] text-base font-normal text-black rounded-[.5rem] hover:bg-[#F5F5F5]",
                      isActive && "bg-[#F5F5F5]",
                    )}
                  >
                    <Icon />
                    <span className="ml-3 text-sm font-semibold">{name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </motion.div>

      {/* Backdrop */}
      {isOpen ? (
        <div
          ref={menuRef}
          className={cn(
            "absolute overflow-hidden top-0 left-0 h-screen w-full bg-black opacity-50 z-40",
            isOpen ? "block" : "hidden",
          )}
        ></div>
      ) : (
        ""
      )}
    </nav>
  );
};

export default MobileBusinessSidebar;
