import { api } from "@/lib/api/axios";
import {
  Product,
  ProductDetailResponse,
  ProductQueryParams,
  ProductsListResponse,
} from "@/features/products/types";

export const getProducts = async (
  params?: ProductQueryParams
): Promise<ProductsListResponse> => {
  const response = await api.get<ProductsListResponse>("/products", { params });
  return response.data;
};

export const getProductById = async (id: string): Promise<ProductDetailResponse> => {
  const response = await api.get<ProductDetailResponse>(`/products/${id}`);
  return response.data;
};

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  images: string[];
  status?: "DRAFT" | "ACTIVE" | "OUT_OF_STOCK" | "ARCHIVED";
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
  images?: string[];
  status?: "DRAFT" | "ACTIVE" | "OUT_OF_STOCK" | "ARCHIVED";
}

export const createProduct = async (data: CreateProductInput): Promise<ProductDetailResponse> => {
  const response = await api.post<ProductDetailResponse>("/products", data);
  return response.data;
};

export const updateProduct = async (
  id: string,
  data: UpdateProductInput
): Promise<ProductDetailResponse> => {
  const response = await api.patch<ProductDetailResponse>(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete<{ success: boolean; message: string }>(`/products/${id}`);
  return response.data;
};

