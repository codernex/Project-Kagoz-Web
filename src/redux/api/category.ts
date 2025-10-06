import { baseApi } from "./base";

const category = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<ICategory[], void>({
      query: () => ({
        url: `/categories`,
      }),
    }),
    getSubcategories: builder.query<ICategory[], number>({
      query: (id) => ({
        url: `/categories/${id}`,
      }),
    }),
    getDescription: builder.query<
      { description: string },
      { category: string; location: string | undefined }
    >({
      query: (params) => ({
        url: "/categories/locations/description",
        params,
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetSubcategoriesQuery,
  useLazyGetCategoriesQuery,
  useGetDescriptionQuery,
} = category;
