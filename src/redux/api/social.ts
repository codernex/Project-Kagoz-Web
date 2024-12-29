import { baseApi } from "./base";

const social = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSocialMedia: builder.query<ISocial, void>({
      query: () => ({
        url: "/social",
      }),
    }),
  }),
});

export const { useLazyGetSocialMediaQuery } = social;
