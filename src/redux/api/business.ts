import { successMessage } from "@/lib/utils";
import { toast } from "sonner";
import { baseApi } from "./base";

const business = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerBusiness: builder.mutation<any, any>({
      query: (data) => ({
        url: "/business",
        method: "POST",
        data,
      }),
      onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
        const { data } = await queryFulfilled;

        dispatch(
          business.util.updateQueryData(
            "getBusinessByCurrentUser",
            undefined,
            (draft) => [...draft, data]
          )
        );

        toast.success("new business registered, successfully");
      },
    }),
    getBusinessByCurrentUser: builder.query<IBusiness[], void>({
      query: () => ({
        url: "/business/me",
      }),
    }),

    getBusinessBySlug: builder.query<IBusiness, string>({
      query: (slug) => ({
        url: `/business/${slug}`,
      }),
      providesTags: ["Business"],
    }),

    addCategoryToBusiness: builder.mutation<IBusiness, any>({
      query: ({ slug, ...data }) => ({
        url: `/business/${slug}/categories`,
        method: "PATCH",
        data,
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        await queryFulfilled;
        successMessage("Category Updated");
      },
      invalidatesTags: ["Business"],
    }),

    updateBusiness: builder.mutation<IBusiness, any>({
      query: ({ slug, data }) => ({
        url: `/business/${slug}`,
        data,
        method: "PATCH",
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        await queryFulfilled;
        successMessage("Business updated succesfully");
      },
      invalidatesTags: ["Business"],
    }),

    getPhotos: builder.query<IPhoto[], string>({
      query: (slug) => {
        return {
          url: `/business/gallery/${slug}`,
        };
      },
      providesTags: ["Gallery"],
    }),
    uploadPhoto: builder.mutation<IPhoto, any>({
      query: ({ slug, data }) => ({
        url: `/business/gallery/${slug}`,
        data,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        successMessage("new photo added to gallery");
      },
      invalidatesTags: ["Gallery"],
    }),

    /**
     * Feature Clients
     */
    addFeaturedClient: builder.mutation<IPhoto, any>({
      query: ({ slug, data }) => ({
        url: `/business/featured-clients/${slug}`,
        data,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        successMessage("new featured client added");
      },
      invalidatesTags: ["FeaturedClient"],
    }),
    getFeauturedClients: builder.query<IPhoto[], string>({
      query: (slug) => {
        return {
          url: `/business/featured-clients/${slug}`,
        };
      },
      providesTags: ["FeaturedClient"],
    }),
    getFaqs: builder.query<IBusiness["faqs"][], string>({
      query: (slug) => ({
        url: `/business/${slug}/faqs`,
      }),
      providesTags: ["Faq"],
    }),
    addFaq: builder.mutation<IBusiness["faqs"], any>({
      query: ({ slug, ...data }) => ({
        url: `/business/${slug}/faqs`,
        data,
        method: "POST",
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        await queryFulfilled;
        successMessage("Faq added");
      },
      invalidatesTags: ["Faq"],
    }),
    updateLicense: builder.mutation<IBusiness, any>({
      query: ({ slug, data }) => ({
        url: `/business/${slug}/trade-license`,
        method: "PATCH",
        data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        await queryFulfilled;
        successMessage("Trade license updated");
      },
      invalidatesTags: ["Business"],
    }),
    setOpeningHours: builder.mutation<any, any>({
      query: ({ slug, ...data }) => {
        return {
          url: `/business/${slug}/opening-hour`,
          method: "PATCH",
          data,
        };
      },
      onQueryStarted: async (_, { queryFulfilled }) => {
        await queryFulfilled;
        successMessage("Opening hour updated");
      },
      invalidatesTags: ["Business"],
    }),
  }),
});

export const {
  useRegisterBusinessMutation,
  useGetBusinessByCurrentUserQuery,
  useGetBusinessBySlugQuery,
  useGetPhotosQuery,
  useUploadPhotoMutation,
  useAddFeaturedClientMutation,
  useGetFeauturedClientsQuery,
  useUpdateBusinessMutation,
  useAddCategoryToBusinessMutation,
  useGetFaqsQuery,
  useAddFaqMutation,
  useUpdateLicenseMutation,
  useSetOpeningHoursMutation,
} = business;
