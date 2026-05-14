import { apiSlice } from './apiSlice';

const DUMMYJSON_BASE_URL = 'https://dummyjson.com';

export interface DummyUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  image: string;
  age: number;
  gender: string;
  birthDate: string;
  address: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  company: {
    name: string;
    title: string;
    department: string;
  };
  role: string;
}

export interface UsersResponse {
  users: DummyUser[];
  total: number;
  skip: number;
  limit: number;
}

export interface UserQueryParams {
  limit?: number;
  skip?: number;
  q?: string;
  select?: string;
}

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users with pagination and search
    getUsers: builder.query<UsersResponse, UserQueryParams>({
      query: ({ limit = 30, skip = 0, q, select } = {}) => {
        const params = new URLSearchParams();
        params.append('limit', limit.toString());
        params.append('skip', skip.toString());
        if (select) params.append('select', select);
        
        const url = q 
          ? `${DUMMYJSON_BASE_URL}/users/search?q=${encodeURIComponent(q)}&${params.toString()}`
          : `${DUMMYJSON_BASE_URL}/users?${params.toString()}`;
        
        return {
          url,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.users.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
      keepUnusedDataFor: 300, // Cache for 5 minutes
    }),

    // Get single user by ID
    getUser: builder.query<DummyUser, number>({
      query: (id) => ({
        url: `${DUMMYJSON_BASE_URL}/users/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'User', id }],
      keepUnusedDataFor: 600, // Cache for 10 minutes
    }),

    // Filter users by key-value
    filterUsers: builder.query<UsersResponse, { key: string; value: string }>({
      query: ({ key, value }) => ({
        url: `${DUMMYJSON_BASE_URL}/users/filter?key=${key}&value=${value}`,
        method: 'GET',
      }),
      providesTags: [{ type: 'User', id: 'FILTERED' }],
      keepUnusedDataFor: 300,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useFilterUsersQuery,
  useLazyGetUsersQuery,
  useLazyGetUserQuery,
} = usersApi;
