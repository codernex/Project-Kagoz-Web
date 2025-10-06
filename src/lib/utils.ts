import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { format, isBefore, subMonths } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const successMessage = (message: string) => {
  toast.success(message);
};

export function appendApi(file: string) {
  return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${file}`;
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

export function trimToWordCount(
  str: string | undefined,
  wordCount: number
): string {
  if (!str || wordCount <= 0) {
    return "";
  }

  // Trim and normalize spaces
  const words = str.trim().split(/\s+/);

  // If the string has fewer words than wordCount, return it as is
  if (words.length <= wordCount) {
    return str.trim();
  }

  // Slice and join the words
  return words.slice(0, wordCount).join(" ") + "...";
}

export function trimUrlByScreen(url: string): string {
  const screenWidth = window.innerWidth;

  let maxLength: number;

  if (screenWidth < 480) {
    // Mobile
    maxLength = 25;
  } else if (screenWidth < 768) {
    // Tablet
    maxLength = 40;
  } else {
    // Desktop
    maxLength = 60;
  }

  if (url.length <= maxLength) {
    return url;
  }

  return url.substring(0, maxLength - 3) + "...";
}

export const normalizeLocation = (location: string) => {
  return location.toLowerCase().split(" ").join("-");
};

export const isBlocked = (date: Date | string | undefined) => {
  return isBefore(new Date(date || new Date()), subMonths(new Date(), 6));
};
