import { api } from "@/lib/api/axios";
import type {
    AdminPendingProductsResponse,
    AdminProductActionResponse,
} from "@/features/admin/types";
import type {
    ProductsListResponse,
    ProductQueryParams,
} from "@/features/products/types";

// ─────────────────────────────────────────────
// Admin - Pending Products
// ─────────────────────────────────────────────

export const getPendingProducts = async (): Promise<AdminPendingProductsResponse> => {
    const res = await api.get("/admin/products/pending");
    return res.data;
};

// ─────────────────────────────────────────────
// Admin Actions
// ─────────────────────────────────────────────

export const approveProduct = async (
    id: string
): Promise<AdminProductActionResponse> => {
    const res = await api.patch(`/admin/products/${id}/approve`);
    return res.data;
};

export const rejectProduct = async (
    id: string
): Promise<AdminProductActionResponse> => {
    const res = await api.patch(`/admin/products/${id}/reject`);
    return res.data;
};

// ─────────────────────────────────────────────
// Admin Product Listing (All Products)
// ─────────────────────────────────────────────

export const getAdminProducts = async (
    params?: ProductQueryParams
): Promise<ProductsListResponse> => {
    const res = await api.get("/products", { params });
    return res.data;
};

// ─────────────────────────────────────────────
// Single Product Detail
// ─────────────────────────────────────────────

export const getAdminProductById = async (id: string) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
};