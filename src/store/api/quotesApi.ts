import { apiSlice } from './apiSlice';

const DUMMYJSON_BASE_URL = 'https://dummyjson.com';

export interface Quote {
  id: number;
  quote: string;
  author: string;
}

export interface QuotesResponse {
  quotes: Quote[];
  total: number;
  skip: number;
  limit: number;
}

export const quotesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all quotes
    getQuotes: builder.query<QuotesResponse, { limit?: number; skip?: number }>({
      query: ({ limit = 30, skip = 0 } = {}) => ({
        url: `${DUMMYJSON_BASE_URL}/quotes?limit=${limit}&skip=${skip}`,
        method: 'GET',
      }),
      providesTags: [{ type: 'Quote', id: 'LIST' }],
      keepUnusedDataFor: 300,
    }),

    // Get single quote
    getQuote: builder.query<Quote, number>({
      query: (id) => ({
        url: `${DUMMYJSON_BASE_URL}/quotes/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Quote', id }],
      keepUnusedDataFor: 600,
    }),

    // Get random quote
    getRandomQuote: builder.query<Quote, void>({
      query: () => ({
        url: `${DUMMYJSON_BASE_URL}/quotes/random`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0, // Don't cache random quotes
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetQuotesQuery,
  useGetQuoteQuery,
  useGetRandomQuoteQuery,
} = quotesApi;
