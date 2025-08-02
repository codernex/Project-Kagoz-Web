"use client";
import { useAuth } from "@/context/AuthContext";
import { useAuthModal } from "@/hooks/loginModal";
import { cn } from "@/lib/utils";
import { AnimationProps, motion } from "framer-motion";
import { Lightbulb, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CustomButton } from "./custom-button";
import MobileNav from "./mobile-nav";
import NavSearch from "./nav-search";
import { useDynamicNavLink } from "@/app/biz/_components/dynamic-nav";
import Image from "next/image";
import { toast } from "sonner";

const Header = () => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const router = useRouter();
  const { isAuth } = useAuth();
  const { setOpen } = useAuthModal();
  const { selectedSlug } = useDynamicNavLink();

  // Memoize the scroll handler
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    setScrollTop(scrollTop);
    setHasScrolled(scrollTop > 0);
  }, []);

  useEffect(() => {
    // Check scroll position on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // Memoize the animation object to prevent re-creation on every render

  return (
    <header
      className={`sticky top-0 w-full z-50 ${
        hasScrolled ? "bg-white drop-shadow" : "nav_gradient"
      } sticky:bg-transparent`}
    >
      <nav
        className={cn(
          "container justify-between items-center py-8 bg-transparent hidden md:flex"
        )}
      >
        {/* Logo */}
        <Link href={"/"}>
          <div className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="logo"
              className="object-contain"
              width={200}
              height={100}
            />
          </div>
        </Link>
        {/* Search */}
        <div
          className={cn(
            "w-full md:max-w-2xl lg:max-w-3xl xl:max-w-5xl shadow-md rounded-xl px-4 py-3 bg-white",
            scrollTop < 400 ? "hidden" : "lg:block"
          )}
        >
          <NavSearch />
        </div>
        {/* Navigation */}
        <div className="flex items-center md:space-x-8 lg:space-x-14">
          <Link
            href={"#"}
            className="text-xs font-medium text-black lg:text-sm flex"
          >
            <span>Tutorial</span>{" "}
            <Lightbulb className="fill-yellow-300 text-yellow-300" />
          </Link>
          <Link
            href={"/blogs"}
            className="text-xs font-medium text-black lg:text-sm"
          >
            Our Blogs
          </Link>
          <CustomButton
            onClick={() => {
              toast.error(
                "Currently we are not allowing any businesses! Stay tuned"
              );
              // if (isAuth) {
              //   router.push(`/biz/${selectedSlug}/dashboard`)
              // } else {
              //   setOpen()
              // }
            }}
            className="md:min-h-[40px] lg:min-h-[51px] md:min-w-[140px] lg:min-w-[196px] rounded-xl space-x-1 lg:space-x-3 text-xs lg:text-sm text-white"
          >
            <Plus />
            <span>Add Business</span>
          </CustomButton>
        </div>
      </nav>
      <MobileNav />
    </header>
  );
};

export default Header;
