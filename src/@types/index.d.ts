interface IBusiness {
  id: number;
  slug: string;
  name: string;
  owner: IUser;
  isOpen: boolean;
  city: string;
  country: string;
  tagLine:string;
  state: string;
  streetAddress: string;
  startingDate: string;
  logoUrl: string;
  bannerUrl: string;
  email: string;
  mobile: string;
  postalCode: string;
  primaryCategory: ICategory;
  subcategories: ICategory[];
  facilities: IFacility[];
  photos: IPhoto[];
  isApproved: boolean;
  faqs: {
    id: number;
    question: string;
    answer: string;
  };
  youtubeVideo: string;
  website: string;
  openingHours: OpeningHour[];
  tradeLicenseExpireDate: Date;
  about: string;
  facebook: string;
  linkedin: string;
  instagram: string;
  twitter: string;
  youtube: string;
  latitude: string;
  longitude: string;
  cid: string;
  fid: string;
  placedId: string;
  likes: number;
  tradeLicenseUrl: string;
  isTrusted: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ISocial {
  id: number;
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  content: string;
}

interface TimeRange {
  id: number;
  fromHours: string;
  fromMinutes: string;
  fromPeriod: string;
  toHours: string;
  toMinutes: string;
  toPeriod: string;
}

interface OpeningHour {
  id: number;
  day: string;
  isOpen: boolean;
  timeRanges: TimeRange[];
}

interface IUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  imageUrl: string;
  ownerText: string;
}

interface IPhoto {
  id: number;
  url: string;
}

interface IVideo {
  id: number;
  videoUrl: string;
}

interface IPayment {
  id: number;
}

interface IPremiumFeature {
  id: number;
  name: string;
  featureType: string;
  price: number;
  duration: number;
}

interface IFeaturedOffer {
  id: number;
  imageUrl: string;
  ctaUrl: string;
}

interface ICategory {
  id: number;
  name: string;
  businessCount: number;
  slug: string;
  business: IBusiness[];
  updatedAt: string;
  iconUrl: string;
  about: string;
  details: string;
}

interface IFacility {
  id: number;
  name: string;
  iconUrl: string;
}

interface IReview {
  id: number;
  name: string;
  phone: string;
  message: string;
  imageUrl: string;
  rating: string;
  createdAt: string;
}

interface IBlog {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}
interface ISeo {
  id: number;
  name: string;
  title: string;
  pageType: PageType;
  keyword: string;
  description: string;
  seo_image: string;
  canonical: string;
  index: boolean;
  follow: boolean;
  createdAt: Date | string | number;
  updatedAt: Date | string | number;
}

interface LocationContactData {
  streetAddress: string
  houseRoad: string
  localArea: string
  city: string
  postalCode: string
  country: string
  mobile: string
  website: string
  facebook: string
}