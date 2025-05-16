"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useAddBusinessModal } from "@/hooks/addBusinessModal";
import { useMemorizedPath } from "@/hooks/memorizeCurrentPath";
import { cn, trimToWordCount } from "@/lib/utils";
import {
  useGetBusinessByCurrentUserQuery
} from "@/redux/api/business";
import {
  ChevronRightIcon,
  SquareArrowOutUpRight
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDynamicNavLink } from "./dynamic-nav";
import { Pagination } from "./pagination";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export const Sidebar = () => {
  const { isAuth } = useAuth()
  const path = usePathname();
  const { dynamicNavLinks, setSelectedSlug, selectedSlug } = useDynamicNavLink();
  const searchParams = useSearchParams()
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const { data: business, refetch } = useGetBusinessByCurrentUserQuery({ all: false, limit: 10, page }, {
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
            {business?.business?.map((b) => {
              return (
                <Link
                  key={b.id}
                  href={`/biz/${b.slug}/dashboard/${memorizePath}`}
                  onClick={() => setSelectedSlug(b.slug)}
                  className={
                    cn(
                      "font-bold !text-black text-smd flex items-center justify-between border-b border-[#e4e4e4] last:border-none py-2 px-2 rounded-[6px]",
                      path.includes(b.slug) ? 'bg-[#ededed]' : ''
                    )
                  }
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex justify-between w-full">
                        <div className="relative">
                          {trimToWordCount(b?.name, 2)}
                          {
                            b.isApproved ? (
                              <div className="h-4 w-4 bg-green-500 rounded-full absolute top-2 -right-6" />
                            ) :
                              <div className="h-4 w-4 bg-red-500 rounded-full absolute top-2 -right-6" />
                          }
                        </div>
                        <ChevronRightIcon />
                      </TooltipTrigger>
                      <TooltipContent className={cn("border-[#e7e7e7] min-w-[200px] text-center rounded-[6px] text-white",b.isApproved?"bg-green-500":"bg-green-500")}>{
                        b.isApproved ? "Business is live" : "Business is pending"
                      }</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Link>
              );
            })}
            <Pagination setPage={setPage} currentPage={page} totalPages={business?.totalPages} />
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
          {
            dynamicNavLinks.map(({ name, href, icon: Icon }) => {
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
            })
          }
        </ul>
        <hr className="border-[#ededed] mt-6 mb-3" />
        <Button onClick={() => setOpen(true)} variant={'outline'} className="text-black border-black rounded-xs">
          Add Business
        </Button>
      </div>
    </aside>
  );
};
