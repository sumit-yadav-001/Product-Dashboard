import { apiSlice } from './apiSlice';

const DUMMYJSON_BASE_URL = 'https://dummyjson.com';

export interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
}

export interface RecipesResponse {
  recipes: Recipe[];
  total: number;
  skip: number;
  limit: number;
}

export const recipesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all recipes
    getRecipes: builder.query<RecipesResponse, { limit?: number; skip?: number; q?: string }>({
      query: ({ limit = 30, skip = 0, q } = {}) => {
        const params = new URLSearchParams();
        params.append('limit', limit.toString());
        params.append('skip', skip.toString());
        
        const url = q 
          ? `${DUMMYJSON_BASE_URL}/recipes/search?q=${encodeURIComponent(q)}&${params.toString()}`
          : `${DUMMYJSON_BASE_URL}/recipes?${params.toString()}`;
        
        return { url, method: 'GET' };
      },
      providesTags: [{ type: 'Recipe', id: 'LIST' }],
      keepUnusedDataFor: 300,
    }),

    // Get single recipe
    getRecipe: builder.query<Recipe, number>({
      query: (id) => ({
        url: `${DUMMYJSON_BASE_URL}/recipes/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Recipe', id }],
      keepUnusedDataFor: 600,
    }),

    // Get recipes by tag
    getRecipesByTag: builder.query<RecipesResponse, string>({
      query: (tag) => ({
        url: `${DUMMYJSON_BASE_URL}/recipes/tag/${tag}`,
        method: 'GET',
      }),
      providesTags: (result, error, tag) => [{ type: 'Recipe', id: `TAG-${tag}` }],
      keepUnusedDataFor: 300,
    }),

    // Get recipe tags
    getRecipeTags: builder.query<string[], void>({
      query: () => ({
        url: `${DUMMYJSON_BASE_URL}/recipes/tags`,
        method: 'GET',
      }),
      keepUnusedDataFor: 3600,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRecipesQuery,
  useGetRecipeQuery,
  useGetRecipesByTagQuery,
  useGetRecipeTagsQuery,
} = recipesApi;
