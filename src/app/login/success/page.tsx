"use client"
import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";

const LoginSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cookies = useCookies();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) return;

    // Persist token like in AuthContext.login
    cookies.set("auth_token", token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    });
    if (typeof window !== "undefined") {
      localStorage.setItem("_auth", token);
    }

    router.replace("/business-dashboard");
  }, [searchParams, cookies, router]);

  return null;
};

export default LoginSuccessPage;


