"use client";
import { useMemorizedPath } from "@/hooks/memorizeCurrentPath";
import { cn } from "@/lib/utils";
import {
  useGetBusinessByCurrentUserQuery
} from "@/redux/api/business";
import {
  ChevronRightIcon,
  SquareArrowOutUpRight
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDynamicNavLink } from "./dynamic-nav";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAddBusinessModal } from "@/hooks/addBusinessModal";
export const Sidebar = () => {
  const { isAuth } = useAuth()
  const path = usePathname();
  const { dynamicNavLinks, setSelectedSlug, selectedSlug } = useDynamicNavLink();
  const { data: business, refetch } = useGetBusinessByCurrentUserQuery(undefined, {
    skip: !isAuth
  });
  const memorizePath = useMemorizedPath(path)
  const { setOpen } = useAddBusinessModal()



  useEffect(() => {
    if (isAuth) {
      refetch()
    }
  }, [isAuth, refetch])
  return (
    <aside
      id="default-sidebar"
      className="w-[28rem] hidden lg:block h-screen transition-transform -translate-x-full sm:translate-x-0 "
      aria-label="Sidebar"
    >
      <div className="h-full px-3 overflow-y-auto ">
        <div className="relative space-y-4">
          <div className="w-[90%] py-10">
            {business?.map((b) => {
              return (
                <Link
                  key={b.id}
                  href={`/biz/${b.slug}/dashboard/${memorizePath}`}
                  onClick={() => setSelectedSlug(b.slug)}
                  className={
                    cn(
                      "font-bold !text-black text-smd flex items-center justify-between border-b border-[#e4e4e4] last:border-none py-2",
                      path.includes(b.slug) ? 'bg-[#ededed]' : ''
                    )
                  }
                >
                  {b?.name}
                  <ChevronRightIcon />
                </Link>
              );
            })}
          </div>
          <div
            className="absolute top-0 right-0 cursor-pointer text-secondary"
            onClick={() => {
              window.open(window.location.origin + `/business/${selectedSlug}`)
            }}
          >
            <SquareArrowOutUpRight />
          </div>
        </div>
        <hr className="border-[#ededed] mt-6 mb-3" />
        <ul className="space-y-4 font-medium">
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
                  <span className="ml-3 text-sm font-medium leading-2">
                    {name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <hr className="border-[#ededed] mt-6 mb-3" />
        <Button onClick={() => setOpen(true)} variant={'outline'} className="text-black border-black rounded-xs">
          Add Business
        </Button>
      </div>
    </aside>
  );
};
