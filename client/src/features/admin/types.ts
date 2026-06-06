// ─────────────────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────────────────

export interface AdminDashboardStats {
  totalUsers: number;
  totalVendors: number;
  activeVendors: number;
  pendingVendors: number;
  totalProducts: number;
  pendingProducts: number;
  activeProducts: number;
  totalOrders: number;
  completedOrders: number;
}

export interface AdminDashboardResponse {
  success: boolean;
  data: AdminDashboardStats;
}

// ─────────────────────────────────────────────────────────
// Vendors
// ─────────────────────────────────────────────────────────

export type VendorStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

export interface AdminVendorUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminVendor {
  id: string;
  storeName: string;
  description: string | null;
  rejectionReason: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  logo: string | null;
  banner: string | null;
  gstNumber: string | null;
  isVerified: boolean;
  status: VendorStatus;
  profileCompleted: boolean;
  userId: string;
  user: AdminVendorUser;
  createdAt: string;
  updatedAt: string;
}

export interface AdminVendorListResponse {
  success: boolean;
  results?: number;
  data: AdminVendor[];
}

export interface AdminVendorActionResponse {
  success: boolean;
  message: string;
  data: AdminVendor;
}

// ─────────────────────────────────────────────────────────
// Products (Admin)
// ─────────────────────────────────────────────────────────

export type ProductStatus = "DRAFT" | "ACTIVE" | "OUT_OF_STOCK" | "ARCHIVED";

export interface AdminProductVendor {
  id: string;
  storeName: string;
}

export interface AdminProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string | number;
  stock: number;
  images: string[];
  status: ProductStatus;
  vendorId: string;
  categoryId: string;
  vendor: AdminProductVendor;
  category: AdminProductCategory;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPendingProductsResponse {
  success: boolean;
  results: number;
  data: AdminProduct[];
}

export interface AdminProductActionResponse {
  success: boolean;
  message: string;
  data: AdminProduct;
}

// ─────────────────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────────────────

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCategoryListResponse {
  success: boolean;
  results: number;
  data: AdminCategory[];
}

export interface AdminCategoryActionResponse {
  success: boolean;
  message?: string;
  data: AdminCategory;
}

// ─────────────────────────────────────────────────────────
// Generic
// ─────────────────────────────────────────────────────────

export interface AdminDeleteResponse {
  success: boolean;
  message: string;
}
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUsersResponse {
  success: boolean;
  results: number;
  data: AdminUser[];
}