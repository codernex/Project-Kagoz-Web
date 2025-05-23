import { successMessage } from "@/lib/utils";
import { baseApi } from "./base";
import { CreateVideoFeedback } from "@/schema/video-feedback";

const feedback = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVideoFeedbacks: builder.query<IVideo[], string>({
      query: (slug) => ({
        url: `/business/video-feedback/${slug}`,
      }),
      providesTags: ["VideoFeedback"],
    }),
    addVideoFeedback: builder.mutation<
      IVideo,
      CreateVideoFeedback & { slug: string }
    >({
      query: ({ slug, ...data }) => ({
        url: `/business/video-feedback/${slug}`,
        data,
        method: "POST",
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        successMessage("new video feedback added");
      },
      invalidatesTags: ["VideoFeedback"],
    }),
  }),
});

export const { useGetVideoFeedbacksQuery, useAddVideoFeedbackMutation } =
  feedback;
