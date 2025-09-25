"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { axiosInstance } from "@/redux/api/base";
import { toast } from "sonner";

interface GoogleContinueButtonProps {
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  label?: string;
}

export const GoogleContinueButton: React.FC<GoogleContinueButtonProps> = ({
  className,
  variant = "outline",
  label = "Continue with Google",
}) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const res = await axiosInstance.get<{ data: { url: string } }>(
        "/auth/google/url"
      );
      const url = (res.data as any)?.data?.url;
      if (!url) {
        throw new Error("Auth URL not received");
      }
      window.location.href = url;
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to start Google login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      disabled={loading}
      className={
        "w-full flex cursor-pointer text-[#111827] items-center justify-center gap-2 " +
        (className || "")
      }
    >
      <Image
        width={20}
        height={20}
        src="https://www.svgrepo.com/show/355037/google.svg"
        alt="Google"
        className="w-[16px] h-[16px]"
      />
      {loading ? "Redirecting..." : label}
    </Button>
  );
};

export default GoogleContinueButton;


