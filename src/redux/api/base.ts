import { createApi } from "@reduxjs/toolkit/query/react";
import axios, { AxiosResponse } from "axios";
import { toast } from "sonner";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((req) => {
  req.headers.Authorization = `Bearer ${localStorage.getItem("_auth")}`;
  return req;
});

axiosInstance.interceptors.response.use((res) => {
  return res;
});

interface IBaseQuery<TData> {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";
  data?: TData;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

const baseQuery =
  <TData, TRes extends { data: any }>({ baseURL = "/" }) =>
  async ({ method = "GET", url, data, headers, params }: IBaseQuery<TData>) => {
    try {
      const response = await axiosInstance<any, AxiosResponse<TRes>>({
        headers,
        data,
        url: baseURL + url,
        method,
        params,
      });
      return {
        data: response.data.data,
      };
    } catch (axiosError: any) {
      const err = axiosError;
      toast.error(err?.response?.data.message);
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const baseApi = createApi({
  baseQuery: baseQuery({ baseURL: process.env.NEXT_PUBLIC_API_URL }),
  endpoints: () => ({}),
  refetchOnReconnect: true,
  tagTypes: ["Business", "Gallery", "FeaturedClient", "VideoFeedback","Payments","PremiumFeature"],
});
