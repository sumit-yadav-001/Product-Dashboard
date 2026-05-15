import { apiSlice } from './apiSlice';

const DUMMYJSON_BASE_URL = 'https://dummyjson.com';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

export interface PostQueryParams {
  limit?: number;
  skip?: number;
  q?: string;
  select?: string;
}

export interface CreatePostPayload {
  title: string;
  body: string;
  userId: number;
  tags: string[];
  reactions?: { likes: number; dislikes: number };
}

export const postsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all posts with pagination
    getPosts: builder.query<PostsResponse, PostQueryParams>({
      query: ({ limit = 30, skip = 0, q, select } = {}) => {
        const params = new URLSearchParams();
        params.append('limit', limit.toString());
        params.append('skip', skip.toString());
        if (select) params.append('select', select);

        const url = q
          ? `${DUMMYJSON_BASE_URL}/posts/search?q=${encodeURIComponent(q)}&${params.toString()}`
          : `${DUMMYJSON_BASE_URL}/posts?${params.toString()}`;

        return { url, method: 'GET' };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.posts.map(({ id }) => ({ type: 'Post' as const, id })),
              { type: 'Post', id: 'LIST' },
            ]
          : [{ type: 'Post', id: 'LIST' }],
      keepUnusedDataFor: 300,
    }),

    // Get single post by ID
    getPost: builder.query<Post, number>({
      query: (id) => ({
        url: `${DUMMYJSON_BASE_URL}/posts/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Post', id }],
      keepUnusedDataFor: 600,
    }),

    // Get posts by user
    getPostsByUser: builder.query<PostsResponse, number>({
      query: (userId) => ({
        url: `${DUMMYJSON_BASE_URL}/posts/user/${userId}`,
        method: 'GET',
      }),
      providesTags: (result, error, userId) => [{ type: 'Post', id: `USER-${userId}` }],
      keepUnusedDataFor: 300,
    }),

    // Create a new post (POST /posts/add)
    createPost: builder.mutation<Post, CreatePostPayload>({
      query: (body) => ({
        url: `${DUMMYJSON_BASE_URL}/posts/add`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useGetPostsByUserQuery,
  useLazyGetPostsQuery,
  useCreatePostMutation,
} = postsApi;
