export interface ProductCategoryRef {
  name: string;
}

export interface ProductVendorRef {
  storeName: string;
  id?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string | number;
  stock: number;
  images: string[];
  isActive: boolean;
  categoryId: string;
  vendorId: string;
  createdAt: string;
  updatedAt: string;
  category?: ProductCategoryRef;
  vendor?: ProductVendorRef;
}

export interface ProductPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductsListResponse {
  success: boolean;
  results: number;
  pagination: ProductPagination;
  data: Product[];
}

export interface ProductDetailResponse {
  success: boolean;
  data: Product;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  sortBy?: "price_asc" | "price_desc" | "newest" | "oldest";
}
