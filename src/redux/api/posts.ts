import { baseApi } from "./base";

const posts = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<IBlog[], void>({
      query: () => ({
        url: "/posts/public",
      }),
    }),
  }),
});

export const { useGetPostsQuery } = posts;
