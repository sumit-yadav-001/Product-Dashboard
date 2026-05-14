import { apiSlice } from './apiSlice';
import { Product, ProductsResponse, ProductQueryParams, Category } from '@/types';

const DUMMYJSON_BASE_URL = 'https://dummyjson.com';

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all products with pagination and search
    getProducts: builder.query<ProductsResponse, ProductQueryParams>({
      query: ({ limit = 30, skip = 0, q, select } = {}) => {
        const params = new URLSearchParams();
        params.append('limit', limit.toString());
        params.append('skip', skip.toString());
        if (select) params.append('select', select);
        
        const url = q 
          ? `${DUMMYJSON_BASE_URL}/products/search?q=${encodeURIComponent(q)}&${params.toString()}`
          : `${DUMMYJSON_BASE_URL}/products?${params.toString()}`;
        
        return {
          url,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
      keepUnusedDataFor: 300, // Cache for 5 minutes
    }),

    // Get single product by ID
    getProduct: builder.query<Product, number>({
      query: (id) => ({
        url: `${DUMMYJSON_BASE_URL}/products/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Product', id }],
      keepUnusedDataFor: 600, // Cache for 10 minutes
    }),

    // Get all categories
    getCategories: builder.query<Category[], void>({
      query: () => ({
        url: `${DUMMYJSON_BASE_URL}/products/categories`,
        method: 'GET',
      }),
      transformResponse: (response: string[]) => {
        return response.map((category) => ({
          slug: category,
          name: category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' '),
          url: `/products/category/${category}`,
        }));
      },
      keepUnusedDataFor: 3600, // Cache for 1 hour
    }),

    // Get products by category
    getProductsByCategory: builder.query<ProductsResponse, { category: string; limit?: number; skip?: number }>({
      query: ({ category, limit = 30, skip = 0 }) => ({
        url: `${DUMMYJSON_BASE_URL}/products/category/${category}?limit=${limit}&skip=${skip}`,
        method: 'GET',
      }),
      providesTags: (result, error, { category }) => [
        { type: 'Product', id: `CATEGORY-${category}` },
      ],
      keepUnusedDataFor: 300,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery,
  useLazyGetProductsQuery,
  useLazyGetProductQuery,
} = productsApi;
