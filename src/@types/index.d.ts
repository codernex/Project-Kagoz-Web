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
  createdAt: string;
  updatedAt: string;
}

interface IUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
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
