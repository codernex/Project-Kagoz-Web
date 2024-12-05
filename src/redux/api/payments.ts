import { FeatureType } from "@/types";
import { baseApi } from "./base";

const payments = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    activatePremiumFeature: builder.mutation<
      { url: string },
      { slug: string; type: FeatureType }
    >({
      query: (data) => ({
        url: "/payments/init",
        data,
        method: "POST",
      }),
    }),
  }),
});

export const { useActivatePremiumFeatureMutation } = payments;
