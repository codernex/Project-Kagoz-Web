import { successMessage } from "@/lib/utils";
import { baseApi } from "./base";

const facilities = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFacilities: builder.query<IFacility[], void>({
      query: () => ({
        url: `/facilities`,
      }),
    }),
    addFacility: builder.mutation<IBusiness, any>({
      query: ({ slug, ...data }) => ({
        url: `/business/${slug}/facilities`,
        data,
        method: "PATCH",
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        await queryFulfilled;
        successMessage("Facility added to the business");
      },
      invalidatesTags: ["Business"],
    }),
  }),
});

export const { useGetFacilitiesQuery, useAddFacilityMutation } = facilities;
