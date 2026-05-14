import { apiSlice } from './apiSlice';

const DUMMYJSON_BASE_URL = 'https://dummyjson.com';

export interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedPrice: number;
  thumbnail: string;
}

export interface Cart {
  id: number;
  products: CartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

export interface CartsResponse {
  carts: Cart[];
  total: number;
  skip: number;
  limit: number;
}

export const cartsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all carts
    getCarts: builder.query<CartsResponse, { limit?: number; skip?: number }>({
      query: ({ limit = 20, skip = 0 } = {}) => ({
        url: `${DUMMYJSON_BASE_URL}/carts?limit=${limit}&skip=${skip}`,
        method: 'GET',
      }),
      providesTags: [{ type: 'Cart', id: 'LIST' }],
      keepUnusedDataFor: 300,
    }),

    // Get single cart
    getCart: builder.query<Cart, number>({
      query: (id) => ({
        url: `${DUMMYJSON_BASE_URL}/carts/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Cart', id }],
      keepUnusedDataFor: 600,
    }),

    // Get user carts
    getUserCarts: builder.query<CartsResponse, number>({
      query: (userId) => ({
        url: `${DUMMYJSON_BASE_URL}/carts/user/${userId}`,
        method: 'GET',
      }),
      providesTags: (result, error, userId) => [{ type: 'Cart', id: `USER-${userId}` }],
      keepUnusedDataFor: 300,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCartsQuery,
  useGetCartQuery,
  useGetUserCartsQuery,
} = cartsApi;
