import { useAuth } from "@/context/AuthContext";
import { useAddBusinessModal } from "@/hooks/addBusinessModal";
import { useBusinessStore } from "@/hooks/selectedBusiness";
import { useGetBusinessByCurrentUserQuery } from "@/redux/api/business";
import {
  AwardIcon,
  BookmarkPlus,
  HomeIcon,
  Images,
  ListVideo,
  type LucideIcon,
  Megaphone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { skip } from "node:test";
import { useEffect, useMemo, useState } from "react";

export const navLinks: { name: string; href: string; icon: LucideIcon }[] = [
  {
    name: "Home",
    href: "/biz/dashboard",
    icon: HomeIcon,
  },
  {
    name: "KAGOZ Ads",
    href: "/biz/dashboard/ads",
    icon: Megaphone,
  },
  {
    name: "Business Information",
    href: "/biz/dashboard/info",
    icon: AwardIcon,
  },
  {
    name: "Feaured Clients",
    href: "/biz/dashboard/featured-clients",
    icon: AwardIcon,
  },
  {
    name: "Customer Video Feedback",
    href: "/biz/dashboard/customer-video-feedback",
    icon: ListVideo,
  },
  {
    name: "Featured Offer",
    href: "/biz/dashboard/featured-offer",
    icon: BookmarkPlus,
  },
  {
    name: "Photo Gallery",
    href: "/biz/dashboard/gallery",
    icon: Images,
  },
];

export const getDynamicNavLink = (slug: string) => {
  return navLinks.map(({ name, href, icon: Icon }) => {

    const dynamicHref = href.replace('/biz/dashboard', `/biz/${slug}/dashboard`);
    return {
      name,
      href: dynamicHref,
      icon: Icon,
    };
  });
}

// Custom hook to manage business selection and dynamic navigation
export const useDynamicNavLink = () => {
  const { isAuth } = useAuth()
  const { data: businesses, isLoading } = useGetBusinessByCurrentUserQuery(undefined, {
    skip: !isAuth
  })
  const { selectedSlug, setSelectedSlug, loadSelectedSlug } = useBusinessStore();
  const { setOpen } = useAddBusinessModal()
  const router = useRouter()
  useEffect(() => {
    // Load selected business slug from localStorage when the component mounts
    loadSelectedSlug();
  }, [loadSelectedSlug, isAuth]);

  // Auto Redirect To Default Selected Slug
  useEffect(() => {
    if (isAuth) {

      router.push(`/biz/${selectedSlug}/dashboard`)
    }
  }, [selectedSlug, router, isAuth])

  useEffect(() => {
    if (!selectedSlug && businesses?.length && !isLoading) {
      // If no business is selected, default to the first business
      setSelectedSlug(businesses[0]?.slug || '');
    } else if (!isLoading && !businesses) {
      setOpen(true)
    }
  }, [selectedSlug, businesses, setSelectedSlug, isLoading, setOpen]);

  // Return loading state or dynamic nav links once slug is available
  const dynamicNavLinks = useMemo(() => {
    if (selectedSlug) {
      return getDynamicNavLink(selectedSlug);
    }
    return []; // Return an empty array while slug is loading
  }, [selectedSlug]);


  // Return dynamic navigation links and loading state
  return { dynamicNavLinks, isLoading, selectedSlug, setSelectedSlug };
};