"use client";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "./nav";
import { toast } from "sonner";

export const Sidebar = () => {
  const path = usePathname();
  toast.success("Hello");
  return (
    <aside
      id="default-sidebar"
      className="w-[28rem] hidden lg:block h-screen transition-transform -translate-x-full sm:translate-x-0 "
      aria-label="Sidebar"
    >
      <div className="h-full px-3 overflow-y-auto  ">
        <div className="space-y-4 relative">
          <div className="w-[90%]">
            <h2 className="text-mdx font-bold text-black">Business name</h2>
            <p className="text-xsm text-muted">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </p>
          </div>
          <Link className="absolute top-0 right-0 text-secondary" href={"/"}>
            <ExternalLink />
          </Link>
        </div>
        <hr className="border-[#ededed] mt-6 mb-3" />
        <ul className="space-y-4 font-medium">
          {navLinks.map(({ name, href, icon: Icon }) => {
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
                  <span className="ml-3 text-sm font-medium leading-2">
                    {name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};
