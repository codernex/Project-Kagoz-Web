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
    // Multipart version to support logo file, url, rating, name fields
    addVideoFeedback: builder.mutation<IVideo, any>({
      query: ({ slug, data }) => ({
        url: `/business/video-feedback/${slug}`,
        data,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        successMessage("new video feedback added");
      },
      invalidatesTags: ["VideoFeedback"],
    }),
    updateVideoFeedback: builder.mutation<IVideo, { slug: string; feedbackId: string; data: FormData }>({
      query: ({ slug, feedbackId, data }) => ({
        url: `/business/video-feedback/${slug}/${feedbackId}`,
        data,
        method: "PATCH",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        successMessage("video feedback updated successfully");
      },
      invalidatesTags: ["VideoFeedback"],
    }),
    deleteVideoFeedback: builder.mutation<IVideo, { slug: string; feedbackId: string }>({
      query: ({ slug, feedbackId }) => ({
        url: `/business/video-feedback/${slug}/${feedbackId}`,
        method: "DELETE",
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        successMessage("video feedback deleted successfully");
      },
      invalidatesTags: ["VideoFeedback"],
    }),
  }),
});

export const { 
  useGetVideoFeedbacksQuery, 
  useAddVideoFeedbackMutation,
  useUpdateVideoFeedbackMutation,
  useDeleteVideoFeedbackMutation
} = feedback;
