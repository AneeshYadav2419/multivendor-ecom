import { api } from "@/lib/api/axios";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesListResponse {
  success: boolean;
  results: number;
  data: Category[];
}

/**
 * Fetches all product categories.
 * GET /api/categories
 */
export const getCategories = async (): Promise<CategoriesListResponse> => {
  const response = await api.get<CategoriesListResponse>("/categories");
  return response.data;
};
