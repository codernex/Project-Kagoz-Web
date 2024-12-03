import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const successMessage = (message: string) => {
  toast.success(message);
};

export function appendApi(file: string) {
  return process.env.NEXT_PUBLIC_API_URL + "/uploads/" + file;
}
