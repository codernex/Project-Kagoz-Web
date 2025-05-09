import { successMessage } from "@/lib/utils";
import { baseApi } from "./base";

const reviews = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReview: builder.query<IReview[], string>({
      query: (slug) => {
        if (slug) {
          return {
            url: `/reviews/${slug}`,
          };
        } else {
          return {
            url: `/reviews/unknown`,
          };
        }
      },
    }),
    createReview: builder.mutation<IReview, any>({
      query: ({ slug, data }) => ({
        url: `/reviews/${slug}`,
        data,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        await queryFulfilled;
        successMessage("Your review submitted");
      },
    }),
  }),
});

export const { useCreateReviewMutation, useGetReviewQuery } = reviews;
