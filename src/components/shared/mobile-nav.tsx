"use client";
import { useDynamicNavLink } from "@/app/biz/_components/dynamic-nav";
import { useAuth } from "@/context/AuthContext";
import { useAuthModal } from "@/hooks/loginModal";
import { useMobileSearch } from "@/hooks/mobileSearch";
import { cn } from "@/lib/utils";
import { type AnimationProps, motion } from "framer-motion";
import { Lightbulb, Menu, Plus, Search, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { CustomButton } from "./custom-button";
const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setOpen: setSearchOpen } = useMobileSearch();
  const router = useRouter();
  const { isAuth } = useAuth();

  const animate: AnimationProps["animate"] = useMemo(() => {
    return {
      opacity: isOpen ? 1 : 0,
      x: isOpen ? 0 : -100,
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "scroll";
    };
  }, [isOpen]);

  const menuRef = useRef<HTMLDivElement | null>(null);

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
        "container py-4 flex justify-between nav_gradient sticky top-0 md:hidden"
      )}
    >
      <Link href={"/"} className="flex items-center">
        <Image
          src="/images/logo.png"
          alt="logo"
          className="object-contain"
          width={150}
          height={100}
        />
      </Link>
      <div className="flex items-center space-x-4">
        <Search
          className="cursor-pointer"
          onClick={() => setSearchOpen(true)}
        />
        <div
          className="flex items-center justify-center w-16 h-16 rounded-full shadow-md cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="shadow-sm" size={20} />
        </div>
      </div>
      <div
        className={cn(
          "absolute bg-white top-0 left-0 z-50 h-screen w-full max-w-[80%] flex flex-col space-y-32 items-center py-20",
          !isOpen ? "hidden" : ""
        )}
      >
        <div
          className={cn(
            "fixed top-0 right-[25%] w-[5rem] h-[5rem] shadow-md flex items-center justify-center rounded-full cursor-pointer"
          )}
          onClick={() => setIsOpen(false)}
        >
          <XIcon className="" />
        </div>
        <div className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="logo"
            className="object-contain"
            width={200}
            height={100}
          />
        </div>

        <div className="flex flex-col items-center justify-center space-y-20">
          <div className="w-full flex flex-col items-center gap-8">
            <Link
              href={"#"}
              className="text-sm text-center font-medium text-black lg:text-sm flex"
            >
              <Lightbulb className="fill-yellow-300 text-yellow-300" />
              <span>Tutorial</span>
            </Link>
            <h2 className="text-sm font-medium text-center text-black">
              Our Blogs
            </h2>
          </div>
          <CustomButton
            onClick={() => {
              if (isAuth) {
                router.push(`/business-dashboard`);
              } else {
                // setOpen()
                // setIsOpen(false)
                router.push(`/search`);
              }
            }}
            className="min-h-[51px] min-w-[196px] rounded-xl"
          >
            <Plus />
            <span>Add Business</span>
          </CustomButton>
        </div>
      </div>
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

export default MobileNav;
