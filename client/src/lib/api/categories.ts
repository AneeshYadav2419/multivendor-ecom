// import { api } from "@/lib/api/axios";

// export interface Category {
//   id: string;
//   name: string;
//   slug: string;
//   description?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface CategoriesListResponse {
//   success: boolean;
//   results: number;
//   data: Category[];
// }

// /**
//  * Fetches all product categories.
//  * GET /api/categories
//  */
// export const getCategories = async (): Promise<CategoriesListResponse> => {
//   const response = await api.get<CategoriesListResponse>("/categories");
//   return response.data;
// };
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

export interface CategoryResponse {
  success: boolean;
  data: Category;
}

export interface CategoryInput {
  name: string;
  description?: string;
}

// Get All Categories
export const getCategories =
  async (): Promise<CategoriesListResponse> => {
    const response = await api.get("/categories");
    return response.data;
  };

// Get Single Category
export const getCategoryById = async (
  id: string
): Promise<CategoryResponse> => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

// Create Category
export const createCategory = async (
  data: CategoryInput
) => {
  const response = await api.post(
    "/categories",
    data
  );

  return response.data;
};

// Update Category
export const updateCategory = async (
  id: string,
  data: CategoryInput
) => {
  const response = await api.patch(
    `/categories/${id}`,
    data
  );

  return response.data;
};

// Delete Category
export const deleteCategory = async (
  id: string
) => {
  const response = await api.delete(
    `/categories/${id}`
  );

  return response.data;
};