import { baseApi } from "./base";

const premiumFeature = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    isFeatureActive: builder.query<
      { hasFeatureActive: boolean },
      { type: string; slug: string }
    >({
      query: (data) => ({
        url: `/premium-feature?type=${data.type}&slug=${data.slug}`,
      }),
      providesTags: ["PremiumFeature"],
    }),
  }),
});

export const { useIsFeatureActiveQuery, useLazyIsFeatureActiveQuery } =
  premiumFeature;
