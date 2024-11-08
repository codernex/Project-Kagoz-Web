interface IBusiness {
  id: number;
  isOpen: boolean;
}

interface IUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}
