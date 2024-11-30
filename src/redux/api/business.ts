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
    }),
  }),
});

export const {
  useRegisterBusinessMutation,
  useGetBusinessByCurrentUserQuery,
  useGetBusinessBySlugQuery,
} = business;
