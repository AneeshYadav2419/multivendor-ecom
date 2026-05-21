import { api } from "@/lib/api/axios";
import {
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
