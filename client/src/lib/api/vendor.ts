import { api } from "@/lib/api/axios";
import { Product } from "@/features/products/types";

export interface VendorDashboardStats {
  totalProducts: number;
  activeProducts: number;
  pendingProducts: number;
  totalOrders: number;
  revenue: number;
}

export interface VendorDashboardResponse {
  success: boolean;
  data: VendorDashboardStats;
}

export interface VendorProductsResponse {
  success: boolean;
  results: number;
  data: Product[];
}

/**
 * Fetches dashboard statistics for the logged-in vendor.
 * GET /api/vendors/dashboard
 */
export const getVendorDashboardStats = async (): Promise<VendorDashboardResponse> => {
  const response = await api.get<VendorDashboardResponse>("/vendors/dashboard");
  return response.data;
};

/**
 * Fetches products owned by the logged-in vendor.
 * GET /api/products/vendor/me
 */
export const getVendorProducts = async (): Promise<VendorProductsResponse> => {
  const response = await api.get<VendorProductsResponse>("/products/vendor/me");
  return response.data;
};
