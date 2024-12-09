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

export function extractYouTubeVideoId(url: string): string {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/.*[?&]v=([^&]+)/, // For URLs like https://www.youtube.com/watch?v=4Z9mUjtFJYY
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?&]+)/, // For URLs like https://youtu.be/4Z9mUjtFJYY?si=UwmAIzPU5CsTBwDJ
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return ""; // Return null if no video ID is found
}

export const TK_SYMBOL = "৳";
