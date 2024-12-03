interface IBusiness {
  id: number;
  slug: string;
  name: string;
  owner: IUser;
  isOpen: boolean;
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
