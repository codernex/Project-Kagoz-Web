import { baseApi } from "./base";

const category = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<ICategory[], void>({
      query: () => ({
        url: "/categories",
      }),
    }),
    getSubcategories: builder.query<ICategory[], number>({
      query: (id) => ({
        url: `/categories/${id}`,
      }),
    }),
  }),
});

export const { useGetCategoriesQuery, useGetSubcategoriesQuery } = category;
