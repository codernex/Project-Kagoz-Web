"use client";
import { cn } from "@/lib/utils";
import { type AnimationProps, motion } from "framer-motion";
import { Menu, Plus, Search, XIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { CustomButton } from "./custom-button";
const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

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
        "container py-4 flex justify-between nav_gradient sticky top-0 md:hidden",
      )}
    >
      <div className="flex items-center">
        <Image
          src="/images/logo.png"
          alt="logo"
          className="object-contain"
          width={150}
          height={100}
        />
      </div>

      <div className="flex items-center space-x-4">
        <Search />
        <div
          className="h-16 shadow-md rounded-full w-16 flex items-center justify-center cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="shadow-sm" size={20} />
        </div>
      </div>

      <motion.div
        animate={animate}
        className={cn(
          "absolute bg-white top-0 left-0 z-50 h-screen w-full max-w-[80%] flex flex-col space-y-32 items-center py-20",
          !isOpen ? "hidden" : "",
        )}
      >
        <div
          className={cn(
            "fixed top-0 right-[25%] w-[5rem] h-[5rem] shadow-md flex items-center justify-center rounded-full cursor-pointer",
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
        <div className="flex flex-col justify-center items-center space-y-20">
          <h2 className="text-black text-sm font-medium text-center">
            Our Blogs
          </h2>
          <CustomButton className="min-h-[51px] min-w-[196px] rounded-xl">
            <Plus />
            <span>Add Business</span>
          </CustomButton>
        </div>
      </motion.div>
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

export default MobileNav;
