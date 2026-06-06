// import { api } from "@/lib/api/axios";
// import type {
//   AdminDashboardResponse,
//   AdminVendorListResponse,
//   AdminVendorActionResponse,
//   AdminPendingProductsResponse,
//   AdminProductActionResponse,
// } from "@/features/admin/types";
// import type { ProductsListResponse, ProductQueryParams } from "@/features/products/types";
// import type {

//   AdminDashboardStats,
// } from "@/features/admin/types";

// // ─────────────────────────────────────────────────────────
// // Dashboard
// // ─────────────────────────────────────────────────────────

// export const getAdminDashboard = async (): Promise<AdminDashboardStats> => {
//   const response = await api.get<AdminDashboardResponse>("/admin/dashboard");
//   return response.data.data;
// };

// // ─────────────────────────────────────────────────────────
// // Vendor Management
// // ─────────────────────────────────────────────────────────

// export const getPendingVendors = async (): Promise<AdminVendorListResponse> => {
//   const response = await api.get<AdminVendorListResponse>("/admin/pending");
//   return response.data;
// };

// export const getAllVendors = async (
//   status?: string
// ): Promise<AdminVendorListResponse> => {
//   const params = status ? { status } : {};
//   const response = await api.get<AdminVendorListResponse>("/vendors", {
//     params,
//   });
//   return response.data;
// };

// export const approveVendor = async (
//   id: string
// ): Promise<AdminVendorActionResponse> => {
//   const response = await api.patch<AdminVendorActionResponse>(
//     `/admin/${id}/approve`
//   );
//   return response.data;
// };

// export const rejectVendor = async (
//   id: string,
//   reason?: string
// ): Promise<AdminVendorActionResponse> => {
//   const response = await api.patch<AdminVendorActionResponse>(
//     `/admin/${id}/reject`,
//     { reason }
//   );
//   return response.data;
// };

// export const suspendVendor = async (
//   id: string
// ): Promise<AdminVendorActionResponse> => {
//   const response = await api.patch<AdminVendorActionResponse>(
//     `/admin/${id}/suspend`
//   );
//   return response.data;
// };

// export const updateVendorStatus = async (
//   vendorId: string,
//   status: string
// ): Promise<AdminVendorActionResponse> => {
//   const response = await api.patch<AdminVendorActionResponse>(
//     `/vendors/${vendorId}/status`,
//     { status }
//   );
//   return response.data;
// };

// // ─────────────────────────────────────────────────────────
// // Product Management (Admin)
// // ─────────────────────────────────────────────────────────

// export const getPendingProducts =
//   async (): Promise<AdminPendingProductsResponse> => {
//     const response = await api.get<AdminPendingProductsResponse>(
//       "/admin/products/pending"
//     );
//     return response.data;
//   };

// export const approveProduct = async (
//   id: string
// ): Promise<AdminProductActionResponse> => {
//   const response = await api.patch<AdminProductActionResponse>(
//     `/admin/products/${id}/approve`
//   );
//   return response.data;
// };

// export const rejectProduct = async (
//   id: string
// ): Promise<AdminProductActionResponse> => {
//   const response = await api.patch<AdminProductActionResponse>(
//     `/admin/products/${id}/reject`
//   );
//   return response.data;
// };

// // ─────────────────────────────────────────────────────────
// // Products (Public — used by admin for listing)
// // ─────────────────────────────────────────────────────────

// export const getAdminProducts = async (
//   params?: ProductQueryParams
// ): Promise<ProductsListResponse> => {
//   const response = await api.get<ProductsListResponse>("/products", { params });
//   return response.data;
// };

// export const getAdminProductById = async (id: string) => {
//   const response = await api.get(`/products/${id}`);
//   return response.data;
// };

// // ─────────────────────────────────────────────────────────
// // Categories (Full CRUD)
// // ─────────────────────────────────────────────────────────

// export interface CategoryInput {
//   name: string;
//   description?: string;
// }

// export const getAdminCategories = async () => {
//   const response = await api.get("/categories");
//   return response.data;
// };

// export const getAdminCategoryById = async (id: string) => {
//   const response = await api.get(`/categories/${id}`);
//   return response.data;
// };

// export const createCategory = async (data: CategoryInput) => {
//   const response = await api.post("/categories", data);
//   return response.data;
// };

// export const updateCategory = async (id: string, data: CategoryInput) => {
//   const response = await api.patch(`/categories/${id}`, data);
//   return response.data;
// };

// export const deleteCategory = async (id: string) => {
//   const response = await api.delete(`/categories/${id}`);
//   return response.data;
// };


import { api } from "@/lib/api/axios";

import type {
  AdminDashboardResponse,
  AdminVendorListResponse,
  AdminVendorActionResponse,
  AdminPendingProductsResponse,
  AdminProductActionResponse,
  AdminDashboardStats,
} from "@/features/admin/types";

import type {
  ProductsListResponse,
  ProductQueryParams,
} from "@/features/products/types";

// ─────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────

export const getAdminDashboard = async (): Promise<AdminDashboardStats> => {
  const res = await api.get<AdminDashboardResponse>("/admin/dashboard");
  return res.data.data;
};

// ─────────────────────────────────────────────
// Vendors
// ─────────────────────────────────────────────

export const getPendingVendors = async (): Promise<AdminVendorListResponse> => {
  const res = await api.get("/admin/pending");
  return res.data;
};

export const getAllVendors = async (status?: string) => {
  const res = await api.get("/vendors", {
    params: status ? { status } : {},
  });
  return res.data;
};

export const approveVendor = async (id: string) => {
  const res = await api.patch<AdminVendorActionResponse>(
    `/admin/${id}/approve`
  );
  return res.data;
};

export const rejectVendor = async (id: string, reason?: string) => {
  const res = await api.patch<AdminVendorActionResponse>(
    `/admin/${id}/reject`,
    { reason }
  );
  return res.data;
};

export const suspendVendor = async (id: string) => {
  const res = await api.patch<AdminVendorActionResponse>(
    `/admin/${id}/suspend`
  );
  return res.data;
};

// ─────────────────────────────────────────────
// Products (Admin)
// ─────────────────────────────────────────────

export const getPendingProducts = async (): Promise<AdminPendingProductsResponse> => {
  const res = await api.get("/admin/products/pending");
  return res.data;
};

export const approveProduct = async (id: string) => {
  const res = await api.patch<AdminProductActionResponse>(
    `/admin/products/${id}/approve`
  );
  return res.data;
};

export const rejectProduct = async (id: string) => {
  const res = await api.patch<AdminProductActionResponse>(
    `/admin/products/${id}/reject`
  );
  return res.data;
};

// ─────────────────────────────────────────────
// Public Products (used in admin panel)
// ─────────────────────────────────────────────

export const getAdminProducts = async (
  params?: ProductQueryParams
): Promise<ProductsListResponse> => {
  const res = await api.get("/products", { params });
  return res.data;
};

export const getAdminProductById = async (id: string) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};