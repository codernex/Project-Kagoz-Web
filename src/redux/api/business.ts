import { successMessage } from "@/lib/utils";
import { toast } from "sonner";
import { baseApi } from "./base";

type BusinessQuery = {
  page: number;
  limit: number;
  all: boolean;
};

type PaginatedBusinessResponse = {
  business: IBusiness[];
  currentPage: number;
  totalPages: number;
};

const business = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerBusiness: builder.mutation<any, any>({
      query: (data) => ({
        url: "/business",
        method: "POST",
        data,
      }),
      onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
        await queryFulfilled;
        toast.success("new business registered, successfully");
      },
      invalidatesTags: ["CurrentUsersBusiness"],
    }),
    getBusinessByCurrentUser: builder.query<
      PaginatedBusinessResponse,
      BusinessQuery | undefined
    >({
      query: (params) => ({
        url: "/business/me",
        params,
      }),
      providesTags: ["CurrentUsersBusiness"],
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

    // Dedicated YouTube URL update mutation
    updateBusinessYouTubeVideo: builder.mutation<IBusiness, { slug: string; youtubeVideo: string }>({
      query: ({ slug, youtubeVideo }) => ({
        url: `/business/${slug}`,
        data: { youtubeVideo },
        method: "PATCH",
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        await queryFulfilled;
        successMessage("Promo video updated successfully");
      },
      invalidatesTags: ["Business"],
    }),
    // New: send logo and banner together via multipart/form-data (POST)
    updateBusinessMedia: builder.mutation<IBusiness, { slug: string; data: FormData }>({
      query: ({ slug, data }) => ({
        url: `/business/${slug}`,
        data,
        method: "PATCH",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        await queryFulfilled;
        successMessage("Business media updated succesfully");
      },
      invalidatesTags: ["Business"],
    }),
    addBanner: builder.mutation<IBusiness, { slug: string; data: FormData }>({
      query: ({ slug, data }) => ({
        url: `/business/${slug}/banner`,
        data,
        method: "PATCH",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        await queryFulfilled;
        successMessage("Banner image added succesfully");
      },
      invalidatesTags: ["Business"],
    }),

    addLogo: builder.mutation<IBusiness, { slug: string; data: FormData }>({
      query: ({ slug, data }) => ({
        url: `/business/${slug}/logo`,
        data,
        method: "PATCH",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        await queryFulfilled;
        successMessage("Logo image added succesfully");
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
        successMessage("Photo added to gallery successfully");
      },
      invalidatesTags: ["Gallery"],
    }),

    // New mutation for uploading multiple gallery photos at once
    uploadMultiplePhotos: builder.mutation<IPhoto[], { slug: string; files: File[] }>({
      query: ({ slug, files }) => {
        const formData = new FormData();
        files.forEach((file, index) => {
          formData.append(`images`, file);
        });
        return {
          url: `/business/gallery/${slug}/multiple`,
          data: formData,
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        successMessage("Gallery photos uploaded successfully");
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
    likeBusiness: builder.mutation<string, string>({
      query: (slug) => ({
        url: `/business/${slug}/like`,
        method: "POST",
      }),
      invalidatesTags: ["Business"],
    }),
    hasLikedBusiness: builder.query<{ hasLiked: boolean }, string>({
      query: (slug) => ({
        url: `/business/${slug}/like`,
      }),
    }),
    getTotalPageViews: builder.query<any, any>({
      query: (slug) => ({
        url: `/business/${slug}/page-views/total`,
      }),
    }),
    getDailyPageViews: builder.query<any, any>({
      query: (slug) => ({
        url: `/business/${slug}/page-views/daily`,
      }),
    }),
    getSiteFaq: builder.query<IBusiness["faqs"][], void>({
      query: () => ({
        url: "/faq",
      }),
      providesTags: ["Faq"],
    }),

    getSponsoredBusiness: builder.query<IBusiness[], void>({
      query: () => ({
        url: "/business/sponsored-business",
      }),
    }),
    getBusinessByQuery: builder.query<
      {
        items: IBusiness[];
        totalItems: number;
        totalPages: number;
        currentPage: number;
      },
      {
        category?: string;
        name?: string;
        isTrusted?: boolean;
        isVerified?: boolean;
        sortBy?: string;
        isOpen?: boolean;
        isClosed?: boolean;
        page: number;
        limit: number;
        latitude: number | null;
        longitude: number | null;
        location?: string | null;
      }
    >({
      query: (query) => ({
        url: "/business/search",
        params: query,
      }),
    }),
    getBusiness: builder.query<IBusiness[], { name: string; location: string }>(
      {
        query: (params) => {
          return {
            url: "/business",
            params,
          };
        },
      }
    ),
    claimBusiness: builder.mutation<any, any>({
      query: ({ slug, ...data }) => ({
        url: `/business/claim/${slug}`,
        data,
        method: "POST",
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          successMessage(
            "Your request is submitted, we will contact you soon."
          );
        } catch (error) {}
      },
    }),
    getRelatedBusiness: builder.query<IBusiness[], string>({
      query: (slug) => ({
        url: `/business/related/${slug}`,
      }),
    }),
  }),
});

export const {
  useRegisterBusinessMutation,
  useGetBusinessByCurrentUserQuery,
  useGetBusinessBySlugQuery,
  useGetPhotosQuery,
  useUploadPhotoMutation,
  useUploadMultiplePhotosMutation,
  useAddBannerMutation,
  useAddLogoMutation,
  useAddFeaturedClientMutation,
  useGetFeauturedClientsQuery,
  useUpdateBusinessMutation,
  useUpdateBusinessYouTubeVideoMutation,
  useUpdateBusinessMediaMutation,
  useAddCategoryToBusinessMutation,
  useGetFaqsQuery,
  useAddFaqMutation,
  useUpdateLicenseMutation,
  useSetOpeningHoursMutation,
  useLikeBusinessMutation,
  useHasLikedBusinessQuery,
  useGetTotalPageViewsQuery,
  useGetDailyPageViewsQuery,
  useLazyGetSiteFaqQuery,
  useGetSponsoredBusinessQuery,
  useLazyGetSponsoredBusinessQuery,
  useGetBusinessByQueryQuery,
  useGetBusinessQuery,
  useLazyGetBusinessQuery,
  useClaimBusinessMutation,
  useGetRelatedBusinessQuery,
} = business;
