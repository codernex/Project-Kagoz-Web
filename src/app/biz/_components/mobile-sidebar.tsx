"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";
import { useAddBusinessModal } from "@/hooks/addBusinessModal";
import { useMemorizedPath } from "@/hooks/memorizeCurrentPath";
import { userUserProfile } from "@/hooks/userProfileModal";
import { appendApi, cn, trimToWordCount } from "@/lib/utils";
import { useGetBusinessByCurrentUserQuery } from "@/redux/api/business";
import {
  ChevronRightIcon,
  LogOutIcon,
  Menu,
  Settings2,
  SquareArrowOutUpRight,
  User2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDynamicNavLink } from "./dynamic-nav";
const MobileBusinessSidebar: React.FC = () => {
  /**
   * States
   */
  const { setOpen } = useAddBusinessModal();
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname();
  const { logout, isAuth, user } = useAuth();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { dynamicNavLinks, setSelectedSlug, selectedSlug } =
    useDynamicNavLink();
  const { data: business, refetch } = useGetBusinessByCurrentUserQuery(
    { all: false, limit: 10, page: 1 },
    {
      skip: !isAuth,
    }
  );
  const memorizePath = useMemorizedPath(path);
  const { setOpen: setOpenUserProfile } = userUserProfile();
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

  useEffect(() => {
    if (isAuth) {
      refetch();
    }
  }, [isAuth, refetch]);

  return (
    <nav
      className={cn(
        " py-4 flex justify-between sticky top-0 w-full shadow-md h-[8rem]  bg-white z-[99] lg:z-[999]"
      )}
    >
      <div className="container relative flex items-center justify-between w-full">
        <div className="flex gap-xs">
          {!business?.business.length ? (
            <></>
          ) : (
            <Menu
              onClick={() => setIsOpen(true)}
              className="text-muted lg:hidden"
            />
          )}

          <Link href={"/"}>
            <Image
              src={"/images/logo.png"}
              alt="Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </Link>

          <h2 className="hidden italic font-bold text-black lg:block">
            For Business
          </h2>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="w-[5rem] h-[5rem] rounded-full flex items-center justify-center bg-[#F0F0F0] cursor-pointer">
              {user?.imageUrl ? (
                <div className="rounded-full overflow-hidden">
                  <Image
                    src={appendApi(user.imageUrl)}
                    height={60}
                    width={60}
                    alt=""
                  />
                </div>
              ) : (
                <User2Icon size={30} className="text-muted" />
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[25rem] rounded-[.6rem] border-none px-sm py-xs text-black space-y-2">
            <DropdownMenuItem
              onClick={() => setOpenUserProfile(true, user)}
              className="hover:bg-[#F0F0F0] rounded-[.6rem] cursor-pointer pl-4 py-3 space-x-3 font-semibold items-center flex"
            >
              <Settings2 />
              <span>Account Settings</span>
            </DropdownMenuItem>
            <hr className="border-[#ededed]" />

            <DropdownMenuItem
              onClick={() => {
                logout();
                setSelectedSlug("");
              }}
              className="hover:bg-[#F0F0F0] rounded-[.6rem] cursor-pointer pl-4 py-3 space-x-3 font-semibold items-center flex"
            >
              <LogOutIcon />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {!business?.business.length ? (
        <></>
      ) : (
        <div
          className={cn(
            "absolute bg-white top-0 left-0 z-50 h-screen w-full max-w-[80%] flex flex-col py-6",
            !isOpen ? "hidden" : ""
          )}
        >
          {/* <div className={
                    cn('fixed top-0 right-[5%] w-[5rem] h-[5rem] shadow-md flex items-center justify-center rounded-full cursor-pointer')
                } onClick={() => setIsOpen(false)}>
                    <XIcon className='' />
                </div> */}
          <div className="h-full px-3 overflow-y-auto ">
            <div className="relative space-y-4">
              <div className="w-[90%] py-10">
                {business?.business?.map((b) => {
                  return (
                    <Link
                      key={b.id}
                      href={`/biz/${b.slug}/dashboard/${memorizePath}`}
                      onClick={() => setSelectedSlug(b.slug)}
                      className={cn(
                        "font-bold !text-black text-smd flex items-center justify-between border-b border-[#e4e4e4] last:border-none py-2",

                        path.includes(b.slug) ? "bg-[#ededed]" : ""
                      )}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="flex justify-between w-full">
                            <div className="relative">
                              {trimToWordCount(b?.name, 2)}
                              {b.isApproved ? (
                                <div className="h-4 w-4 bg-green-500 rounded-full absolute top-2 -right-6" />
                              ) : (
                                <div className="h-4 w-4 bg-red-500 rounded-full absolute top-2 -right-6" />
                              )}
                            </div>
                            <ChevronRightIcon />
                          </TooltipTrigger>
                          <TooltipContent
                            className={cn(
                              "border-[#e7e7e7] min-w-[200px] text-center rounded-[6px] text-white",
                              b.isApproved ? "bg-green-500" : "bg-green-500"
                            )}
                          >
                            {b.isApproved
                              ? "Business is live"
                              : "Business is pending"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Link>
                  );
                })}
              </div>
              <div
                className="absolute top-0 right-0 cursor-pointer text-secondary"
                onClick={() => {
                  window.open(
                    window.location.origin + `/business/${selectedSlug}`
                  );
                }}
              >
                <SquareArrowOutUpRight />
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
                        isActive && "bg-[#F5F5F5]"
                      )}
                    >
                      <Icon />
                      <span className="ml-3 text-sm font-semibold">{name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <hr className="border-[#ededed] mt-6 mb-3" />
            <Button
              onClick={() => {
                setOpen(true);
                setIsOpen(false);
              }}
              variant={"outline"}
              className="text-black border-black rounded-xs"
            >
              Add Business
            </Button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen ? (
        <div
          ref={menuRef}
          className={cn(
            "absolute overflow-hidden top-0 left-0 h-screen w-full bg-black opacity-50 z-40",
            isOpen ? "block" : "hidden"
          )}
        ></div>
      ) : (
        ""
      )}
    </nav>
  );
};

export default MobileBusinessSidebar;
