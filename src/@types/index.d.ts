interface IBusiness {
  id: number;
  slug: string;
  name: string;
  owner: IUser;
  isOpen: boolean;
  city: string;
  state: string;
  streetAddress: string;
  startingDate: string;
  logoUrl: string;
  email: string;
  mobile: string;
  postalCode: string;
  primaryCategory: ICategory;
  subcategories: ICategory[];
  facilities: IFacility[];
  faqs: {
    id: number;
    question: string;
    answer: string;
  };
  website: string;
  openingHours: OpeningHour[];
  tradeLicenseExpireDate: Date;
  about: string;
  facebook: string;
  linkedin: string;
  instagram: string;
  twitter: string;
  youtube: string;
  likes: number;
  tradeLicenseUrl: string;
  isTrusted: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
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
