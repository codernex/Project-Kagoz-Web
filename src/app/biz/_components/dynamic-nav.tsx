import { useAuth } from "@/context/AuthContext";
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
  MinusCircle,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export const navLinks: { name: string; href: string; icon: LucideIcon }[] = [
  {
    name: "Home",
    href: "/biz/dashboard",
    icon: HomeIcon,
  },
  {
    name: "Photo Gallery",
    href: "/biz/dashboard/gallery",
    icon: Images,
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
    name: "KAGOZ Ads",
    href: "/biz/dashboard/ads",
    icon: Megaphone,
  },
  {
    name: "Remove Ads",
    href: "/biz/dashboard/remove-ads",
    icon: MinusCircle,
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
  const { data: businesses, isLoading } = useGetBusinessByCurrentUserQuery({ all: false, limit: 10, page: 1 }, {
    skip: !isAuth
  })
  const { selectedSlug, setSelectedSlug, loadSelectedSlug } = useBusinessStore();
  const router = useRouter()
  const pathName = usePathname()
  useEffect(() => {
    loadSelectedSlug();
  }, [loadSelectedSlug]);

  // Auto Redirect To Default Selected Slug
  useEffect(() => {
    if (isAuth && selectedSlug !== 'null' && pathName.includes('dashboard')) {
      console.log("Business Redirect");
      // router.push(`/biz/${selectedSlug}/dashboard`)
    }
  }, [selectedSlug, router, isAuth, pathName])

  useEffect(() => {
    if (selectedSlug === 'null' && businesses?.business?.length && !isLoading) {
      // If no business is selected, default to the first business
      setSelectedSlug(businesses?.business[0]?.slug || '');
      router.push(`/biz/${businesses?.business[0]?.slug}/dashboard`)
    }
  }, [selectedSlug, businesses, setSelectedSlug, isLoading, router]);

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