import { successMessage } from "@/lib/utils";
import { baseApi } from "./base";

const featuredOffer = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeaturedOffer: builder.query<IFeaturedOffer[], string>({
      query: (slug) => ({
        url: `/business/featured-offer/${slug}`,
      }),
      providesTags: ["FeaturedOffer"],
    }),
    addFeaturedOffer: builder.mutation<IVideo, any>({
      query: ({ slug, data }) => ({
        url: `/business/featured-offer/${slug}`,
        data,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        successMessage("new featured offer added");
      },
      invalidatesTags: ["FeaturedOffer"],
    }),
  }),
});

export const { useGetFeaturedOfferQuery, useAddFeaturedOfferMutation } =
  featuredOffer;
