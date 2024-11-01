import {
  AwardIcon,
  BookmarkPlus,
  HomeIcon,
  Images,
  ListVideo,
  type LucideIcon,
  Megaphone,
} from "lucide-react";

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
